import React from "react";

export const Select = ({
  children,
  onValueChange,
  value,
  ...props
}: React.PropsWithChildren<{ onValueChange: (value: string) => void; value: string }>) => {
  return (
    <select onChange={(e) => onValueChange(e.target.value)} value={value} {...props}>
      {children}
    </select>
  );
};

export const SelectContent = ({ children, ...props }: React.PropsWithChildren) => {
  return <React.Fragment {...props}>{children}</React.Fragment>;
};

export const SelectItem = ({ children, value, ...props }: React.PropsWithChildren<{ value: string }>) => {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
};

export const SelectTrigger = ({ children, ...props }: React.PropsWithChildren) => {
  return <React.Fragment {...props}>{children}</React.Fragment>;
};

export const SelectValue = ({ placeholder, ...props }: { placeholder: string }) => {
  return <span {...props}>{placeholder}</span>;
};
