"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { CardContent } from "@/components/ui/card";
import { ArtifactMainStats, ArtifactSet, ArtifactSetBonus, Build, StatValue, Weapon } from "@/types";

import ArtifactCollection from "./ArtifactCollection";
import DesiredArtifactMainStatsSelector from "./DesiredArtifactMainStatsSelector";
import DesiredArtifactSetBonusSelector from "./DesiredArtifactSetBonusSelector";
import DesiredStatsSelector from "./DesiredStatsSelector";
import WeaponSelector from "./WeaponSelector";

interface EditableBuildContentProps {
  artifactSets: ArtifactSet[];
  build: Build;
  onUpdate: (characterKey: string, updates: Partial<Build>) => void;
  weapons: Weapon[];
}

const EditableBuildContent = forwardRef<ISaveableContentHandle, EditableBuildContentProps>(
  ({ artifactSets, build, onUpdate, weapons }, ref) => {
    const weaponSelectorRef = useRef<ISaveableContentHandle>(null);
    const desiredArtifactSetSelectorRef = useRef<ISaveableContentHandle>(null);
    const desiredArtifactMainStatsSelectorRef = useRef<ISaveableContentHandle>(null);
    const desiredStatsSelectorRef = useRef<ISaveableContentHandle>(null);

    const cancel = () => {
      console.log("Canceling editing of EditableBuildContent.");
      weaponSelectorRef.current?.cancel();
      desiredArtifactSetSelectorRef.current?.cancel();
      desiredArtifactMainStatsSelectorRef.current?.cancel();
      desiredStatsSelectorRef.current?.cancel();
    };

    const save = () => {
      console.log("Saving EditableBuildContent.");
      if (
        !weaponSelectorRef.current ||
        !desiredArtifactSetSelectorRef.current ||
        !desiredArtifactMainStatsSelectorRef.current ||
        !desiredStatsSelectorRef.current
      ) {
        console.log("Saving EditableBuildContent failed as children are not mounted.");
        return false;
      }
      if (!validate()) {
        console.error("Saving EditableBuildContent failed due to validation error.");
      }
      return (
        weaponSelectorRef.current.save() &&
        desiredArtifactSetSelectorRef.current.save() &&
        desiredArtifactMainStatsSelectorRef.current.save() &&
        desiredStatsSelectorRef.current.save()
      );
    };

    const validate = () => {
      console.log("Validating EditableBuildContent.");
      if (
        !weaponSelectorRef.current ||
        !desiredArtifactSetSelectorRef.current ||
        !desiredArtifactMainStatsSelectorRef.current ||
        !desiredStatsSelectorRef.current
      ) {
        console.log("Validation of EditableBuildContent failed as children are not mounted.");
        return false;
      }
      return (
        weaponSelectorRef.current.validate() &&
        desiredArtifactSetSelectorRef.current.validate() &&
        desiredArtifactMainStatsSelectorRef.current.validate() &&
        desiredStatsSelectorRef.current.validate()
      );
    };

    useImperativeHandle(ref, () => ({
      cancel,
      save,
      validate,
    }));

    const updateWeapon = (weapon: Weapon) => {
      onUpdate(build.character.id, { weapon });
    };

    const updateDesiredArtifactSetBonuses = (desiredArtifactSetBonuses: ArtifactSetBonus[]) => {
      onUpdate(build.character.id, { desiredArtifactSetBonuses });
    };

    const updateDesiredArtifactMainStats = (desiredArtifactMainStats: ArtifactMainStats) => {
      onUpdate(build.character.id, { desiredArtifactMainStats });
    };

    const updateDesiredStats = (desiredStats: StatValue[]) => {
      onUpdate(build.character.id, { desiredStats });
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
          ref={desiredArtifactMainStatsSelectorRef}
        />
        <div>
          <DesiredStatsSelector
            desiredStats={build.desiredStats}
            onChange={updateDesiredStats}
            ref={desiredStatsSelectorRef}
          />
        </div>
        <div>
          <ArtifactCollection artifactSets={artifactSets} />
        </div>
      </CardContent>
    );
  }
);

EditableBuildContent.displayName = "EditableBuildContent";

export default EditableBuildContent;
