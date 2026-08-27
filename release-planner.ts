const PLUGIN_NAME = "getuserfeedback.com" as const;

type ReleaseAsset = {
	id: number;
	name: string;
	/** GitHub reports interrupted uploads as a non-uploaded asset such as `starter`. */
	state?: string;
	/** Populated by a byte-verification observation; omitted means not checked yet. */
	bytesMatch?: boolean;
};

export type ReleaseObservation = {
	id: number;
	tagName: string;
	name: string | null;
	targetCommitish: string;
	draft: boolean;
	prerelease: boolean;
	assets: readonly ReleaseAsset[];
};

export type ReleasePlan =
	| {
			action: "create-draft";
			reason: "missing-release";
	  }
	| {
			action: "reconcile-draft";
			reason: "missing-assets" | "replace-mismatched-assets";
			releaseId: number;
			uploadAssetNames: readonly string[];
			deleteAssetIds: readonly number[];
	  }
	| {
			action: "verify-draft";
			reason: "all-assets-present";
			releaseId: number;
	  }
	| {
			action: "verify-published";
			reason: "published-assets-present";
			releaseId: number;
	  }
	| {
			action: "publish-draft";
			reason: "verified-draft";
			releaseId: number;
	  }
	| {
			action: "accept-published";
			reason: "verified-published-release";
			releaseId: number;
	  };

export type ReleasePlannerInput = {
	version: string;
	targetCommit: string;
	tagTargetCommit: string | null;
	release: ReleaseObservation | null;
	/** True only after both downloaded assets have been byte-compared and checked. */
	assetsVerified?: boolean;
	/** Used by the workflow to ensure an upload/reconciliation did not change release identity. */
	expectedReleaseId?: number;
};

export type ReleaseArtifacts = {
	version: string;
	releaseName: typeof PLUGIN_NAME;
	tagName: string;
	archiveName: string;
	checksumName: string;
};

const stableCoreSemVer = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function isStableCoreSemVer(version: string): boolean {
	return stableCoreSemVer.test(version);
}

export function buildReleaseArtifacts(version: string): ReleaseArtifacts {
	if (!isStableCoreSemVer(version)) {
		throw new Error(`Plugin version must be stable core SemVer: ${version}`);
	}

	return {
		version,
		releaseName: PLUGIN_NAME,
		tagName: `${PLUGIN_NAME}-plugin-v${version}`,
		archiveName: `${PLUGIN_NAME}-agent-plugin-v${version}.zip`,
		checksumName: `${PLUGIN_NAME}-agent-plugin-v${version}.zip.sha256`,
	};
}

const fail = (message: string): never => {
	throw new Error(`Release refused: ${message}`);
};

const needsDraftAssetReplacement = (asset: ReleaseAsset): boolean =>
	asset.bytesMatch === false ||
	(asset.state !== undefined && asset.state !== "uploaded");

export function planRelease(input: ReleasePlannerInput): ReleasePlan {
	const artifacts = buildReleaseArtifacts(input.version);
	const expectedAssets = new Set([
		artifacts.archiveName,
		artifacts.checksumName,
	]);

	if (input.release === null) {
		if (input.tagTargetCommit !== null) {
			fail("the version tag exists without its canonical release");
		}
		return { action: "create-draft", reason: "missing-release" };
	}

	const release = input.release;
	if (
		input.expectedReleaseId !== undefined &&
		release.id !== input.expectedReleaseId
	) {
		fail("release identity changed while reconciling");
	}
	if (release.tagName !== artifacts.tagName) {
		fail("release tag does not match the version authority");
	}
	if (release.name !== artifacts.releaseName) {
		fail("release title does not match the public name");
	}
	if (release.prerelease) {
		fail("a prerelease can never satisfy the stable release");
	}
	if (release.draft && input.tagTargetCommit === null) {
		if (release.targetCommitish !== input.targetCommit) {
			fail("the untagged draft does not target the triggering commit");
		}
	} else if (input.tagTargetCommit !== input.targetCommit) {
		fail("the version tag does not target the triggering commit");
	}

	const assetNames = release.assets.map((asset) => asset.name);
	const unexpectedAssetNames = assetNames.filter(
		(name) => !expectedAssets.has(name),
	);
	if (unexpectedAssetNames.length > 0) {
		fail(`unexpected asset names: ${unexpectedAssetNames.join(", ")}`);
	}

	const missingAssetNames = [...expectedAssets].filter(
		(name) => !assetNames.includes(name),
	);
	const mismatchedAssetNames = release.assets
		.filter(
			(asset) =>
				expectedAssets.has(asset.name) && needsDraftAssetReplacement(asset),
		)
		.map((asset) => asset.name);
	const duplicateAssetNames = assetNames.filter(
		(name, index) => assetNames.indexOf(name) !== index,
	);
	if (duplicateAssetNames.length > 0) {
		fail(`duplicate asset names: ${duplicateAssetNames.join(", ")}`);
	}

	if (release.draft) {
		if (missingAssetNames.length > 0 || mismatchedAssetNames.length > 0) {
			return {
				action: "reconcile-draft",
				reason:
					mismatchedAssetNames.length > 0
						? "replace-mismatched-assets"
						: "missing-assets",
				releaseId: release.id,
				uploadAssetNames: [...missingAssetNames, ...mismatchedAssetNames],
				deleteAssetIds: release.assets
					.filter(
						(asset) =>
							expectedAssets.has(asset.name) &&
							needsDraftAssetReplacement(asset),
					)
					.map((asset) => asset.id),
			};
		}
		if (input.assetsVerified) {
			return {
				action: "publish-draft",
				reason: "verified-draft",
				releaseId: release.id,
			};
		}
		return {
			action: "verify-draft",
			reason: "all-assets-present",
			releaseId: release.id,
		};
	}

	if (mismatchedAssetNames.length > 0) {
		fail("published release contains an unexpected asset byte sequence");
	}
	if (missingAssetNames.length > 0) {
		fail("published release is missing an expected asset");
	}
	if (!input.assetsVerified) {
		return {
			action: "verify-published",
			reason: "published-assets-present",
			releaseId: release.id,
		};
	}
	return {
		action: "accept-published",
		reason: "verified-published-release",
		releaseId: release.id,
	};
}
