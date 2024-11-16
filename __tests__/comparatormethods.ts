import { expect } from "vitest";

import { Build } from "@/types";

export const compareBuilds = ({ actualBuilds, expectedBuilds }: { actualBuilds: Build[]; expectedBuilds: Build[] }) => {
  expect(expectedBuilds.length).toBe(actualBuilds.length);
  expectedBuilds.forEach((expectedBuild) => {
    const actualBuild = actualBuilds.find((build) => build.character.id === expectedBuild.character.id);
    expect(actualBuild).not.toBeUndefined();
    expect(actualBuild!.artifacts).toEqual(expectedBuild.artifacts);
    expect(actualBuild!.character).toEqual(expectedBuild.character);
    expect(actualBuild!.desiredArtifactMainStats).toEqual(expectedBuild.desiredArtifactMainStats);
    expect(actualBuild!.desiredStats).toEqual(expectedBuild.desiredStats);
    expect(actualBuild!.weapon).toEqual(expectedBuild.weapon);
  });
};
