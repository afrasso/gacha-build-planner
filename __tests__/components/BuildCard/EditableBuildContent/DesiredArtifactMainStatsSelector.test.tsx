import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom";

import DesiredArtifactMainStatsSelector from "@/components/BuildCard/EditableBuildContent/DesiredArtifactMainStatsSelector";
import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { ArtifactMainStats, ArtifactType, Stat } from "@/types";

jest.mock("@/components/ui/label");
jest.mock("@/components/ui/select");

describe("When the DesiredArtifactMainStatsSelector is rendered", () => {
  const mockOnChange = jest.fn();

  const generateArtifactMainStats = () => {
    return {} as ArtifactMainStats;
  };

  const renderComponent = (desiredArtifactMainStats: ArtifactMainStats) => {
    const ref = React.createRef<ISaveableContentHandle>();
    render(
      <DesiredArtifactMainStatsSelector
        desiredArtifactMainStats={desiredArtifactMainStats}
        onChange={mockOnChange}
        ref={ref}
      />
    );
    return ref;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const initialDesiredArtifactMainStats = generateArtifactMainStats();
    renderComponent(initialDesiredArtifactMainStats);

    expect(screen.getByText("Desired Artifact Main Stats")).toBeInTheDocument();
    expect(screen.getByTestId(ArtifactType.SANDS)).toBeInTheDocument();
    expect(screen.getByTestId(ArtifactType.SANDS)).toHaveValue(undefined);
    expect(screen.getByTestId(ArtifactType.GOBLET)).toBeInTheDocument();
    expect(screen.getByTestId(ArtifactType.GOBLET)).toHaveValue(undefined);
    expect(screen.getByTestId(ArtifactType.CIRCLET)).toBeInTheDocument();
    expect(screen.getByTestId(ArtifactType.CIRCLET)).toHaveValue(undefined);
  });

  it("displays provided initial values", () => {
    const initialDesiredArtifactMainStats = generateArtifactMainStats();
    initialDesiredArtifactMainStats[ArtifactType.SANDS] = Stat.ATK_PERCENT;
    initialDesiredArtifactMainStats[ArtifactType.GOBLET] = Stat.DMG_BONUS_PYRO;
    initialDesiredArtifactMainStats[ArtifactType.CIRCLET] = Stat.CRIT_RATE;

    renderComponent(initialDesiredArtifactMainStats);

    expect(screen.getByTestId(ArtifactType.SANDS)).toBeInTheDocument();
    expect(screen.getByTestId(ArtifactType.SANDS)).toHaveValue(initialDesiredArtifactMainStats[ArtifactType.SANDS]);
    expect(screen.getByTestId(ArtifactType.GOBLET)).toBeInTheDocument();
    expect(screen.getByTestId(ArtifactType.GOBLET)).toHaveValue(initialDesiredArtifactMainStats[ArtifactType.GOBLET]);
    expect(screen.getByTestId(ArtifactType.CIRCLET)).toBeInTheDocument();
    expect(screen.getByTestId(ArtifactType.CIRCLET)).toHaveValue(initialDesiredArtifactMainStats[ArtifactType.CIRCLET]);
  });

  it("does not call onChange when a main stat is selected", async () => {
    const initialDesiredArtifactMainStats = generateArtifactMainStats();
    renderComponent(initialDesiredArtifactMainStats);

    const sandsSelect = screen.getByTestId(ArtifactType.SANDS);
    await userEvent.selectOptions(sandsSelect, Stat.DEF_PERCENT);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("does calls onChange when the component is saved", async () => {
    const initialDesiredArtifactMainStats = generateArtifactMainStats();
    const ref = renderComponent(initialDesiredArtifactMainStats);
    expect(ref.current).toBeDefined();
    expect(ref.current?.save).toBeInstanceOf(Function);

    const sandsSelect = screen.getByTestId(ArtifactType.SANDS);
    await userEvent.selectOptions(sandsSelect, Stat.DEF_PERCENT);
    const saveResult = ref.current?.save();
    expect(saveResult).toBe(true);
    expect(mockOnChange).toHaveBeenCalledWith({
      ...initialDesiredArtifactMainStats,
      [ArtifactType.SANDS]: Stat.DEF_PERCENT,
    });
  });
});
