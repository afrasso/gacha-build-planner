import React, { useEffect, useState } from "react";

import { Input } from "../input";

interface DebouncedNumericInputProps {
  onChange: (value: number) => void;
  value?: number;
}

const DebouncedNumericInput: React.FC<DebouncedNumericInputProps> = ({ onChange, value }) => {
  const [stringValue, setStringValue] = useState(value ? value.toString() : "");
  const [numericValue, setNumericValue] = useState(value || 0);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(numericValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [numericValue, onChange]);

  return (
    <Input
      max="500"
      min="0"
      onChange={(e) => {
        const inputValue = e.target.value;
        setStringValue(inputValue);
        if (inputValue === "" || inputValue === ".") {
          setNumericValue(0);
        } else {
          const newValue = parseFloat(inputValue);
          if (!isNaN(newValue)) {
            if (newValue < 0) {
              setStringValue("0");
              setNumericValue(0);
            } else if (newValue > 500) {
              setStringValue("500");
              setNumericValue(500);
            } else {
              setStringValue(newValue.toString());
              setNumericValue(newValue);
            }
          }
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
          // Prevent typing 'e', 'E', '+' or '-'.
          e.preventDefault();
        }
      }}
      step="0.1"
      type="number"
      value={stringValue}
    />
  );
};

export default DebouncedNumericInput;
