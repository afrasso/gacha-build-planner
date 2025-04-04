"use client";

import { CardContent } from "@/components/ui/card";
import { useDataContext } from "@/contexts/DataContext";
import { ArtifactData, ArtifactSet, ArtifactSetBonus, BuildData, DesiredOverallStat } from "@/types";

import ArtifactCollection from "./ArtifactCollection";
import DesiredArtifactMainStatsSelector from "./DesiredArtifactMainStatsSelector";
import DesiredArtifactSetBonusSelector from "./DesiredArtifactSetBonusSelector";
import DesiredOverallStatsSelector from "./DesiredOverallStatsSelector";
import WeaponSelector from "./WeaponSelector";

interface EditableBuildContentProps {
  artifactSets: ArtifactSet[];
  build: BuildData;
  onUpdate: (buildId: string, build: Partial<BuildData>) => void;
}

const EditableBuildContent: React.FC<EditableBuildContentProps> = ({ build, onUpdate }) => {
  const dataContext = useDataContext();
  const { constructBuild } = dataContext;

  const currentStats = constructBuild(build).calculateStats({ dataContext });

  const onUpdateInternal = (updatedBuild: Partial<BuildData>) => {
    onUpdate(build.characterId, { ...updatedBuild });
  };

  const updateWeapon = (weaponId: string) => {
    onUpdateInternal({ weaponId });
  };

  const updateDesiredArtifactSetBonuses = (desiredArtifactSetBonuses: ArtifactSetBonus[]) => {
    onUpdateInternal({ desiredArtifactSetBonuses });
  };

  const updateDesiredArtifactMainStats = (desiredArtifactMainStats: Record<string, string[]>) => {
    onUpdateInternal({ desiredArtifactMainStats });
  };

  const updateDesiredOverallStats = (desiredOverallStats: DesiredOverallStat[]) => {
    onUpdateInternal({ desiredOverallStats });
  };

  const updateArtifacts = (artifacts: Record<string, ArtifactData>) => {
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
        desiredOverallStats={build.desiredOverallStats || []}
        onChange={updateDesiredOverallStats}
      />
      <ArtifactCollection artifacts={build.artifacts} onUpdate={updateArtifacts} />
    </CardContent>
  );
};

export default EditableBuildContent;
