"use client";

import React, { InputHTMLAttributes, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

interface DebouncedNumericInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  isValid: boolean;
  onChange: (value: number | undefined) => void;
  value?: number;
}

const DebouncedNumericInput: React.FC<DebouncedNumericInputProps> = ({ onChange, value, ...props }) => {
  const [stringValue, setStringValue] = useState(value?.toString() || "");
  const [numericValue, setNumericValue] = useState<number | undefined>(value);

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
      {...props}
      onChange={(e) => {
        const inputValue = e.target.value;
        setStringValue(inputValue);
        if (inputValue === "" || inputValue === ".") {
          setNumericValue(undefined);
        } else {
          const newValue = parseFloat(inputValue);
          if (!isNaN(newValue)) {
            setStringValue(newValue.toString());
            setNumericValue(newValue);
          }
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
          // Prevent typing 'e', 'E', '+' or '-'.
          e.preventDefault();
        }
      }}
      type="number"
      value={stringValue}
    />
  );
};

export default DebouncedNumericInput;
