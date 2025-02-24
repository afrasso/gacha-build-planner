import { Crown, Hourglass, Wine } from "lucide-react";
import React from "react";

import {
  ArtifactMainStatSatisfactionDetails,
  ArtifactSetBonusSatisfactionDetails,
  BuildSatisfactionResult,
  SatisfactionResult,
  StatSatisfactionDetails,
} from "@/calculation/buildmetrics/satisfaction";
import ImageWithTooltip from "@/components/ui/custom/ImageWithTooltip";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { ArtifactType, OverallStatKey } from "@/types";

import SatisfactionIcon from "./SatisfactionIcon";

interface BuildSatisfactionDisplayProps {
  result: BuildSatisfactionResult;
}

const ArtifactSetBonusesDisplay: React.FC<{ result: SatisfactionResult<ArtifactSetBonusSatisfactionDetails> }> = ({
  result,
}) => {
  const { getArtifactSet } = useGenshinDataContext();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {result.details.map((setBonusSatisfaction) => {
        const artifactSet = getArtifactSet(setBonusSatisfaction.desiredSetId);
        return (
          <div className="flex items-center gap-2 mb-2" key={setBonusSatisfaction.desiredSetId}>
            <ImageWithTooltip
              alt={artifactSet.name}
              height={32}
              src={artifactSet.iconUrl}
              tooltipText={`${artifactSet.name}, ${setBonusSatisfaction.desiredBonusType}`}
              width={32}
            />
            <SatisfactionIcon isSatisfied={setBonusSatisfaction.satisfaction} />
          </div>
        );
      })}
    </div>
  );
};

const ArtifactMainStatsDisplay: React.FC<{ result: SatisfactionResult<ArtifactMainStatSatisfactionDetails> }> = ({
  result,
}) => {
  const mainStatSatisfactions = Object.fromEntries(
    result.details.map((mainStatSatisfaction) => [mainStatSatisfaction.artifactType, mainStatSatisfaction])
  );

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {mainStatSatisfactions[ArtifactType.SANDS] && (
        <div className="flex items-center gap-2 mb-2">
          <Hourglass size={32} />
          <SatisfactionIcon
            isSatisfied={mainStatSatisfactions[ArtifactType.SANDS].satisfaction}
            tooltipText={`${ArtifactType.SANDS}: ${mainStatSatisfactions[ArtifactType.SANDS].desiredMainStats}`}
          />
        </div>
      )}
      {mainStatSatisfactions[ArtifactType.GOBLET] && (
        <div className="flex items-center gap-2 mb-2">
          <Wine size={32} />
          <SatisfactionIcon
            isSatisfied={mainStatSatisfactions[ArtifactType.GOBLET].satisfaction}
            tooltipText={`${ArtifactType.GOBLET}: ${mainStatSatisfactions[ArtifactType.GOBLET].desiredMainStats}`}
          />
        </div>
      )}
      {mainStatSatisfactions[ArtifactType.CIRCLET] && (
        <div className="flex items-center gap-2 mb-2">
          <Crown size={32} />
          <SatisfactionIcon
            isSatisfied={mainStatSatisfactions[ArtifactType.CIRCLET].satisfaction}
            tooltipText={`${ArtifactType.CIRCLET}: ${mainStatSatisfactions[ArtifactType.CIRCLET].desiredMainStats}`}
          />
        </div>
      )}
    </div>
  );
};

const getStatIconUrl = (stat: OverallStatKey): string => {
  const statToUrlMapping = {
    [OverallStatKey.ATK]: "/genshin/icons/attack.png",
    [OverallStatKey.CRIT_DMG]: "/genshin/icons/crit_dmg.png",
    [OverallStatKey.CRIT_RATE]: "/genshin/icons/crit_rate.png",
    [OverallStatKey.DEF]: "/genshin/icons/defense.png",
    [OverallStatKey.DMG_BONUS_ANEMO]: "/genshin/icons/anemo.png",
    [OverallStatKey.DMG_BONUS_CRYO]: "/genshin/icons/cryo.png",
    [OverallStatKey.DMG_BONUS_DENDRO]: "/genshin/icons/dendro.png",
    [OverallStatKey.DMG_BONUS_ELECTRO]: "/genshin/icons/electro.png",
    [OverallStatKey.DMG_BONUS_GEO]: "/genshin/icons/geo.png",
    [OverallStatKey.DMG_BONUS_HYDRO]: "/genshin/icons/hydro.png",
    [OverallStatKey.DMG_BONUS_PHYSICAL]: "/genshin/icons/physical.png",
    [OverallStatKey.DMG_BONUS_PYRO]: "/genshin/icons/pyro.png",
    [OverallStatKey.ELEMENTAL_MASTERY]: "/genshin/icons/elemental_mastery.png",
    [OverallStatKey.ENERGY_RECHARGE]: "/genshin/icons/energy_recharge.png",
    [OverallStatKey.HEALING_BONUS]: "/genshin/icons/healing_bonus.png",
    [OverallStatKey.MAX_HP]: "/genshin/icons/hp.png",
  };
  return statToUrlMapping[stat];
};

const StatsDisplay: React.FC<{ result: SatisfactionResult<StatSatisfactionDetails> }> = ({ result }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {result.details.map((statSatisfaction) => {
        const comparatorSymbol = statSatisfaction.statValue >= statSatisfaction.targetStatValue ? ">=" : "<";
        return (
          <div className="flex items-center gap-2 mb-2" key={statSatisfaction.targetStatKey}>
            <ImageWithTooltip
              alt={statSatisfaction.targetStatKey}
              height={32}
              src={getStatIconUrl(statSatisfaction.targetStatKey)}
              tooltipText={`${statSatisfaction.targetStatKey}: ${statSatisfaction.statValue} ${comparatorSymbol} ${statSatisfaction.targetStatValue}`}
              width={32}
            />
            <SatisfactionIcon isSatisfied={statSatisfaction.satisfaction} />
          </div>
        );
      })}
    </div>
  );
};

const BuildSatisfactionDisplay: React.FC<BuildSatisfactionDisplayProps> = ({ result }) => {
  // TODO: Right now we're explicitly declaring these results not-null; are we sure?
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ArtifactSetBonusesDisplay result={result.artifactSetBonusesSatisfaction!} />
      <ArtifactMainStatsDisplay result={result.artifactMainStatsSatisfaction!} />
      <StatsDisplay result={result.statsSatisfaction!} />
    </div>
  );
};

export default BuildSatisfactionDisplay;
