import { render, screen, within } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DesiredArtifactMainStatsSelector from "@/components/BuildCard/EditableBuildContent/DesiredArtifactMainStatsSelector";
import { ArtifactType, DesiredArtifactMainStats, Stat } from "@/types";

describe("When the DesiredArtifactMainStatsSelector is rendered", () => {
  const mockOnChange = vi.fn();
  const renderComponent = (desiredArtifactMainStats: DesiredArtifactMainStats = {}) => {
    render(
      <DesiredArtifactMainStatsSelector desiredArtifactMainStats={desiredArtifactMainStats} onChange={mockOnChange} />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    const desiredArtifactMainStats: DesiredArtifactMainStats = {
      [ArtifactType.CIRCLET]: [Stat.CRIT_RATE],
      [ArtifactType.GOBLET]: [Stat.DMG_BONUS_PYRO],
      [ArtifactType.SANDS]: [Stat.ATK_PERCENT],
    };

    renderComponent(desiredArtifactMainStats);

    const label = screen.getByTestId("main-stats-label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Main Stats:");

    [ArtifactType.SANDS, ArtifactType.GOBLET, ArtifactType.CIRCLET].forEach((artifactType) => {
      const artifactLabel = screen.getByTestId(`${artifactType}-label`);
      expect(artifactLabel).toBeInTheDocument();
    });
  });
});
