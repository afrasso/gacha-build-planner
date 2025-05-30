"use client";

import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button"; // Import your button component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ICharacter } from "@/types";

interface CharacterSelectorProps {
  characters: ICharacter[];
  onAdd: (character: ICharacter) => void;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({ characters, onAdd }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<ICharacter>();

  const handleCharacterSelection = (characterId: string) => {
    const character = characters.find((character) => character.id === characterId);
    setSelectedCharacter(character);
  };

  const handleAddBuild = () => {
    if (selectedCharacter) {
      onAdd(selectedCharacter);
      setSelectedCharacter(undefined);
    }
  };

  return (
    <div className="flex items-center">
      <Select onValueChange={handleCharacterSelection} value={selectedCharacter?.id || ""}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Add a character" />
        </SelectTrigger>
        <SelectContent>
          {characters.map((character) => (
            <SelectItem key={character.id} value={character.id}>
              <div className="flex items-center">
                <Image
                  alt={character.name}
                  className="mr-2 rounded-full"
                  height={30}
                  src={character.iconUrl}
                  width={30}
                />
                {character.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className="h-9 w-9 flex items-center justify-center ml-2"
        onClick={handleAddBuild}
        size="icon"
        variant="ghost"
      >
        <PlusCircle className="h-4 w-4" />
        <span className="sr-only">Add build</span>
      </Button>
    </div>
  );
};

export default CharacterSelector;
