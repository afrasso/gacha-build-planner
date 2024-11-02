"use client";

import React, { InputHTMLAttributes, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

interface DebouncedNumericInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  isValid: boolean;
  onChange: (value: number) => void;
  value?: number;
}

const DebouncedNumericInput: React.FC<DebouncedNumericInputProps> = ({ onChange, value, ...props }) => {
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
      {...props}
      onChange={(e) => {
        const inputValue = e.target.value;
        setStringValue(inputValue);
        if (inputValue === "" || inputValue === ".") {
          setNumericValue(0);
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
