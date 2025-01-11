import StarRating from "@/components/ui/custom/StarSelector";
import { Label } from "@/components/ui/label";

interface RaritySelectorProps {
  rarity?: number;
  onUpdate: (rarity: number) => void;
}

const RaritySelector: React.FC<RaritySelectorProps> = ({ rarity = 5, onUpdate }) => {
  return (
    <div className="mb-2">
      <Label className="text-s font-semibold" htmlFor="rarity">
        Rarity
      </Label>
      <StarRating initialSelection={rarity} onChange={onUpdate} />
    </div>
  );
};

export default RaritySelector;
