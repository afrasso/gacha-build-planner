"use client";

import { Check, PencilIcon } from "lucide-react";
import Image from "next/image";

import { Build } from "../../types";
import { Button } from "../ui/button";
import { CardHeader, CardTitle } from "../ui/card";

interface HeaderProps {
  build: Build;
  inEditMode: boolean;
  onRemove: (characterKey: string) => void;
  onToggleEditMode: (characterKey: string) => void;
}

const Header: React.FC<HeaderProps> = ({ build, inEditMode, onRemove, onToggleEditMode }) => {
  return (
    <>
      <span>{JSON.stringify(build)}</span>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            <Image
              alt={build.character.name}
              className="mr-2 rounded-full"
              height={50}
              src={build.character.iconUrl}
              width={50}
            />
            {build.character.name}
          </div>
          <div className="flex items-center space-x-2">
            {inEditMode ? (
              <Button
                className="bg-green-500 hover:bg-green-600"
                onClick={() => onToggleEditMode(build.character.id)}
                size="sm"
                variant="outline"
              >
                <Check className="text-white" size={16} />
              </Button>
            ) : (
              <Button onClick={() => onToggleEditMode(build.character.id)} size="sm" variant="ghost">
                <PencilIcon size={16} />
              </Button>
            )}
            {!inEditMode ? (
              <Button onClick={() => onRemove(build.character.id)} size="sm" variant="destructive">
                Delete
                <span className="sr-only">Remove</span>
              </Button>
            ) : (
              <div />
            )}
          </div>
        </CardTitle>
      </CardHeader>
    </>
  );
};

export default Header;
