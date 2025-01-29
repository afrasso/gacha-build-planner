"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { updateAllMetrics } from "@/calculation/artifactmetrics";
import { Button } from "@/components/ui/button";
import { PaginationComponent } from "@/components/ui/custom/PaginationComponent";
import { getPageOfItems } from "@/components/ui/helpers/getpageofitems";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthContext } from "@/contexts/AuthContext";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { StorageRetrievalStatus, useStorageContext } from "@/contexts/StorageContext";
import { Artifact, ArtifactMetric, Build } from "@/types";

import ArtifactCard from "../ArtifactCard";
import { ArtifactFilter, ArtifactFilterDialog, isInFilter } from "./ArtifactFilterDialog";
import { sortArtifacts } from "@/calculation/artifactmetrics/sortartifacts";

const ArtifactManager: React.FC = () => {
  const { authFetch, isAuthenticated, user } = useAuthContext();
  const genshinDataContext = useGenshinDataContext();
  const { loadArtifacts, loadBuilds, saveArtifacts } = useStorageContext();

  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [calculationCanceled, setCalculationCanceled] = useState<boolean>(false);
  const [calculationCount, setCalculationCount] = useState<number>(0);
  const [calculationProgress, setCalculationProgress] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filter, setFilter] = useState<ArtifactFilter>();
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState<number>(20);
  const [sort, setSort] = useState<ArtifactSort>("RARITY");

  useEffect(() => {
    const load = async () => {
      const artifactsRetrievalResult = await loadArtifacts();
      const buildsRetrievalResult = await loadBuilds();
      if (
        artifactsRetrievalResult.status === StorageRetrievalStatus.FOUND &&
        buildsRetrievalResult.status === StorageRetrievalStatus.FOUND
      ) {
        const loadedArtifacts = artifactsRetrievalResult.value || [];
        setArtifacts(loadedArtifacts);
        const loadedBuilds = buildsRetrievalResult.value || [];
        setBuilds(loadedBuilds);
        setIsLoading(false);
      }
    };
    load();
  }, [authFetch, isAuthenticated, loadArtifacts, loadBuilds, user]);

  useEffect(() => {
    if (!isLoading) {
      saveArtifacts(artifacts);
    }
  }, [artifacts, authFetch, isAuthenticated, isLoading, saveArtifacts, user]);

  const lastUpdateTimeRef = useRef<number>(0);

  const callback = useCallback(
    async (p: number) => {
      const now = Date.now();

      if (now - lastUpdateTimeRef.current > 1000) {
        lastUpdateTimeRef.current = now;
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
        setCalculationProgress(p);
      }

      return calculationCanceled;
    },
    [calculationCanceled, setCalculationProgress]
  );

  // TODO: This method should probably go away; no reason why we can't define a sort function and have getSortedArtifacts call artifacts.sort(sortFunction).
  // const sortByMetric = useCallback(
  //   (metric: ArtifactMetric): Artifact[] => {
  //     return artifacts.sort((a, b) => {
  //       const aValue = a.metricsResults[metric].maxValue;
  //       const bValue = b.metricsResults[metric].maxValue;
  //       if (!aValue && !bValue) {
  //         return 0;
  //       }
  //       if (!aValue) {
  //         return 1;
  //       }
  //       if (!bValue) {
  //         return -1;
  //       }
  //       return bValue - aValue;
  //     });
  //   },
  //   [artifacts]
  // );

  const updateArtifactSort = (sort: ArtifactSort) => {
    setSort(sort);
  };

  // const getSortedArtifacts = useCallback((): Artifact[] => {
  //   switch (artifactSort) {
  //     case ArtifactMetric.CURRENT_STATS_CURRENT_ARTIFACTS:
  //     case ArtifactMetric.CURRENT_STATS_RANDOM_ARTIFACTS:
  //     case ArtifactMetric.DESIRED_STATS_CURRENT_ARTIFACTS:
  //     case ArtifactMetric.DESIRED_STATS_RANDOM_ARTIFACTS:
  //     case ArtifactMetric.PLUS_MINUS:
  //     case ArtifactMetric.RATING:
  //       return sortByMetric(artifactSort);
  //     case "LEVEL":
  //       return artifacts.sort((a, b) => b.level - a.level);
  //     case "RARITY":
  //       return artifacts.sort((a, b) => b.rarity - a.rarity);
  //     default:
  //       throw new Error(`Unexpected artifact sort encountered: ${artifactSort}`);
  //   }
  // }, [artifactSort, artifacts, sortByMetric]);

  const sortedAndFilteredArtifacts = useMemo(() => {
    const filteredArtifacts = artifacts.filter((artifact) => isInFilter({ artifact, filter }));
    return sortArtifacts({ artifacts: filteredArtifacts, sort });
  }, [artifacts, filter, sort]);

  if (isLoading) {
    return <div>Loading artifacts...</div>;
  }

  const startCalculation = async () => {
    setIsCalculating(true);
    // TODO: This needs to be a deep copy before performing a side effect on the artifacts!
    for (const [index, artifact] of artifacts.entries()) {
      await updateAllMetrics({
        artifact,
        builds,
        callback: async (p) => await callback((index + p) / artifacts.length),
        genshinDataContext,
        iterations: 1,
      });
      setCalculationCount(index + 1);
    }
    setCalculationProgress(1);
    setArtifacts([...artifacts]);
    setIsCalculating(false);
  };

  const cancelCalculation = async () => {
    setCalculationCanceled(true);
  };

  const onPageChange = (currentPage: number) => {
    setCurrentPage(currentPage);
  };

  type ArtifactSort = "LEVEL" | "RARITY" | ArtifactMetric;

  return (
    <div className="container mx-auto">
      <Button onClick={startCalculation}>Update metrics</Button>
      <Button onClick={cancelCalculation}>Cancel</Button>
      <Progress className="w-[60%]" value={calculationProgress * 100} />
      <div>Progress: {Math.round(calculationProgress * 100)}%</div>
      <div>{`${calculationCount} of ${artifacts.length} Complete`}</div>
      <div className="flex space-x-4 w-full max-w-2xl">
        <div className="w-2/3">
          <Select onValueChange={(artifactSort: ArtifactSort) => updateArtifactSort(artifactSort)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort artifacts by" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ArtifactMetric).map((metric) => (
                <SelectItem key={metric} value={metric}>
                  {metric}
                </SelectItem>
              ))}
              {["OVERALL", "LEVEL", "RARITY"].map((artifactSort) => (
                <SelectItem key={artifactSort} value={artifactSort}>
                  {artifactSort}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/3">
          <Select onValueChange={(pageSize: string) => setPageSize(parseInt(pageSize))}>
            <SelectTrigger>
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 40, 80].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ArtifactFilterDialog filter={filter} onFilterChange={setFilter} />
      </div>
      <PaginationComponent
        currentPage={currentPage}
        onPageChange={onPageChange}
        pageSize={pageSize}
        totalItems={sortedAndFilteredArtifacts.length}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
        {getPageOfItems({ currentPage, items: sortedAndFilteredArtifacts, pageSize }).map((artifact) => (
          <ArtifactCard
            artifact={artifact}
            artifactType={artifact.type}
            key={artifact.id}
            showInfoButton={true}
            showMetrics={!isCalculating}
          />
        ))}
      </div>
      <PaginationComponent
        currentPage={currentPage}
        onPageChange={onPageChange}
        pageSize={pageSize}
        totalItems={sortedAndFilteredArtifacts.length}
      />
    </div>
  );
};

export default ArtifactManager;
