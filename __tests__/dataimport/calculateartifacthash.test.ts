import { describe, expect, it } from "vitest";

import { calculateArtifactHash } from "@/dataimport/calculateartifacthash";

describe("dataimport calculateArtifactHash", () => {
  const baseArtifact = {
    level: 20,
    mainStatKey: "HP_FLAT",
    rarity: 5,
    setId: "set-1",
    typeKey: "FLOWER",
  };

  it("should produce the same hash regardless of substat order", () => {
    const hashA = calculateArtifactHash({
      ...baseArtifact,
      subStats: [
        { key: "ATK_FLAT", value: 16 },
        { key: "CRIT_RATE", value: 7 },
      ],
    });
    const hashB = calculateArtifactHash({
      ...baseArtifact,
      subStats: [
        { key: "CRIT_RATE", value: 7 },
        { key: "ATK_FLAT", value: 16 },
      ],
    });

    expect(hashA).toBe(hashB);
  });

  it("should produce different hashes when artifact properties differ", () => {
    const hashA = calculateArtifactHash({
      ...baseArtifact,
      subStats: [{ key: "ATK_FLAT", value: 16 }],
    });
    const hashB = calculateArtifactHash({
      ...baseArtifact,
      level: 21,
      subStats: [{ key: "ATK_FLAT", value: 16 }],
    });

    expect(hashA).not.toBe(hashB);
  });
});
