"use client";

import { Upload } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";

interface ImportGameDataComponentProps {
  onImport: (data: unknown) => void;
}

const ImportGameDataComponent: React.FC<ImportGameDataComponentProps> = ({ onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          onImport(importedData);
        } catch (error) {
          console.error("Error parsing imported data:", error);
          alert("Invalid import file");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex space-x-2">
      <Button onClick={handleImportClick}>
        <Upload className="mr-2 h-4 w-4" />
        Import Game Data
      </Button>
      <input accept=".json" onChange={handleImport} ref={fileInputRef} style={{ display: "none" }} type="file" />
    </div>
  );
};

export default ImportGameDataComponent;
