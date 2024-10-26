"use client";

import { Check, PencilIcon, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Build } from "@/types";

interface HeaderProps {
  build: Build;
  inEditMode: boolean;
  onCancel: () => void;
  onRemove: (characterKey: string) => void;
  onSave: () => boolean;
  onToggleEditMode: (characterKey: string) => void;
}

const Header: React.FC<HeaderProps> = ({ build, inEditMode, onCancel, onRemove, onSave, onToggleEditMode }) => {
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
              <>
                <Button
                  className="bg-gray-300 hover:bg-gray-400"
                  onClick={() => {
                    onCancel();
                    onToggleEditMode(build.character.id);
                  }}
                  size="sm"
                  variant="secondary"
                >
                  <X className="text-gray-800" size={16} />
                </Button>
                <Button
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => {
                    if (onSave()) {
                      onToggleEditMode(build.character.id);
                    }
                  }}
                  size="sm"
                  variant="outline"
                >
                  <Check className="text-white" size={16} />
                </Button>
              </>
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
