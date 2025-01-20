"use client";

import { getMaxMetricValue } from "@/calculation/artifactmetrics/getmaxmetricvalue";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArtifactMetric, ArtifactMetricResults } from "@/types";

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
  artifactId: string;
  metricResults: ArtifactMetricResults;
}

const MetricChart: React.FC<MetricChartProps> = ({ artifactId, metricResults }) => {
  return (
    <div className="w-full mx-auto">
      {Object.values(ArtifactMetric).map((metric) => {
        const maxValue = getMaxMetricValue({ metric, results: metricResults }) ?? 0;
        if (maxValue < -8) {
          console.log(`Shouldn't happen! ${artifactId}, ${metric}=${maxValue}`);
        } else {
          if (metric === ArtifactMetric.RATING) {
            const value = maxValue / 8;
            const displayValue = `${Math.round(maxValue * 100) / 100}`;
            return <MetricBar displayValue={displayValue} key={metric} name={metric} value={value} />;
          } else if (metric === ArtifactMetric.PLUS_MINUS) {
            const value = Math.max(0, maxValue / 8);
            const displayValue = `${Math.round(maxValue * 100) / 100}`;
            return <MetricBar displayValue={displayValue} key={metric} name={metric} value={value} />;
          } else {
            const value = maxValue;
            const displayValue = `${Math.round(maxValue * 100) / 100}`;
            return <MetricBar displayValue={displayValue} key={metric} name={metric} value={value} />;
          }
        }
      })}
    </div>
  );
};

export default MetricChart;
