import React from "react";
import { render, screen } from "@testing-library/react";
import { StatItem } from "../StatItem";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("StatItem", () => {
  it("should render the label and string value", () => {
    const label = "Discount";
    const value = "$100";
    render(<StatItem label={label} value={value} />);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
  });

  it("should render the label and ReactNode value", () => {
    const label = "Usage";
    const value = <span className="text-green-500">50%</span>;
    render(<StatItem label={label} value={value} />);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("50%")).toHaveClass("text-green-500");
  });
});
