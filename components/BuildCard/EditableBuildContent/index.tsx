"use client";

import { CardContent } from "@/components/ui/card";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import {
  ArtifactSet,
  ArtifactSetBonus,
  Build,
  BuildArtifacts,
  DesiredArtifactMainStats,
  OverallStat,
  StatValue,
} from "@/types";

import ArtifactCollection from "./ArtifactCollection";
import DesiredArtifactMainStatsSelector from "./DesiredArtifactMainStatsSelector";
import DesiredArtifactSetBonusSelector from "./DesiredArtifactSetBonusSelector";
import DesiredStatsSelector from "./DesiredStatsSelector";
import WeaponSelector from "./WeaponSelector";
import { calculateStats } from "@/calculators/stats";

interface EditableBuildContentProps {
  artifactSets: ArtifactSet[];
  build: Build;
  onUpdate: (buildId: string, build: Partial<Build>) => void;
}

const EditableBuildContent: React.FC<EditableBuildContentProps> = ({ build, onUpdate }) => {
  const genshinDataContext = useGenshinDataContext();
  const currentStats = calculateStats({ build, genshinDataContext });

  const updateWeapon = (weaponId: string) => {
    onUpdate(build.characterId, { weaponId });
  };

  const updateDesiredArtifactSetBonuses = (desiredArtifactSetBonuses: ArtifactSetBonus[]) => {
    onUpdate(build.characterId, { desiredArtifactSetBonuses });
  };

  const updateDesiredArtifactMainStats = (desiredArtifactMainStats: DesiredArtifactMainStats) => {
    onUpdate(build.characterId, { desiredArtifactMainStats });
  };

  const updateDesiredStats = (desiredStats: StatValue<OverallStat>[]) => {
    onUpdate(build.characterId, { desiredStats });
  };

  const updateArtifacts = (artifacts: BuildArtifacts) => {
    onUpdate(build.characterId, { artifacts });
  };

  return (
    <CardContent>
      <WeaponSelector onChange={updateWeapon} selectedWeaponId={build.weaponId} />
      <DesiredArtifactSetBonusSelector
        desiredArtifactSetBonuses={build.desiredArtifactSetBonuses}
        onChange={updateDesiredArtifactSetBonuses}
      />
      <DesiredArtifactMainStatsSelector
        desiredArtifactMainStats={build.desiredArtifactMainStats}
        onChange={updateDesiredArtifactMainStats}
      />
      <DesiredStatsSelector
        currentStats={currentStats}
        desiredStats={build.desiredStats}
        onChange={updateDesiredStats}
      />
      <ArtifactCollection artifacts={build.artifacts} onUpdate={updateArtifacts} />
    </CardContent>
  );
};

export default EditableBuildContent;
