import {
	buildReleaseArtifacts,
	planRelease,
	type ReleaseObservation,
	type ReleasePlannerInput,
} from "./release-planner.ts";

type RawAsset = {
	id: number;
	name: string;
	state?: string;
	url?: string;
};

type RawRelease = {
	id: number;
	tag_name: string;
	name: string | null;
	target_commitish: string;
	draft: boolean;
	prerelease: boolean;
	upload_url?: string;
	assets?: RawAsset[];
};

export type ReleaseObservationState = {
	release: RawRelease | null;
	tagTargetCommit: string | null;
};

const argumentValue = (arguments_: readonly string[], name: string): string => {
	const index = arguments_.indexOf(name);
	const value = index < 0 ? undefined : arguments_[index + 1];
	if (!value) {
		throw new Error(`Missing ${name}`);
	}
	return value;
};

const flattenReleasePages = (value: unknown): RawRelease[] => {
	if (!Array.isArray(value)) {
		throw new Error("Release list response must be an array");
	}
	const pages = value.every((entry) => Array.isArray(entry)) ? value : [value];
	return pages.flatMap((page) => {
		if (!Array.isArray(page)) {
			throw new Error("Release list page must be an array");
		}
		return page as RawRelease[];
	});
};

export function observeReleaseList(
	releases: unknown,
	tagName: string,
	tagTargetCommit: string | null,
): ReleaseObservationState {
	const matching = flattenReleasePages(releases).filter(
		(release) => release.tag_name === tagName,
	);
	if (matching.length > 1) {
		throw new Error(`Release refused: duplicate releases for ${tagName}`);
	}
	return { release: matching[0] ?? null, tagTargetCommit };
}

export function toReleaseObservation(
	state: ReleaseObservationState,
	bytesMismatchedNames: readonly string[] = [],
): ReleaseObservation | null {
	if (!state.release) {
		return null;
	}
	const mismatched = new Set(bytesMismatchedNames);
	return {
		id: state.release.id,
		tagName: state.release.tag_name,
		name: state.release.name,
		targetCommitish: state.release.target_commitish,
		draft: state.release.draft,
		prerelease: state.release.prerelease,
		assets: (state.release.assets ?? []).map((asset) => ({
			id: asset.id,
			name: asset.name,
			...(asset.state === undefined ? {} : { state: asset.state }),
			...(mismatched.has(asset.name) ? { bytesMatch: false } : {}),
		})),
	};
}

const readState = async (path: string): Promise<ReleaseObservationState> => {
	const value = JSON.parse(await Bun.file(path).text()) as
		| ReleaseObservationState
		| RawRelease;
	if ("release" in value) {
		return value as ReleaseObservationState;
	}
	return {
		release: value as RawRelease,
		tagTargetCommit: null,
	};
};

if (import.meta.main) {
	const arguments_ = Bun.argv.slice(2);
	const command = arguments_[0];
	if (command === "artifacts") {
		const manifestPath = argumentValue(arguments_, "--manifest");
		const manifest = JSON.parse(await Bun.file(manifestPath).text()) as {
			name?: string;
			version?: string;
		};
		if (manifest.name !== "getuserfeedback.com" || !manifest.version) {
			throw new Error(
				"Manifest is not the canonical getuserfeedback.com plugin",
			);
		}
		console.log(JSON.stringify(buildReleaseArtifacts(manifest.version)));
	} else if (command === "observe") {
		const releasesPath = argumentValue(arguments_, "--releases-file");
		const tagName = argumentValue(arguments_, "--tag");
		const tagTargetCommitValue = argumentValue(
			arguments_,
			"--tag-target-commit",
		);
		const tagTargetCommit =
			tagTargetCommitValue === "null" ? null : tagTargetCommitValue;
		const releasesText = await Bun.file(releasesPath).text();
		let releases: unknown;
		try {
			releases = JSON.parse(releasesText);
		} catch {
			releases = releasesText
				.split(/\r?\n/)
				.filter(Boolean)
				.map((line) => JSON.parse(line));
		}
		const state = observeReleaseList(releases, tagName, tagTargetCommit);
		console.log(JSON.stringify(state));
	} else if (command === "plan") {
		const statePath = argumentValue(arguments_, "--release-file");
		const version = argumentValue(arguments_, "--version");
		const targetCommit = argumentValue(arguments_, "--target-commit");
		const expectedReleaseIdValue = arguments_.find(
			(_, index) => arguments_[index - 1] === "--expected-release-id",
		);
		const mismatchedNames = arguments_
			.filter((_, index) => arguments_[index - 1] === "--mismatched-asset")
			.filter(Boolean);
		const state = await readState(statePath);
		const input: ReleasePlannerInput = {
			version,
			targetCommit,
			tagTargetCommit: state.tagTargetCommit,
			release: toReleaseObservation(state, mismatchedNames),
			assetsVerified: arguments_.includes("--assets-verified"),
			...(expectedReleaseIdValue
				? { expectedReleaseId: Number(expectedReleaseIdValue) }
				: {}),
		};
		console.log(JSON.stringify(planRelease(input)));
	} else {
		throw new Error("Usage: artifacts|observe|plan ...");
	}
}
