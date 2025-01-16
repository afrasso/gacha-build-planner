"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArtifactMetric, ArtifactMetricResults, ArtifactTier } from "@/types";
import { getMaxMetricValue } from "@/calculators/artifactmetrics/getmaxmetricvalue";
import { ARTIFACT_TIER_NUMERIC_RATING_REVERSE_LOOKUP, ARTIFACT_TIER_NUMERIC_RATINGS } from "@/constants";

const metrics = [
  { category: "A", value: 1.0 },
  { category: "B", value: 0.95 },
  { category: "C", value: 0.2 },
  { category: "D", value: 0.85 },
  { category: "E", value: 0.8 },
  { category: "F", value: 0.5 },
];

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
  name: string;
  value: number;
}

const MetricBar: React.FC<MetricBarProps> = ({ name, value }) => {
  const stringValue = Math.round(value * 100);
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
          <p>{`${name}: ${stringValue}%`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface MetricChartProps {
  metricResults: ArtifactMetricResults;
}

const MetricChart: React.FC<MetricChartProps> = ({ metricResults }) => {
  return (
    <div className="w-full mx-auto">
      {Object.values(ArtifactMetric).map((metric) => {
        const maxValue = getMaxMetricValue({ metric, results: metricResults });
        let value: number;
        if (metric === ArtifactMetric.TIER_RATING) {
          value = ARTIFACT_TIER_NUMERIC_RATINGS[maxValue as ArtifactTier] / 8;
        } else if (metric === ArtifactMetric.ROLL_PLUS_MINUS) {
          value = Math.max(0, (maxValue as number) / 8);
        } else {
          value = maxValue as number;
        }
        return <MetricBar key={metric} name={metric} value={value} />;
      })}
    </div>
  );
};

export default MetricChart;
