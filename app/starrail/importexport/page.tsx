"use client";

import ImportExportComponent from "@/components/ImportExportComponent";
import { StorageRetrievalStatus, useStorageContext } from "@/contexts/StorageContext";
import { Plan, validatePlan } from "@/types";

export default function ImportExportPage() {
  const { loadArtifacts, loadBuilds, saveArtifacts, saveBuilds } = useStorageContext();

  const loadPlan = async (): Promise<Plan> => {
    const artifactsRetrievalResult = await loadArtifacts();
    if (artifactsRetrievalResult.status !== StorageRetrievalStatus.FOUND) {
      console.error("Unexpected event: could not load artifacts.");
      throw new Error("Unexpected event: could not load artifacts.");
    }
    const buildsRetrievalResult = await loadBuilds();
    if (buildsRetrievalResult.status !== StorageRetrievalStatus.FOUND) {
      console.error("Unexpected event: could not load builds.");
      throw new Error("Unexpected event: could not load builds.");
    }
    return { artifacts: artifactsRetrievalResult.value || [], builds: buildsRetrievalResult.value || [] };
  };

  const handleExport = async () => {
    const plan = await loadPlan();
    const dataStr = JSON.stringify(plan);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "gacha-build-planner-data.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = async (data: unknown) => {
    const { artifacts, builds } = validatePlan(data);
    await saveArtifacts(artifacts);
    await saveBuilds(builds);
  };

  return (
    <main className="p-8">
      <ImportExportComponent onExport={handleExport} onImport={handleImport} />
      Game Data Import TBD...
    </main>
  );
}
