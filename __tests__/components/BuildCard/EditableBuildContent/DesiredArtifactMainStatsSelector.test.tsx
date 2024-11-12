import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

import DesiredArtifactMainStatsSelector from "@/components/BuildCard/EditableBuildContent/DesiredArtifactMainStatsSelector";
import { ArtifactType, DesiredArtifactMainStats, Stat } from "@/types";

vi.mock("@/components/ui/button");
vi.mock("@/components/ui/label");
vi.mock("@/components/ui/select");
vi.mock("lucide-react");

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

  it("renders correctly with no initial values", () => {
    renderComponent();

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

  it("renders correctly with initial values", () => {
    const desiredArtifactMainStats: DesiredArtifactMainStats = {
      [ArtifactType.CIRCLET]: Stat.CRIT_RATE,
      [ArtifactType.GOBLET]: Stat.DMG_BONUS_PYRO,
      [ArtifactType.SANDS]: Stat.ATK_PERCENT,
    };

    renderComponent(desiredArtifactMainStats);

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

  it.skip("does not call onChange when a main stat is selected", async () => {
    const initialDesiredArtifactMainStats = generateArtifactMainStats();
    renderComponent(initialDesiredArtifactMainStats);

    const sandsSelect = screen.getByTestId(ArtifactType.SANDS);
    await userEvent.selectOptions(sandsSelect, Stat.DEF_PERCENT);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it.skip("does calls onChange when the component is saved", async () => {
    const initialDesiredArtifactMainStats = generateArtifactMainStats();
    const sandsSelect = screen.getByTestId(ArtifactType.SANDS);
    await userEvent.selectOptions(sandsSelect, Stat.DEF_PERCENT);
    expect(mockOnChange).toHaveBeenCalledWith({
      ...initialDesiredArtifactMainStats,
      [ArtifactType.SANDS]: Stat.DEF_PERCENT,
    });
  });
});
