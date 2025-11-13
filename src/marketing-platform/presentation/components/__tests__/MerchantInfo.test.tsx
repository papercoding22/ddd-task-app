import React from "react";
import { render, screen } from "@testing-library/react";
import { MerchantInfo } from "../MerchantInfo";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("MerchantInfo", () => {
  it("should render the merchant name and store icon", () => {
    const merchantName = "Acme Store";
    render(<MerchantInfo merchantName={merchantName} />);

    expect(screen.getByText("🏪")).toBeInTheDocument();
    expect(screen.getByText(merchantName)).toBeInTheDocument();
  });

  it("should render a different merchant name", () => {
    const merchantName = "Global Market";
    render(<MerchantInfo merchantName={merchantName} />);

    expect(screen.getByText(merchantName)).toBeInTheDocument();
  });
});
