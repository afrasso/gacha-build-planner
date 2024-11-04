"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Build } from "@/types";

interface HeaderProps {
  build: Build;
  onRemove: (buildId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ build, onRemove }) => {
  const remove = () => {
    onRemove(build.character.id);
  };

  return (
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
          <Button onClick={remove} size="sm" variant="destructive">
            Delete
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      </CardTitle>
    </CardHeader>
  );
};

export default Header;
