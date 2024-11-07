import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom";

import { ButtonProps } from "@/components/ui/button";

import DesiredStatsSelector from "../../../../components/BuildCard/EditableBuildContent/DesiredStatsSelector";
import { Stat } from "../../../../types";

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.PropsWithChildren<ButtonProps>) => <button {...props}>{children}</button>,
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({ children, ...props }: React.PropsWithChildren<LabelProps>) => <label {...props}>{children}</label>,
}));

jest.mock("@/components/ui/select", () => ({
  Select: ({ children, ...props }: React.PropsWithChildren<{}>) => <select {...props}>{children}</select>,
  SelectContent: ({ children, ...props }: React.PropsWithChildren<{}>) => <div {...props}>{children}</div>,
  SelectItem: ({ children, ...props }: React.PropsWithChildren<{}>) => <option {...props}>{children}</option>,
  SelectTrigger: ({ children, ...props }: React.PropsWithChildren<{}>) => <div {...props}>{children}</div>,
  SelectValue: ({ children, ...props }: React.PropsWithChildren<{}>) => <span {...props}>{children}</span>,
}));

jest.mock("@/components/ui/alert", () => ({
  Alert: ({ children, ...props }: React.PropsWithChildren<{}>) => <div {...props}>{children}</div>,
  AlertDescription: ({ children, ...props }: React.PropsWithChildren<{}>) => <div {...props}>{children}</div>,
}));

// Mock the DebouncedNumericInput component
jest.mock("../../ui/custom/DebouncedNumericInput", () => ({
  __esModule: true,
  default: ({ onChange, value }: { onChange: (value: number) => void; value: number }) => (
    <input onChange={(e) => onChange(Number(e.target.value))} type="number" value={value} />
  ),
}));

describe("DesiredStatsSelector", () => {
  const mockOnChange = jest.fn();
  const mockOnValidationChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(
      <DesiredStatsSelector desiredStats={[]} onChange={mockOnChange} onValidationChange={mockOnValidationChange} />
    );

    expect(screen.getByText("Desired Stats")).toBeInTheDocument();
    expect(screen.getByText("Add desired stat")).toBeInTheDocument();
  });

  it("adds a new desired stat when the add button is clicked", async () => {
    render(
      <DesiredStatsSelector desiredStats={[]} onChange={mockOnChange} onValidationChange={mockOnValidationChange} />
    );

    const addButton = screen.getByText("Add desired stat");
    await userEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith([{ stat: undefined, value: 0 }]);
  });

  it("updates a desired stat when a stat is selected", async () => {
    render(
      <DesiredStatsSelector
        desiredStats={[{ stat: undefined, value: 0 }]}
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const selectElement = screen.getByRole("combobox");
    await userEvent.selectOptions(selectElement, Stat.ATK);

    expect(mockOnChange).toHaveBeenCalledWith([{ stat: Stat.ATK, value: 0 }]);
  });

  it("removes a desired stat when the remove button is clicked", async () => {
    render(
      <DesiredStatsSelector
        desiredStats={[{ stat: Stat.ATK, value: 10 }]}
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    const removeButton = screen.getByLabelText("Remove desired stat");
    await userEvent.click(removeButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it("displays validation errors when there are empty stats", () => {
    render(
      <DesiredStatsSelector
        desiredStats={[{ stat: undefined, value: 0 }]}
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />
    );

    expect(screen.getByText("Stat 1 is required")).toBeInTheDocument();
    expect(mockOnValidationChange).toHaveBeenCalledWith(false);
  });
});
