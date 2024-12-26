import { Artifact } from "@/types";

export interface ArtifactSatisfaction {
  artifact: Artifact;
  satisfaction?: {
    overall: number;
    builds: Record<string, number>;
  };
}
