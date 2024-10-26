"use client";

import Image from "next/image";
import { forwardRef, useImperativeHandle, useState } from "react";

import ISaveableContentHandle from "@/components/iSaveableContentHandle";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Weapon } from "@/types";

interface WeaponSelectorProps {
  onChange: (selectedWeapon: Weapon) => void;
  selectedWeapon: undefined | Weapon;
  weapons: Weapon[];
}

const WeaponSelector = forwardRef<ISaveableContentHandle, WeaponSelectorProps>(
  ({ onChange, selectedWeapon, weapons }, ref) => {
    const [internalSelectedWeapon, setInternalSelectedWeapon] = useState<undefined | Weapon>(selectedWeapon);
    const [isValid, setIsValid] = useState(true);

    const cancel = () => {
      console.log("Canceling editing of WeaponSelector.");
      setInternalSelectedWeapon(selectedWeapon);
      setIsValid(true);
    };

    const save = () => {
      console.log("Saving WeaponSelector.");
      if (!validate()) {
        console.error("Saving WeaponSelector failed due to validation error.");
        return false;
      }
      onChange(internalSelectedWeapon as Weapon);
      return true;
    };

    const validate = () => {
      console.log("Validating WeaponSelector.");
      const newIsValid = !!internalSelectedWeapon;
      setIsValid(newIsValid);
      return newIsValid;
    };

    useImperativeHandle(ref, () => ({
      cancel,
      save,
      validate,
    }));

    return (
      <div className="mb-4">
        <Label>Weapon</Label>
        {JSON.stringify(internalSelectedWeapon) + "ABC"}
        <Select
          onValueChange={(value) => {
            const weapon = weapons.find((weapon) => weapon.id === value);
            setInternalSelectedWeapon(weapon);
            setIsValid(true);
          }}
          value={internalSelectedWeapon?.id}
        >
          <SelectTrigger isValid={isValid}>
            <SelectValue placeholder={"Select a weapon"}>{JSON.stringify(internalSelectedWeapon) + "ABC"}</SelectValue>
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
        {!isValid && <p className="text-red-500 text-sm mt-1">Please select a weapon.</p>}
      </div>
    );
  }
);

WeaponSelector.displayName = "WeaponSelector";

export default WeaponSelector;
