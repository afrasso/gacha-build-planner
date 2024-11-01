"use client";

import { Check, Pencil } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Weapon } from "@/types";

interface WeaponSelectorProps {
  onChange: (selectedWeapon: Weapon) => void;
  selectedWeapon: undefined | Weapon;
  weapons: Weapon[];
}

const WeaponSelector: React.FC<WeaponSelectorProps> = ({ onChange, selectedWeapon, weapons }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [internalSelectedWeapon, setInternalSelectedWeapon] = useState<undefined | Weapon>(selectedWeapon);
  const [isValid, setIsValid] = useState(true);

  const handleToggleEdit = () => {
    if (isEditing) {
      if (!validate()) {
        setIsValid(false);
      } else {
        onChange(internalSelectedWeapon as Weapon);
        setIsEditing(!isEditing);
      }
    } else {
      setIsEditing(true);
    }
  };

  const validate = () => {
    return !!internalSelectedWeapon;
  };

  const renderEditableContent = () => (
    <div className="relative w-full">
      <Select
        onValueChange={(value) => {
          const weapon = weapons.find((weapon) => weapon.id === value);
          setInternalSelectedWeapon(weapon);
          setIsValid(true);
        }}
        value={internalSelectedWeapon?.id}
      >
        <SelectTrigger className="h-10 px-3 py-2 text-left border rounded-md bg-background w-full" isValid={isValid}>
          <SelectValue placeholder={"Select a weapon"} />
        </SelectTrigger>
        <SelectContent>
          {weapons.map((weapon) => (
            <SelectItem key={weapon.id} value={weapon.id}>
              <div className="flex items-center">
                <Image alt={weapon.name} className="mr-2" height={32} src={weapon.iconUrl} width={32} />
                {weapon.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!isValid && <p className="text-red-500 text-sm absolute left-0 top-full mt-1">Please select a weapon.</p>}
    </div>
  );

  const renderNonEditableContent = () => (
    <div className="h-10 px-3 py-2 text-left flex items-center w-full rounded-md">
      {selectedWeapon ? (
        <>
          <Image alt={selectedWeapon.name} className="mr-2" height={32} src={selectedWeapon.iconUrl} width={32} />
          <span>{selectedWeapon.name}</span>
        </>
      ) : (
        <span className="text-muted-foreground">Not selected</span>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-between pb-6">
      <div className="flex items-center space-x-4 flex-grow mr-4">
        <Label className="text-md font-semibold text-primary whitespace-nowrap">Weapon:</Label>
        {isEditing ? renderEditableContent() : renderNonEditableContent()}
      </div>
      <Button className="p-1 flex-shrink-0" onClick={handleToggleEdit} size="sm" variant="ghost">
        {isEditing ? <Check size={16} /> : <Pencil size={16} />}
      </Button>
    </div>
  );
};

WeaponSelector.displayName = "WeaponSelector";

export default WeaponSelector;
