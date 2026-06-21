"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  canDisableArtifactMetric,
  DEFAULT_ARTIFACT_METRIC_SETTINGS,
  getEnabledArtifactMetrics,
  mergeArtifactMetricSettings,
} from "@/constants/artifactmetricsettings";
import { ArtifactMetric, ArtifactMetricSettings } from "@/types";

const ARTIFACT_METRIC_SETTINGS_KEY = "artifactMetricSettings";

interface SettingsContextType {
  artifactMetricSettings: ArtifactMetricSettings;
  enabledArtifactMetrics: ArtifactMetric[];
  setArtifactMetricEnabled: ({ enabled, metric }: { enabled: boolean; metric: ArtifactMetric }) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [artifactMetricSettings, setArtifactMetricSettings] = useState<ArtifactMetricSettings>(
    DEFAULT_ARTIFACT_METRIC_SETTINGS
  );

  useEffect(() => {
    const stored = localStorage.getItem(ARTIFACT_METRIC_SETTINGS_KEY);
    if (!stored) {
      return;
    }
    try {
      const parsed = JSON.parse(stored) as Partial<ArtifactMetricSettings>;
      setArtifactMetricSettings(mergeArtifactMetricSettings(parsed));
    } catch {
      setArtifactMetricSettings(DEFAULT_ARTIFACT_METRIC_SETTINGS);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ARTIFACT_METRIC_SETTINGS_KEY, JSON.stringify(artifactMetricSettings));
  }, [artifactMetricSettings]);

  const setArtifactMetricEnabled = useCallback(
    ({ enabled, metric }: { enabled: boolean; metric: ArtifactMetric }) => {
      setArtifactMetricSettings((prev) => {
        if (enabled) {
          return { ...prev, [metric]: true };
        }
        if (!canDisableArtifactMetric({ metric, settings: prev })) {
          return prev;
        }
        return { ...prev, [metric]: false };
      });
    },
    []
  );

  const enabledArtifactMetrics = useMemo(
    () => getEnabledArtifactMetrics(artifactMetricSettings),
    [artifactMetricSettings]
  );

  return (
    <SettingsContext.Provider value={{ artifactMetricSettings, enabledArtifactMetrics, setArtifactMetricEnabled }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }
  return context;
};
