import React from "react";
import { render, screen } from "@testing-library/react";
import { DateRange } from "../DateRange";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { format } from "date-fns";

describe("DateRange", () => {
  it("should render the formatted start and end dates", () => {
    const startDate = new Date("2023-01-15T10:00:00Z");
    const endDate = new Date("2023-01-30T10:00:00Z");

    render(<DateRange startDate={startDate} endDate={endDate} />);

    const expectedDateString = `${format(startDate, "yyyy-MM-dd")} - ${format(
      endDate,
      "yyyy-MM-dd"
    )}`;
    expect(screen.getByText(expectedDateString)).toBeInTheDocument();
    expect(screen.getByText("📅")).toBeInTheDocument();
  });

  it("should handle different dates correctly", () => {
    const startDate = new Date("2024-03-01T00:00:00Z");
    const endDate = new Date("2024-03-31T23:59:59Z");

    render(<DateRange startDate={startDate} endDate={endDate} />);

    const expectedDateString = `${format(startDate, "yyyy-MM-dd")} - ${format(
      endDate,
      "yyyy-MM-dd"
    )}`;
    expect(screen.getByText(expectedDateString)).toBeInTheDocument();
  });
});
