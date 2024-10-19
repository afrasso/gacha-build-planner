import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Weapon } from "@/types";
import Image from "next/image";

interface WeaponSelectorProps {
  onChange: (selectedWeapon: Weapon) => void;
  selectedWeapon: undefined | Weapon;
  weapons: Weapon[];
}

const WeaponSelector: React.FC<WeaponSelectorProps> = ({ onChange, selectedWeapon, weapons }) => {
  return (
    <div className="mb-4">
      <Label>Weapon</Label>
      <Select
        onValueChange={(value) => onChange(weapons.find((weapon) => weapon.name === value) as Weapon)}
        value={selectedWeapon?.name}
      >
        <SelectTrigger>
          <SelectValue placeholder={"Select a weapon"} />
        </SelectTrigger>
        <SelectContent>
          {weapons.map((weapon) => (
            <SelectItem key={weapon.id} value={weapon.name}>
              <div className="flex items-center">
                <Image alt={weapon.name} className="mr-2" height={32} src={weapon.iconUrl} width={32} />
                {weapon.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WeaponSelector;
