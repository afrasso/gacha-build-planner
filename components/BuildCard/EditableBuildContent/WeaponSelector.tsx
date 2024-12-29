"use client";

import { Check, Pencil, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";

interface WeaponSelectorProps {
  onChange: (selectedWeaponId: string) => void;
  selectedWeaponId: string | undefined;
}

const WeaponSelector: React.FC<WeaponSelectorProps> = ({ onChange, selectedWeaponId }) => {
  const { getWeapon, weapons } = useGenshinDataContext();

  const [isEditing, setIsEditing] = useState(false);
  const [internalSelectedWeaponId, setInternalSelectedWeaponId] = useState<string | undefined>(selectedWeaponId);
  const [isValid, setIsValid] = useState(true);

  const toggleEditing = () => {
    if (isEditing) {
      if (validate()) {
        onChange(internalSelectedWeaponId!);
        setIsEditing(!isEditing);
      }
    } else {
      setIsEditing(true);
    }
  };

  const cancel = () => {
    setInternalSelectedWeaponId(selectedWeaponId);
    setIsEditing(false);
    setIsValid(true);
  };

  const update = (weaponId: string) => {
    setInternalSelectedWeaponId(weaponId);
    setIsValid(true);
  };

  const validate = () => {
    const newIsValid = !!internalSelectedWeaponId;
    setIsValid(newIsValid);
    return newIsValid;
  };

  const renderEditableContent = () => (
    <div className="flex flex-grow items-center justify-between gap-2">
      <Label className="text-md font-semibold text-primary whitespace-nowrap w-28">Weapon:</Label>
      <div className="flex-grow relative">
        <Select onValueChange={(value) => update(value)} value={internalSelectedWeaponId}>
          <SelectTrigger
            aria-describedby={!isValid ? "weapon-error" : undefined}
            aria-invalid={!isValid}
            className="h-8 px-3 text-left text-sm border rounded-md bg-background w-full"
          >
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
        {!isValid && (
          <p className="text-red-500 text-sm mt-1 absolute left-0 top-full" id="weapon-error">
            Please select a weapon.
          </p>
        )}
      </div>
      <div className="flex ml-2 gap-1">
        <Button className="p-0 w-6 h-8 flex-shrink-0" onClick={cancel} size="sm" variant="ghost">
          <X size={16} />
        </Button>
        <Button className="p-0 w-6 h-8 flex-shrink-0" onClick={toggleEditing} size="sm" variant="ghost">
          <Check size={16} />
        </Button>
      </div>
    </div>
  );

  const renderNonEditableContent = () => (
    <div className="flex flex-grow items-center justify-between gap-2">
      <Label className="text-md font-semibold text-primary whitespace-nowrap w-24">Weapon:</Label>
      <div className="flex-grow flex items-center">
        <div
          className="h-8 px-3 text-left text-sm flex items-center flex-grow rounded-md hover:bg-accent cursor-pointer"
          onClick={toggleEditing}
        >
          {selectedWeaponId ? (
            <>
              <Image
                alt={getWeapon(selectedWeaponId).name}
                className="mr-2"
                height={32}
                src={getWeapon(selectedWeaponId).iconUrl}
                width={32}
              />
              {getWeapon(selectedWeaponId).name}
            </>
          ) : (
            <span className="text-muted-foreground">Not selected</span>
          )}
        </div>
        <div className="flex ml-2 gap-1">
          <Button className="p-0 w-6 h-8 flex-shrink-0" onClick={toggleEditing} size="sm" variant="ghost">
            {<Pencil size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${!isValid ? "mb-8" : "mb-2"}`}>
      {isEditing ? renderEditableContent() : renderNonEditableContent()}
    </div>
  );
};

export default WeaponSelector;
