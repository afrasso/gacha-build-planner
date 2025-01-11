"use client";

import { calculateStats } from "@/calculators/stats";
import { CardContent } from "@/components/ui/card";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import {
  ArtifactSet,
  ArtifactSetBonus,
  Build,
  BuildArtifacts,
  DesiredArtifactMainStats,
  DesiredOverallStat,
} from "@/types";

import ArtifactCollection from "./ArtifactCollection";
import DesiredArtifactMainStatsSelector from "./DesiredArtifactMainStatsSelector";
import DesiredArtifactSetBonusSelector from "./DesiredArtifactSetBonusSelector";
import DesiredOverallStatsSelector from "./DesiredOverallStatsSelector";
import WeaponSelector from "./WeaponSelector";

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

  const updateDesiredOverallStats = (desiredOverallStats: DesiredOverallStat[]) => {
    onUpdate(build.characterId, { desiredOverallStats });
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
      <DesiredOverallStatsSelector
        currentStats={currentStats}
        desiredStats={build.desiredOverallStats || []}
        onChange={updateDesiredOverallStats}
      />
      <ArtifactCollection artifacts={build.artifacts} onUpdate={updateArtifacts} />
    </CardContent>
  );
};

export default EditableBuildContent;
