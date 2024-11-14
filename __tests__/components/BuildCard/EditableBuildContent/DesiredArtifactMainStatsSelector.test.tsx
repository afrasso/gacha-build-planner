import { render, screen, within } from "@testing-library/react";
import React, { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DesiredArtifactMainStatsSelector from "@/components/BuildCard/EditableBuildContent/DesiredArtifactMainStatsSelector";
import { ArtifactType, DesiredArtifactMainStats, Stat } from "@/types";

vi.mock("@/components/ui/button");
vi.mock("@/components/ui/label");
vi.mock("@/components/ui/select");
vi.mock("lucide-react");

describe("When the DesiredArtifactMainStatsSelector is rendered", () => {
  const mockOnChange = vi.fn();
  const renderComponent = async (desiredArtifactMainStats: DesiredArtifactMainStats = {}) => {
    await act(async () => {
      render(
        <DesiredArtifactMainStatsSelector desiredArtifactMainStats={desiredArtifactMainStats} onChange={mockOnChange} />
      );
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with no initial values", async () => {
    await renderComponent();

    const label = screen.getByTestId("main-stats-label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Main Stats:");

    [ArtifactType.SANDS, ArtifactType.GOBLET, ArtifactType.CIRCLET].forEach((artifactType) => {
      const mainStatSelector = screen.getByTestId(artifactType);
      expect(mainStatSelector).toBeInTheDocument();
      const emptyContent = within(mainStatSelector).getByTestId("stat-not-populated");
      expect(emptyContent).toBeInTheDocument();
      expect(emptyContent).toHaveTextContent("Not selected");
    });
  });

  it("renders correctly with initial values", async () => {
    const desiredArtifactMainStats: DesiredArtifactMainStats = {
      [ArtifactType.CIRCLET]: Stat.CRIT_RATE,
      [ArtifactType.GOBLET]: Stat.DMG_BONUS_PYRO,
      [ArtifactType.SANDS]: Stat.ATK_PERCENT,
    };

    await renderComponent(desiredArtifactMainStats);

    const label = screen.getByTestId("main-stats-label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Main Stats:");

    [ArtifactType.SANDS, ArtifactType.GOBLET, ArtifactType.CIRCLET].forEach((artifactType) => {
      const mainStatSelector = screen.getByTestId(artifactType);
      expect(mainStatSelector).toBeInTheDocument();
      const emptyContent = within(mainStatSelector).getByTestId("stat-populated");
      expect(emptyContent).toBeInTheDocument();
      expect(emptyContent).toHaveTextContent(`${desiredArtifactMainStats[artifactType]}`);
    });
  });
});
