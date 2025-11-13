import React from "react";
import { render, screen } from "@testing-library/react";
import { StatusIndicators } from "../StatusIndicators";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("StatusIndicators", () => {
  it("should render 'Active' status when isActive is true", () => {
    render(
      <StatusIndicators
        isActive={true}
        secondaryStatus={{ isPositive: true, label: "Available" }}
      />
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.queryByText("Inactive")).not.toBeInTheDocument();
    expect(screen.getByText("Active")).toHaveClass("text-green-600");
  });

  it("should render 'Inactive' status when isActive is false", () => {
    render(
      <StatusIndicators
        isActive={false}
        secondaryStatus={{ isPositive: true, label: "Available" }}
      />
    );
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    expect(screen.queryByText("Active")).not.toBeInTheDocument();
    expect(screen.getByText("Inactive")).toHaveClass("text-gray-400");
  });

  it("should render secondary status with positive styling when isPositive is true", () => {
    render(
      <StatusIndicators
        isActive={true}
        secondaryStatus={{ isPositive: true, label: "Available" }}
      />
    );
    expect(screen.getByText("Available")).toBeInTheDocument();
    expect(screen.getByText("Available")).toHaveClass("text-green-600");
    expect(screen.getByText("Available")).not.toHaveClass("text-red-500");
  });

  it("should render secondary status with negative styling when isPositive is false", () => {
    render(
      <StatusIndicators
        isActive={true}
        secondaryStatus={{ isPositive: false, label: "Sold Out" }}
      />
    );
    expect(screen.getByText("Sold Out")).toBeInTheDocument();
    expect(screen.getByText("Sold Out")).toHaveClass("text-red-500");
    expect(screen.getByText("Sold Out")).not.toHaveClass("text-green-600");
  });
});
