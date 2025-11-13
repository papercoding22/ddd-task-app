import React from "react";
import { render, screen } from "@testing-library/react";
import { StatsBar } from "../StatsBar";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("StatsBar", () => {
  it("should render total count with plural 'promotions' when totalCount is not 1", () => {
    render(<StatsBar totalCount={5} selectedCount={0} />);
    expect(screen.getByText("5 promotions available")).toBeInTheDocument();
  });

  it("should render total count with singular 'promotion' when totalCount is 1", () => {
    render(<StatsBar totalCount={1} selectedCount={0} />);
    expect(screen.getByText("1 promotion available")).toBeInTheDocument();
  });

  it("should render selected count badge when selectedCount is greater than 0", () => {
    render(<StatsBar totalCount={5} selectedCount={2} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("selected")).toBeInTheDocument();
  });

  it("should not render selected count badge when selectedCount is 0", () => {
    render(<StatsBar totalCount={5} selectedCount={0} />);
    expect(screen.queryByText("selected")).not.toBeInTheDocument();
  });
});
