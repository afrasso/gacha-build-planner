"use client";

import { useEffect, useState } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import { ArtifactSet, Build, Character, Plan, Weapon } from "@/types";

import BuildCard from "./BuildCard";
import CharacterSelector from "./CharacterSelector";

interface BuildManagerProps {
  artifactSets: ArtifactSet[];
  characters: Character[];
  weapons: Weapon[];
}

const BuildManager: React.FC<BuildManagerProps> = ({ artifactSets, characters, weapons }) => {
  const { authFetch, isAuthenticated, user } = useAuthContext();

  const [builds, setBuilds] = useState<Build[]>([]);
  const [planId, setPlanId] = useState<string | undefined>();

  const addBuild = (character: Character) => {
    if (character && !builds.some((b) => b.character.id === character.id)) {
      setBuilds([
        ...builds,
        {
          artifacts: {},
          character,
          desiredArtifactMainStats: {},
          desiredArtifactSetBonuses: [],
          desiredStats: [],
          weapon: undefined,
        },
      ]);
    }
  };

  const updateBuild = (buildId: string, updates: Partial<Build>) => {
    const characterId = buildId;
    setBuilds((builds) =>
      builds.map((build) => (build.character.id === characterId ? { ...build, ...updates } : build))
    );
  };

  const removeBuild = (buildId: string) => {
    const characterId = buildId;
    setBuilds((builds) => builds.filter((build) => build.character.id !== characterId));
  };

  useEffect(() => {
    const loadPlan = async () => {
      if (isAuthenticated) {
        try {
          if (!user) {
            throw new Error("User not populated");
          }
          const response = await authFetch(`/users/${user.id}/plans`, { method: "GET" });
          if (!response.ok) {
            throw new Error("Unexpected response when retrieving plan");
          }
          const plans: Plan[] = await response.json();
          if (plans && plans.length > 0 && plans[0] && plans[0].builds && plans[0].builds.length > 0) {
            const plan = plans[0];
            setPlanId(plan.id);
            setBuilds(plans[0].builds);
          }
        } catch (err) {
          console.error("Error loading data", err);
        }
      }
    };

    loadPlan();
  }, [authFetch, isAuthenticated, user]);

  useEffect(() => {
    const savePlan = async () => {
      if (isAuthenticated) {
        try {
          if (!user) {
            throw new Error("User not populated");
          }
          if (builds && builds.length > 0) {
            if (!planId) {
              const response = await authFetch(`/users/${user.id}/plans`, {
                body: JSON.stringify({ builds }),
                method: "POST",
              });
              if (!response.ok) {
                throw new Error("Unexpected response when saving plan");
              }
              const plan = await response.json();
              setPlanId(plan.id);
            } else {
              const response = await authFetch(`/users/${user.id}/plans/${planId}`, {
                body: JSON.stringify({ builds }),
                method: "PUT",
              });
              if (!response.ok) {
                throw new Error("Unexpected response when saving plan");
              }
            }
          }
        } catch (err) {
          console.error("Error loading data", err);
        }
      }
    };

    savePlan();
  }, [authFetch, builds, isAuthenticated, planId, user]);

  return (
    <div>
      <CharacterSelector
        characters={characters.filter((character) => !builds.map((build) => build.character.id).includes(character.id))}
        onAdd={addBuild}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {builds.map((build) => (
          <BuildCard
            artifactSets={artifactSets}
            build={build}
            key={build.character.id}
            onRemove={removeBuild}
            onUpdate={updateBuild}
            weapons={weapons.filter((weapon) => weapon.type === build.character.weaponType)}
          />
        ))}
      </div>
    </div>
  );
};

export default BuildManager;
