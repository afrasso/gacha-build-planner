import StarSelector from "@/components/ui/custom/StarSelector";
import { Label } from "@/components/ui/label";

interface RaritySelectorProps {
  onUpdate: (rarity: number) => void;
  rarity: number;
}

const RaritySelector: React.FC<RaritySelectorProps> = ({ onUpdate, rarity }) => {
  return (
    <div className="mb-2">
      <Label className="text-s font-semibold" htmlFor="rarity">
        Rarity
      </Label>
      <StarSelector max={5} onChange={onUpdate} value={rarity} />
    </div>
  );
};

export default RaritySelector;
