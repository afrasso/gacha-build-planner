"use client";

import { calculateStats } from "@/calculation/stats";
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

  const onUpdateInternal = (updatedBuild: Partial<Build>) => {
    onUpdate(build.characterId, { ...updatedBuild, lastUpdatedDate: new Date().toISOString() });
  };

  const updateWeapon = (weaponId: string) => {
    onUpdateInternal({ weaponId });
  };

  const updateDesiredArtifactSetBonuses = (desiredArtifactSetBonuses: ArtifactSetBonus[]) => {
    onUpdateInternal({ desiredArtifactSetBonuses });
  };

  const updateDesiredArtifactMainStats = (desiredArtifactMainStats: DesiredArtifactMainStats) => {
    onUpdateInternal({ desiredArtifactMainStats });
  };

  const updateDesiredOverallStats = (desiredOverallStats: DesiredOverallStat[]) => {
    onUpdateInternal({ desiredOverallStats });
  };

  const updateArtifacts = (artifacts: BuildArtifacts) => {
    onUpdateInternal({ artifacts });
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
