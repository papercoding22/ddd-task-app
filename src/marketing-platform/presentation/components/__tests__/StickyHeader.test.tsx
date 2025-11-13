import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { StickyHeader } from "../StickyHeader";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";

describe("StickyHeader", () => {
  const mockOnSelectAll = vi.fn();
  const mockOnClearAll = vi.fn();

  const defaultProps = {
    title: "Promotions List",
    totalCount: 10,
    selectedCount: 0,
    onSelectAll: mockOnSelectAll,
    onClearAll: mockOnClearAll,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render PromotionHeader with correct title and totalCount", () => {
    render(<StickyHeader {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    // The totalCount is rendered inside a div with text content, so we can find it this way
    expect(screen.getByText(defaultProps.totalCount.toString())).toBeInTheDocument();
  });

  it("should render StatsBar with correct totalCount and selectedCount", () => {
    render(<StickyHeader {...defaultProps} />);
    expect(screen.getByText(`${defaultProps.totalCount} promotions available`)).toBeInTheDocument();
    expect(screen.queryByText("selected")).not.toBeInTheDocument(); // selectedCount is 0
  });

  it("should render ActionButtons with 'Select All' and 'Clear All' buttons", () => {
    render(<StickyHeader {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Select All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear All" })).toBeInTheDocument();
  });

  it("should disable 'Clear All' button when selectedCount is 0", () => {
    render(<StickyHeader {...defaultProps} selectedCount={0} />);
    const clearAllButton = screen.getByRole("button", { name: "Clear All" });
    expect(clearAllButton).toBeDisabled();
  });

  it("should enable 'Clear All' button when selectedCount is greater than 0", () => {
    render(<StickyHeader {...defaultProps} selectedCount={5} />);
    const clearAllButton = screen.getByRole("button", { name: "Clear All" });
    expect(clearAllButton).not.toBeDisabled();
  });

  it("should call onSelectAll when 'Select All' button is clicked", () => {
    render(<StickyHeader {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: "Select All" }));
    expect(mockOnSelectAll).toHaveBeenCalledTimes(1);
  });

  it("should call onClearAll when 'Clear All' button is clicked and enabled", () => {
    render(<StickyHeader {...defaultProps} selectedCount={5} />);
    fireEvent.click(screen.getByRole("button", { name: "Clear All" }));
    expect(mockOnClearAll).toHaveBeenCalledTimes(1);
  });

  it("should not call onClearAll when 'Clear All' button is clicked and disabled", () => {
    render(<StickyHeader {...defaultProps} selectedCount={0} />);
    const clearAllButton = screen.getByRole("button", { name: "Clear All" });
    // Disabled buttons typically don't trigger click events, but we assert the mock wasn't called
    fireEvent.click(clearAllButton);
    expect(mockOnClearAll).not.toHaveBeenCalled();
  });
});
