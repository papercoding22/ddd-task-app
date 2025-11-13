import React from "react";
import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "../ErrorMessage";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("ErrorMessage", () => {
  it("should render the error message and title", () => {
    const testError = "This is a test error message.";
    render(<ErrorMessage error={testError} />);

    // Check for the error icon
    expect(screen.getByText("⚠️")).toBeInTheDocument();

    // Check for the title
    expect(screen.getByText("Error")).toBeInTheDocument();

    // Check for the error message itself
    expect(screen.getByText(testError)).toBeInTheDocument();
  });

  it("should render a different error message when passed", () => {
    const anotherError = "Another critical failure.";
    render(<ErrorMessage error={anotherError} />);

    expect(screen.getByText(anotherError)).toBeInTheDocument();
  });
});
