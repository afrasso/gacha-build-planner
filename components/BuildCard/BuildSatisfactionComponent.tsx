import { Crown, Hourglass, Wine } from "lucide-react";
import React from "react";

import {
  ArtifactMainStatsSatisfactionResult,
  ArtifactSetBonusesSatisfactionResult,
  BuildSatisfactionResult,
  StatsSatisfactionResult,
} from "@/calculators/buildsatisfaction";
import ImageWithTooltip from "@/components/ui/custom/ImageWithTooltip";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { ArtifactType, OverallStat } from "@/types";

import SatisfactionIcon from "./SatisfactionIcon";

interface BuildSatisfactionDisplayProps {
  result: BuildSatisfactionResult;
}

const ArtifactSetBonusesDisplay: React.FC<{ result: ArtifactSetBonusesSatisfactionResult }> = ({ result }) => {
  const { getArtifactSet } = useGenshinDataContext();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {result.setBonuses.map((setBonusSatisfaction) => {
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

const ArtifactMainStatsDisplay: React.FC<{ result: ArtifactMainStatsSatisfactionResult }> = ({ result }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {result.artifactMainStats.SANDS && (
        <div className="flex items-center gap-2 mb-2">
          <Hourglass size={32} />
          <SatisfactionIcon
            isSatisfied={result.artifactMainStats.SANDS.satisfaction}
            tooltipText={`${ArtifactType.SANDS}: ${result.artifactMainStats.SANDS.desiredMainStat}`}
          />
        </div>
      )}
      {result.artifactMainStats.GOBLET && (
        <div className="flex items-center gap-2 mb-2">
          <Wine size={32} />
          <SatisfactionIcon
            isSatisfied={result.artifactMainStats.GOBLET.satisfaction}
            tooltipText={`${ArtifactType.GOBLET}: ${result.artifactMainStats.GOBLET.desiredMainStat}`}
          />
        </div>
      )}
      {result.artifactMainStats.CIRCLET && (
        <div className="flex items-center gap-2 mb-2">
          <Crown size={32} />
          <SatisfactionIcon
            isSatisfied={result.artifactMainStats.CIRCLET.satisfaction}
            tooltipText={`${ArtifactType.CIRCLET}: ${result.artifactMainStats.CIRCLET.desiredMainStat}`}
          />
        </div>
      )}
    </div>
  );
};

const getStatIconUrl = (stat: OverallStat): string => {
  const statToUrlMapping = {
    [OverallStat.ATK]: "/genshin/icons/attack.png",
    [OverallStat.CRIT_DMG]: "/genshin/icons/crit_dmg.png",
    [OverallStat.CRIT_RATE]: "/genshin/icons/crit_rate.png",
    [OverallStat.DEF]: "/genshin/icons/defense.png",
    [OverallStat.DMG_BONUS_ANEMO]: "/genshin/icons/anemo.png",
    [OverallStat.DMG_BONUS_CRYO]: "/genshin/icons/cryo.png",
    [OverallStat.DMG_BONUS_DENDRO]: "/genshin/icons/dendro.png",
    [OverallStat.DMG_BONUS_ELECTRO]: "/genshin/icons/electro.png",
    [OverallStat.DMG_BONUS_GEO]: "/genshin/icons/geo.png",
    [OverallStat.DMG_BONUS_HYDRO]: "/genshin/icons/hydro.png",
    [OverallStat.DMG_BONUS_PHYSICAL]: "/genshin/icons/physical.png",
    [OverallStat.DMG_BONUS_PYRO]: "/genshin/icons/pyro.png",
    [OverallStat.ELEMENTAL_MASTERY]: "/genshin/icons/elemental_mastery.png",
    [OverallStat.ENERGY_RECHARGE]: "/genshin/icons/energy_recharge.png",
    [OverallStat.HEALING_BONUS]: "/genshin/icons/healing_bonus.png",
    [OverallStat.MAX_HP]: "/genshin/icons/hp.png",
  };
  return statToUrlMapping[stat];
};

const StatsDisplay: React.FC<{ result: StatsSatisfactionResult }> = ({ result }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {Object.entries(result.stats).map(([desiredStat, { actualStatValue, desiredStatValue, satisfaction }]) => {
        const comparatorSymbol = actualStatValue >= desiredStatValue ? ">=" : "<";
        return (
          <div className="flex items-center gap-2 mb-2" key={desiredStat}>
            <ImageWithTooltip
              alt={desiredStat}
              height={32}
              src={getStatIconUrl(desiredStat as OverallStat)}
              tooltipText={`${desiredStat}: ${actualStatValue} ${comparatorSymbol} ${desiredStatValue}`}
              width={32}
            />
            <SatisfactionIcon isSatisfied={satisfaction} />
          </div>
        );
      })}
    </div>
  );
};

const BuildSatisfactionDisplay: React.FC<BuildSatisfactionDisplayProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ArtifactSetBonusesDisplay result={result.artifactSetBonusesSatisfaction} />
      <ArtifactMainStatsDisplay result={result.artifactMainStatsSatisfaction} />
      <StatsDisplay result={result.statsSatisfaction} />
    </div>
  );
};

export default BuildSatisfactionDisplay;
