import Image from "next/image";
import React from "react";

import {
  ArtifactMainStatSatisfactionDetails,
  ArtifactSetBonusSatisfactionDetails,
  BuildSatisfactionResult,
  SatisfactionResult,
  StatSatisfactionDetails,
} from "@/calculation/buildmetrics/satisfaction";
import ImageWithTooltip from "@/components/ui/custom/ImageWithTooltip";
import { useDataContext } from "@/contexts/DataContext";

import SatisfactionIcon from "./SatisfactionIcon";

interface BuildSatisfactionDisplayProps {
  result: BuildSatisfactionResult;
}

const ArtifactSetBonusesDisplay: React.FC<{ result: SatisfactionResult<ArtifactSetBonusSatisfactionDetails> }> = ({
  result,
}) => {
  const { getArtifactSet } = useDataContext();

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
  const { getArtifactTypesWithVariableMainStats } = useDataContext();

  const mainStatSatisfactions = Object.fromEntries(
    result.details.map((mainStatSatisfaction) => [mainStatSatisfaction.artifactTypeKey, mainStatSatisfaction])
  );

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {getArtifactTypesWithVariableMainStats().map((artifactType) => (
        <div className="flex items-center gap-2 mb-2" key={artifactType.key}>
          <Image alt={artifactType.key} height={32} src={artifactType.iconUrl} width={32} />
          <SatisfactionIcon
            isSatisfied={!!mainStatSatisfactions[artifactType.key]?.satisfaction}
            tooltipText={`${artifactType.key}: ${mainStatSatisfactions[artifactType.key]?.desiredMainStatKeys}`}
          />
        </div>
      ))}
    </div>
  );
};

const StatsDisplay: React.FC<{ result: SatisfactionResult<StatSatisfactionDetails> }> = ({ result }) => {
  const { getOverallStatDefinition } = useDataContext();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {result.details.map((statSatisfaction) => {
        const comparatorSymbol = statSatisfaction.currentStatValue >= statSatisfaction.targetStatValue ? ">=" : "<";
        return (
          <div className="flex items-center gap-2 mb-2" key={statSatisfaction.statKey}>
            <ImageWithTooltip
              alt={statSatisfaction.statKey}
              height={32}
              src={getOverallStatDefinition(statSatisfaction.statKey).iconUrl}
              tooltipText={`${statSatisfaction.statKey}: ${statSatisfaction.currentStatValue} ${comparatorSymbol} ${statSatisfaction.targetStatValue}`}
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
