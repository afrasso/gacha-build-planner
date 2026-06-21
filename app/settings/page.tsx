import type { Metadata } from "next";

import ArtifactMetricSettingsSection from "@/components/settings/ArtifactMetricSettings";
import { getSettingsMessages } from "@/constants/messages";

const settings = getSettingsMessages();

export const metadata: Metadata = {
  description: "Configure artifact metric calculation and display preferences.",
  title: settings.title,
};

export default function SettingsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">{settings.title}</h1>
        <p className="text-lg text-muted-foreground">{settings.intro}</p>
      </div>
      <ArtifactMetricSettingsSection />
    </main>
  );
}
