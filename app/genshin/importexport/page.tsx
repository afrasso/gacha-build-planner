"use client";

import ImportExportComponent from "@/components/ImportExportComponent";
import ImportGameDataComponent from "@/components/ImportGameDataComponent";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { StorageRetrievalStatus, useStorageContext } from "@/contexts/StorageContext";
import { updateBuildsWithGameData } from "@/dataimport/goodimport";
import { validateGOOD } from "@/dataimport/goodimport/types";
import { Plan, validatePlan } from "@/types";

export default function ImportExportPage() {
  const genshinDataContext = useGenshinDataContext();
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

  const handleGOODImport = async (data: unknown) => {
    const { artifacts: goodArtifacts, characters: goodCharacters, weapons: goodWeapons } = validateGOOD(data);
    const plan = await loadPlan();
    const { artifacts: updatedArtifacts, builds: updatedBuilds } = updateBuildsWithGameData({
      artifacts: plan.artifacts,
      builds: plan.builds,
      genshinDataContext,
      goodArtifacts,
      goodCharacters,
      goodWeapons,
    });
    saveBuilds(updatedBuilds);
    saveArtifacts(updatedArtifacts);
  };

  return (
    <main className="p-8">
      <ImportExportComponent onExport={handleExport} onImport={handleImport} />
      <ImportGameDataComponent onImport={handleGOODImport} />
    </main>
  );
}
