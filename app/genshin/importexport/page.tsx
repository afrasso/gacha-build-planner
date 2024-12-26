"use client";

import ImportExportComponent from "@/components/ImportExportComponent";
import ImportGameDataComponent from "@/components/ImportGameDataComponent";
import { Plan, validatePlan } from "@/types";
import { validateGOOD } from "@/goodtypes";
import { updateBuildsWithGameData } from "@/buildhelpers/updatebuildswithgamedata";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { useStorageContext } from "@/contexts/StorageContext";

export default function Home() {
  const { artifactSets, characters, weapons } = useGenshinDataContext();
  const { loadArtifacts, loadBuilds, saveArtifacts, saveBuilds } = useStorageContext();

  const handleExport = () => {
    const plan: Plan = { artifacts: loadArtifacts(), builds: loadBuilds() };
    const dataStr = JSON.stringify(plan);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "gacha-build-planner-data.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (data: unknown) => {
    const { artifacts, builds } = validatePlan(data);
    saveArtifacts(artifacts);
    saveBuilds(builds);
  };

  const handleGOODImport = (data: unknown) => {
    const { artifacts: goodArtifacts, characters: goodCharacters, weapons: goodWeapons } = validateGOOD(data);
    const builds = loadBuilds();
    const { artifacts: unassignedArtifacts, builds: updatedBuilds } = updateBuildsWithGameData({
      artifactSets,
      builds,
      characters,
      goodArtifacts,
      goodCharacters,
      goodWeapons,
      weapons,
    });
    saveBuilds(updatedBuilds);
    saveArtifacts(unassignedArtifacts);
  };

  return (
    <main className="p-8">
      <ImportExportComponent onExport={handleExport} onImport={handleImport} />
      <ImportGameDataComponent onImport={handleGOODImport} />
    </main>
  );
}
