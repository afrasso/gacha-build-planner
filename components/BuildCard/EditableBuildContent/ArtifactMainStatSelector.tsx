import { MAIN_STATS_BY_ARTIFACT_TYPE } from "../../../constants";
import { ArtifactType, Stat } from "../../../types";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface ArtifactMainStatSelectorProps {
  artifactType: ArtifactType;
  onChange: (stat: Stat) => void;
  selectedStat: Stat;
}

const ArtifactMainStatSelector: React.FC<ArtifactMainStatSelectorProps> = ({
  artifactType,
  onChange,
  selectedStat,
}) => {
  return (
    <div className="mb-2">
      <Label>{artifactType}</Label>
      <Select onValueChange={(value) => onChange(value as Stat)} value={selectedStat?.toString() || ""}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${artifactType.toLocaleLowerCase()} main stat`} />
        </SelectTrigger>
        <SelectContent>
          {MAIN_STATS_BY_ARTIFACT_TYPE[artifactType].map((stat) => (
            <SelectItem key={stat.toString()} value={stat.toString()}>
              {stat.toString()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ArtifactMainStatSelector;
