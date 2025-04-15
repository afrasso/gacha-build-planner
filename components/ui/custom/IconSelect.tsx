import Image from "next/image";
import { useState } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

interface IconSelectItem {
  iconUrl: string;
  key: string;
  label: string;
}

interface IconSelectProps {
  ariaDescribedBy?: string;
  isValid: boolean;
  items: IconSelectItem[];
  onChange: (id: string) => void;
  placeholderText: string;
}

const IconSelect: React.FC<IconSelectProps> = ({ ariaDescribedBy, isValid, items, onChange, placeholderText }) => {
  const [selectedValue, setSelectedValue] = useState<string>();
  const selectedItem = items.find((item) => item.key === selectedValue);

  const onValueChange = (key: string) => {
    setSelectedValue(key);
    onChange(key);
  };

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger
        aria-describedby={ariaDescribedBy}
        aria-invalid={isValid}
        className="h-8 px-3 text-left text-sm border rounded-md bg-background w-full"
        isValid={isValid}
      >
        {selectedItem ? (
          <div className="flex items-center">
            <Image alt={selectedItem.label} className="mr-2" height={32} src={selectedItem.iconUrl} width={32} />
            {selectedItem.label}
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholderText}</span>
        )}
      </SelectTrigger>
      <SelectContent>
        {items?.map((item) => (
          <SelectItem key={item.key} value={item.key}>
            <div className="flex items-center">
              <Image alt={item.label} className="mr-2" height={32} src={item.iconUrl} width={32} />
              {item.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default IconSelect;
