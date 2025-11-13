import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("should not show info icon when tooltip is not provided", () => {
    const label = "Discount";
    const value = "$100";
    render(<StatItem label={label} value={value} />);

    expect(screen.queryByText("ℹ️")).not.toBeInTheDocument();
  });

  it("should show info icon when tooltip is provided", () => {
    const label = "Discount";
    const value = "$100";
    const tooltip = "The discount amount applied to the purchase";
    render(<StatItem label={label} value={value} tooltip={tooltip} />);

    expect(screen.getByText("ℹ️")).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("should show tooltip on hover when tooltip prop is provided", async () => {
    const user = userEvent.setup();
    const label = "Discount";
    const value = "$100";
    const tooltip = "The discount amount applied to the purchase";
    render(<StatItem label={label} value={value} tooltip={tooltip} />);

    // Tooltip should not be visible initially
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    // Hover over the label with info icon
    const labelElement = screen.getByText(label);
    await user.hover(labelElement);

    // Tooltip should now be visible
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByRole("tooltip")).toHaveTextContent(tooltip);
  });
});
