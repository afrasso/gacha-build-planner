"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArtifactMetric, ArtifactMetricsResults } from "@/types";

const colors: string[] = [
  "#4B0000", // Dark Red
  "#AA0000", // Red
  "#DC7633", // Orange
  "#DCDCDC", // Gray
  "#22CC22", // Green
  "#1E90FF", // Blue
  "#D000D0", // Purple
  "#FFD700", // Gold
];

const calculateColor = (value: number) => {
  if (value > 1 || value < 0) {
    throw new Error(`Unexpected value ${value}; should be between 0 and 1, inclusive.`);
  }
  return colors[Math.floor(value * (colors.length - 1))];
};

interface MetricBarProps {
  displayValue: string;
  name: string;
  value: number;
}

const MetricBar: React.FC<MetricBarProps> = ({ displayValue, name, value }) => {
  const color = calculateColor(value);
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="border border-transparent hover:border-primary">
            <div className="h-2" style={{ backgroundColor: color, width: `${value * 100}%` }} />
          </div>
        </TooltipTrigger>
        <TooltipContent avoidCollisions={true}>
          <p>{`${name}: ${displayValue}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface MetricChartProps {
  characterId?: string;
  metricsResults: ArtifactMetricsResults;
}

const MetricChart: React.FC<MetricChartProps> = ({ characterId, metricsResults }) => {
  const transform = (x: number) => {
    if (x === 0) {
      return 0;
    }

    return Math.pow(2, Math.log10(x));
  };

  return (
    <div className="w-full mx-auto">
      {Object.values(ArtifactMetric).map((metric) => {
        const rawValue = characterId
          ? metricsResults[metric].buildResults[characterId].result
          : metricsResults[metric].maxValue;
        if (metric === ArtifactMetric.RATING) {
          // Max rating is 10, which is 1 for the main stat, 4 for the max possible initial stats, and another 5 for
          // substat rolls.
          const value = (rawValue || 0) / 10;
          const displayValue = rawValue ? `${Math.round(rawValue * 100) / 100}` : "N/A";
          return <MetricBar displayValue={displayValue} key={metric} name={metric} value={value} />;
        } else if (metric === ArtifactMetric.PLUS_MINUS) {
          const value = Math.max(0, (rawValue || 0) / 10);
          const displayValue = rawValue ? `${Math.round(rawValue * 100) / 100}` : "N/A";
          return <MetricBar displayValue={displayValue} key={metric} name={metric} value={value} />;
        } else {
          const value = rawValue || 0;
          const displayValue = rawValue ? `${Math.round((rawValue || 0) * 1000000) / 1000000}` : "N/A";
          return <MetricBar displayValue={displayValue} key={metric} name={metric} value={transform(value)} />;
        }
      })}
    </div>
  );
};

export default MetricChart;
