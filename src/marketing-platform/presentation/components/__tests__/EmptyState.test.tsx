import React from "react";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "../EmptyState";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("EmptyState", () => {
  it("should render the empty state message, icon, and subtext", () => {
    render(<EmptyState />);

    // Check for the icon
    expect(screen.getByText("📭")).toBeInTheDocument();

    // Check for the main message
    expect(screen.getByText("No promotions found")).toBeInTheDocument();

    // Check for the subtext
    expect(
      screen.getByText("Check back later for new offers")
    ).toBeInTheDocument();
  });
});
