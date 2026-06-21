"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  BUILD_COMPLETION_METRICS,
  canDisableArtifactMetric,
  RATING_METRICS,
} from "@/constants/artifactmetricsettings";
import { getArtifactMetricDisplay, getArtifactMetricLabel, getSettingsMessages } from "@/constants/messages";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { ArtifactMetric } from "@/types";

const getFirstSentence = (text: string): string => {
  const match = text.match(/^[^.!?]+[.!?]/);
  return match ? match[0] : text;
};

interface MetricToggleProps {
  metric: ArtifactMetric;
}

const MetricToggle: React.FC<MetricToggleProps> = ({ metric }) => {
  const settings = getSettingsMessages();
  const { artifactMetricSettings, setArtifactMetricEnabled } = useSettingsContext();
  const display = getArtifactMetricDisplay(metric);
  const canDisable = canDisableArtifactMetric({ metric, settings: artifactMetricSettings });
  const checked = artifactMetricSettings[metric];

  return (
    <div className="flex items-start space-x-3 rounded-md border p-4">
      <Checkbox
        checked={checked}
        disabled={checked && !canDisable}
        id={metric}
        onCheckedChange={(value) => setArtifactMetricEnabled({ enabled: value === true, metric })}
      />
      <div className="space-y-1">
        <Label className="font-medium leading-none" htmlFor={metric}>
          {getArtifactMetricLabel(metric)}
        </Label>
        <p className="text-sm text-muted-foreground">{getFirstSentence(display.description)}</p>
        {checked && !canDisable && (
          <p className="text-sm text-muted-foreground">{settings.artifactMetrics.atLeastOneRequired}</p>
        )}
      </div>
    </div>
  );
};

const ArtifactMetricSettingsSection: React.FC = () => {
  const settings = getSettingsMessages();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{settings.artifactMetrics.title}</h2>
        <p className="text-muted-foreground">{settings.artifactMetrics.description}</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium">{settings.artifactMetrics.ratingMetrics.title}</h3>
        <p className="text-sm text-muted-foreground">{settings.artifactMetrics.ratingMetrics.sharedSimulationNote}</p>
        <div className="space-y-3">
          {RATING_METRICS.map((metric) => (
            <MetricToggle key={metric} metric={metric} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium">{settings.artifactMetrics.buildCompletionMetrics.title}</h3>
        <div className="space-y-3">
          {BUILD_COMPLETION_METRICS.map((metric) => (
            <MetricToggle key={metric} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtifactMetricSettingsSection;
