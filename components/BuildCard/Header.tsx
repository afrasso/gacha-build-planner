"use client";

import { Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Build } from "@/types";

import SatisfactionIcon from "./SatisfactionIcon";

interface HeaderProps {
  build: Build;
  isSatisfied: boolean;
  onRemove?: (buildId: string) => void;
  showInfoButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ build, isSatisfied, onRemove, showInfoButton }) => {
  const { getCharacter } = useGenshinDataContext();
  const router = useRouter();

  const remove = () => {
    onRemove?.(build.characterId);
  };

  const character = getCharacter(build.characterId);
  const formattedLastUpdatedDate = build.lastUpdatedDate
    ? new Date(build.lastUpdatedDate).toLocaleString("en-US", {
        day: "numeric",
        hour: "numeric",
        hour12: true,
        minute: "numeric",
        month: "long",
        second: "numeric",
        timeZoneName: "short",
        year: "numeric",
      })
    : undefined;

  return (
    <CardHeader className="p-4">
      <CardTitle className="flex justify-between items-center">
        <div className="flex items-center">
          <Image alt={character.name} className="mr-2 rounded-full" height={50} src={character.iconUrl} width={50} />
          {character.name}
        </div>
        <div className="flex items-center space-x-2">
          {showInfoButton && (
            <Button
              className="p-0 w-6 h-8 flex-shrink-0"
              onClick={() => router.push(`/genshin/builds/${build.characterId}`)}
              size="sm"
              variant="ghost"
            >
              <Info size={16} />
            </Button>
          )}
          <Button onClick={remove} size="sm" variant="destructive">
            Delete
            <span className="sr-only">Remove</span>
          </Button>
          <SatisfactionIcon isSatisfied={isSatisfied} />
        </div>
      </CardTitle>
      <span className="text-xs text-muted-foreground">
        {formattedLastUpdatedDate ? `Last updated on ${formattedLastUpdatedDate}` : "Never updated"}
      </span>
    </CardHeader>
  );
};

export default Header;
