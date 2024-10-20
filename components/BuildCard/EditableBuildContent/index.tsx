"use client";

import { ArtifactSet, ArtifactType, Build, DesiredStat, Stat, Weapon } from "../../../types";
import { CardContent } from "../../ui/card";
import { Label } from "../../ui/label";
import ArtifactMainStatSelector from "./ArtifactMainStatSelector";
import ArtifactSetSelector from "./ArtifactSetSelector";
import DesiredStatsSelector from "./DesiredStatsSelector";
import WeaponSelector from "./WeaponSelector";

interface EditableBuildContentProps {
  artifactSets: ArtifactSet[];
  build: Build;
  onUpdate: (characterKey: string, updates: Partial<Build>) => void;
  weapons: Weapon[];
}

const EditableBuildContent: React.FC<EditableBuildContentProps> = ({ artifactSets, build, onUpdate, weapons }) => {
  const updateWeapon = (weapon: Weapon) => {
    onUpdate(build.character.id, { weapon });
  };

  const updateArtifactSets = (artifactSets: ArtifactSet[]) => {
    onUpdate(build.character.id, { artifactSets });
  };

  const updateArtifactMainStat = (artifactType: ArtifactType, stat: Stat) => {
    build.desiredMainStats[artifactType] = stat;
    onUpdate(build.character.id, { desiredMainStats: build.desiredMainStats });
  };

  const updateDesiredStats = (desiredStats: DesiredStat[]) => {
    onUpdate(build.character.id, { desiredStats });
  };

  return (
    <CardContent>
      <WeaponSelector onChange={updateWeapon} selectedWeapon={build.weapon} weapons={weapons} />
      <ArtifactSetSelector
        artifactSets={artifactSets}
        onChange={updateArtifactSets}
        selectedArtifactSets={build.artifactSets}
      />
      <div className="mb-4">
        <Label>Desired Main Stats</Label>
        {[ArtifactType.SANDS, ArtifactType.GOBLET, ArtifactType.CIRCLET].map((artifactType) => (
          <ArtifactMainStatSelector
            artifactType={artifactType}
            key={artifactType}
            onChange={(stat) => updateArtifactMainStat(artifactType, stat)}
            selectedStat={build.desiredMainStats[artifactType]}
          />
        ))}
      </div>
      <div>
        <DesiredStatsSelector desiredStats={build.desiredStats} onChange={updateDesiredStats} />
      </div>
    </CardContent>
  );
};

export default EditableBuildContent;
