"use client";

import React, { InputHTMLAttributes, useEffect, useState } from "react";

import { Input } from "../input";

interface DebouncedNumericInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  className?: string;
  isValid?: boolean;
  onChange: (value: number | undefined) => void;
  value?: number;
}

const DebouncedNumericInput: React.FC<DebouncedNumericInputProps> = ({
  className = "",
  isValid = true,
  onChange,
  value,
  ...props
}) => {
  const [stringValue, setStringValue] = useState(value?.toString() || "");

  useEffect(() => {
    setStringValue(value?.toString() || "");
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const numericValue = stringValue === "" ? undefined : parseFloat(stringValue);
      onChange(numericValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [stringValue, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "" || inputValue === "." || !isNaN(parseFloat(inputValue))) {
      setStringValue(inputValue);
    }
  };

  return (
    <Input
      {...props}
      className={`text-right ${className}`}
      isValid={isValid}
      onChange={handleChange}
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
