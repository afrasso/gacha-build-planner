import { expect } from "vitest";

import { Build } from "@/types";

export const compareBuilds = ({ actualBuilds, expectedBuilds }: { actualBuilds: Build[]; expectedBuilds: Build[] }) => {
  expect(expectedBuilds.length).toBe(actualBuilds.length);
  expectedBuilds.forEach((expectedBuild) => {
    const actualBuild = actualBuilds.find((build) => build.characterId === expectedBuild.characterId);
    expect(actualBuild).not.toBeUndefined();
    expect(actualBuild!.artifacts).toEqual(expectedBuild.artifacts);
    expect(actualBuild!.desiredArtifactMainStats).toEqual(expectedBuild.desiredArtifactMainStats);
    expect(actualBuild!.desiredOverallStats).toEqual(expectedBuild.desiredOverallStats);
    expect(actualBuild!.weaponId).toEqual(expectedBuild.weaponId);
  });
};
