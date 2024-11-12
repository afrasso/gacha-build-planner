/**
 * @jest-environment jsdom
 */

import { LabelProps } from "@radix-ui/react-label";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

import { ButtonProps } from "@/components/ui/button";

import DesiredStatsSelector from "../../../../components/BuildCard/EditableBuildContent/DesiredStatsSelector";
import { OverallStat } from "../../../../types";

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.PropsWithChildren<ButtonProps>) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ children, ...props }: React.PropsWithChildren<LabelProps>) => <label {...props}>{children}</label>,
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children, ...props }: React.PropsWithChildren<{}>) => <select {...props}>{children}</select>,
  SelectContent: ({ children, ...props }: React.PropsWithChildren<{}>) => <div {...props}>{children}</div>,
  SelectItem: ({ children, ...props }: React.PropsWithChildren<{}>) => <option {...props}>{children}</option>,
  SelectTrigger: ({ children, ...props }: React.PropsWithChildren<{}>) => <div {...props}>{children}</div>,
  SelectValue: ({ children, ...props }: React.PropsWithChildren<{}>) => <span {...props}>{children}</span>,
}));

vi.mock("@/components/ui/alert", () => ({
  Alert: ({ children, ...props }: React.PropsWithChildren<{}>) => <div {...props}>{children}</div>,
  AlertDescription: ({ children, ...props }: React.PropsWithChildren<{}>) => <div {...props}>{children}</div>,
}));

// Mock the DebouncedNumericInput component
vi.mock("../../ui/custom/DebouncedNumericInput", () => ({
  __esModule: true,
  default: ({ onChange, value }: { onChange: (value: number) => void; value: number }) => (
    <input onChange={(e) => onChange(Number(e.target.value))} type="number" value={value} />
  ),
}));

describe("DesiredStatsSelector", () => {
  const mockOnChange = vi.fn();
  const mockOnValidationChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<DesiredStatsSelector desiredStats={[]} onChange={mockOnChange} />);

    expect(screen.getByText("Desired Stats")).toBeInTheDocument();
    expect(screen.getByText("Add desired stat")).toBeInTheDocument();
  });

  it("adds a new desired stat when the add button is clicked", async () => {
    render(<DesiredStatsSelector desiredStats={[]} onChange={mockOnChange} />);

    const addButton = screen.getByText("Add desired stat");
    await userEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith([{ stat: undefined, value: 0 }]);
  });

  it("updates a desired stat when a stat is selected", async () => {
    render(<DesiredStatsSelector desiredStats={[]} onChange={mockOnChange} />);

    const selectElement = screen.getByRole("combobox");
    await userEvent.selectOptions(selectElement, OverallStat.ATK);

    expect(mockOnChange).toHaveBeenCalledWith([{ stat: OverallStat.ATK, value: 0 }]);
  });

  it("removes a desired stat when the remove button is clicked", async () => {
    render(<DesiredStatsSelector desiredStats={[{ stat: OverallStat.ATK, value: 10 }]} onChange={mockOnChange} />);

    const removeButton = screen.getByLabelText("Remove desired stat");
    await userEvent.click(removeButton);

    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it("displays validation errors when there are empty stats", () => {
    render(<DesiredStatsSelector desiredStats={[]} onChange={mockOnChange} />);

    expect(screen.getByText("Stat 1 is required")).toBeInTheDocument();
    expect(mockOnValidationChange).toHaveBeenCalledWith(false);
  });
});
