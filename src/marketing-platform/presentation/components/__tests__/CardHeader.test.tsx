import React from "react";
import { render, screen } from "@testing-library/react";
import { CardHeader } from "../CardHeader";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("CardHeader", () => {
  const mockTypeInfo = {
    type: "Coupon",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
    badgeColor: "bg-red-500",
    icon: "💰",
  };

  it("should render the icon, title, type, and status", () => {
    const icon = "✨";
    const title = "Super Sale Promotion";
    const status = "Active";

    render(
      <CardHeader
        icon={icon}
        title={title}
        typeInfo={mockTypeInfo}
        status={status}
      />
    );

    expect(screen.getByText(icon)).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(mockTypeInfo.type)).toBeInTheDocument();
    expect(screen.getByText(status)).toBeInTheDocument();
  });

  it("should apply the correct badge color class based on typeInfo", () => {
    render(
      <CardHeader
        icon="✨"
        title="Super Sale Promotion"
        typeInfo={mockTypeInfo}
        status="Active"
      />
    );

    const typeBadge = screen.getByText(mockTypeInfo.type);
    expect(typeBadge).toHaveClass(mockTypeInfo.badgeColor);
  });
});
