"use client";

import { Check, Pencil, X } from "lucide-react";
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

  const toggleEditing = () => {
    if (isEditing) {
      if (validate()) {
        onChange(internalSelectedWeapon as Weapon);
        setIsEditing(!isEditing);
      }
    } else {
      setIsEditing(true);
    }
  };

  const cancel = () => {
    setInternalSelectedWeapon(selectedWeapon);
    setIsEditing(false);
    setIsValid(true);
  };

  const update = (weapon: Weapon) => {
    setInternalSelectedWeapon(weapon);
    setIsValid(true);
  };

  const validate = () => {
    const newIsValid = !!internalSelectedWeapon;
    setIsValid(newIsValid);
    return newIsValid;
  };

  const renderEditableContent = () => (
    <div className="relative w-full">
      <Select
        onValueChange={(value) => update(weapons.find((weapon) => weapon.id === value)!)}
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
    <div
      className="h-10 px-3 py-2 text-left flex items-center w-full rounded-md hover:bg-accent cursor-pointer"
      onClick={toggleEditing}
    >
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
    <div className="flex items-center justify-between pb-6 gap-2">
      <div className="flex items-center space-x-4 flex-grow mr-4">
        <Label className="text-md font-semibold text-primary whitespace-nowrap">Weapon:</Label>
        {isEditing ? renderEditableContent() : renderNonEditableContent()}
      </div>
      <div className="w-6 h-9 flex-shrink-0">
        {isEditing && (
          <Button className="p-1 w-full h-full" onClick={cancel} size="sm" variant="ghost">
            <X size={16} />
          </Button>
        )}
      </div>
      <Button className="p-1 flex-shrink-0" onClick={toggleEditing} size="sm" variant="ghost">
        {isEditing ? <Check size={16} /> : <Pencil size={16} />}
      </Button>
    </div>
  );
};

export default WeaponSelector;
