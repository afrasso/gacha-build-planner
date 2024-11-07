"use client";

import { CardContent } from "@/components/ui/card";
import {
  ArtifactSet,
  ArtifactSetBonus,
  Build,
  BuildArtifacts,
  DesiredArtifactMainStats,
  OverallStat,
  StatValue,
  Weapon,
} from "@/types";

import ArtifactCollection from "./ArtifactCollection";
import DesiredArtifactMainStatsSelector from "./DesiredArtifactMainStatsSelector";
import DesiredArtifactSetBonusSelector from "./DesiredArtifactSetBonusSelector";
import DesiredStatsSelector from "./DesiredStatsSelector";
import WeaponSelector from "./WeaponSelector";

interface EditableBuildContentProps {
  artifactSets: ArtifactSet[];
  build: Build;
  onUpdate: (buildId: string, build: Partial<Build>) => void;
  weapons: Weapon[];
}

const EditableBuildContent: React.FC<EditableBuildContentProps> = ({ artifactSets, build, onUpdate, weapons }) => {
  const updateWeapon = (weapon: Weapon) => {
    const buildId = build.character.id;
    onUpdate(buildId, { weapon });
  };

  const updateDesiredArtifactSetBonuses = (desiredArtifactSetBonuses: ArtifactSetBonus[]) => {
    const buildId = build.character.id;
    onUpdate(buildId, { character: build.character, desiredArtifactSetBonuses });
  };

  const updateDesiredArtifactMainStats = (desiredArtifactMainStats: DesiredArtifactMainStats) => {
    const buildId = build.character.id;
    onUpdate(buildId, { character: build.character, desiredArtifactMainStats });
  };

  const updateDesiredStats = (desiredStats: StatValue<OverallStat>[]) => {
    const buildId = build.character.id;
    onUpdate(buildId, { character: build.character, desiredStats });
  };

  const updateArtifacts = (artifacts: BuildArtifacts) => {
    const buildId = build.character.id;
    onUpdate(buildId, { artifacts, character: build.character });
  };

  return (
    <CardContent>
      <WeaponSelector onChange={updateWeapon} selectedWeapon={build.weapon} weapons={weapons} />
      <DesiredArtifactSetBonusSelector
        artifactSets={artifactSets}
        desiredArtifactSetBonuses={build.desiredArtifactSetBonuses}
        onChange={updateDesiredArtifactSetBonuses}
      />
      <DesiredArtifactMainStatsSelector
        desiredArtifactMainStats={build.desiredArtifactMainStats}
        onChange={updateDesiredArtifactMainStats}
      />
      <DesiredStatsSelector desiredStats={build.desiredStats} onChange={updateDesiredStats} />
      <ArtifactCollection artifacts={build.artifacts} artifactSets={artifactSets} onUpdate={updateArtifacts} />
    </CardContent>
  );
};

export default EditableBuildContent;
