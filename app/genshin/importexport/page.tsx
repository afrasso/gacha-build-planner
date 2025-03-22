"use client";

import ImportExportComponent from "@/components/ImportExportComponent";
import ImportGameDataComponent from "@/components/ImportGameDataComponent";
import { useDataContext } from "@/contexts/DataContext";
import { StorageRetrievalStatus, useStorageContext } from "@/contexts/StorageContext";
import { updatePlan } from "@/dataimport";
import { Plan, validatePlan } from "@/types";

// TODO: After refactoring, this is now exactly the same code between Genshin and Star Rail; refactor into a single
// component.
export default function ImportExportPage() {
  const dataContext = useDataContext();
  const { deleteArtifacts, loadArtifacts, loadBuilds, saveArtifacts, saveBuilds } = useStorageContext();

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

  const handleGameDataImport = async (data: unknown) => {
    const plan = await loadPlan();
    const { artifacts, builds } = updatePlan({ data, dataContext, plan });
    await deleteArtifacts();
    await saveArtifacts(artifacts);
    await saveBuilds(builds);
  };

  return (
    <main className="p-8">
      <ImportExportComponent onExport={handleExport} onImport={handleImport} />
      <ImportGameDataComponent onImport={handleGameDataImport} />
    </main>
  );
}
