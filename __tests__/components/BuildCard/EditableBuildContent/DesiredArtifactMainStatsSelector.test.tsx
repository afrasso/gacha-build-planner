import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DesiredArtifactMainStatsSelector from "@/components/BuildCard/EditableBuildContent/DesiredArtifactMainStatsSelector";
import { IDataContext } from "@/contexts/DataContext";

const dataContext: IDataContext = {} as IDataContext;
vi.mock("@/contexts/DataContext", () => ({
  useDataContext: vi.fn(() => dataContext),
}));

describe("When the DesiredArtifactMainStatsSelector is rendered", () => {
  const mockOnChange = vi.fn();
  const renderComponent = (desiredArtifactMainStats: Record<string, string[]> = {}) => {
    render(
      <DesiredArtifactMainStatsSelector desiredArtifactMainStats={desiredArtifactMainStats} onChange={mockOnChange} />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    dataContext.getArtifactTypesWithVariableMainStats = () => [
      { iconUrl: "circlet.png", key: "CIRCLET" },
      { iconUrl: "goblet.png", key: "GOBLET" },
      { iconUrl: "sands.png", key: "SANDS" },
    ];
    dataContext.getPossibleArtifactMainStats = () => [
      "ATK_FLAT",
      "ATK_PERCENT",
      "DEF_FLAT",
      "DEF_PERCENT",
      "HP_FLAT",
      "HP_PERCENT",
    ];
  });

  it("renders correctly", () => {
    const desiredArtifactMainStats: Record<string, string[]> = {
      CIRCLET: ["CRIT_RATE"],
      GOBLET: ["DMG_BONUS_PYRO"],
      SANDS: ["ATK_PERCENT"],
    };

    renderComponent(desiredArtifactMainStats);

    const label = screen.getByTestId("main-stats-label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Main Stats:");

    ["SANDS", "GOBLET", "CIRCLET"].forEach((artifactType) => {
      const artifactLabel = screen.getByTestId(`${artifactType}-label`);
      expect(artifactLabel).toBeInTheDocument();
    });
  });
});
