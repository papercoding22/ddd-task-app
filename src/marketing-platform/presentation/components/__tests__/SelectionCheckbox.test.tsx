import React from "react";
import { render, screen } from "@testing-library/react";
import { SelectionCheckbox } from "../SelectionCheckbox";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("SelectionCheckbox", () => {
  it("should render the checkbox with checkmark when isSelected is true", () => {
    render(<SelectionCheckbox isSelected={true} />);

    // Check if the SVG path (checkmark) is present
    expect(screen.getByTestId("checkmark-path")).toBeInTheDocument();

    // Check for selected styles on the inner div
    const innerDiv = screen.getByTestId("checkbox-inner-div");
    expect(innerDiv).toHaveClass("bg-blue-500");
    expect(innerDiv).toHaveClass("border-blue-500");
    expect(innerDiv).toHaveClass("scale-110");
  });

  it("should render the checkbox without checkmark when isSelected is false", () => {
    render(<SelectionCheckbox isSelected={false} />);

    // Check if the SVG path (checkmark) is NOT present
    expect(screen.queryByTestId("checkmark-path")).not.toBeInTheDocument();

    // Check for unselected styles on the inner div
    const innerDiv = screen.getByTestId("checkbox-inner-div");
    expect(innerDiv).toHaveClass("bg-white");
    expect(innerDiv).toHaveClass("border-gray-300");
    expect(innerDiv).not.toHaveClass("scale-110");
  });
});
