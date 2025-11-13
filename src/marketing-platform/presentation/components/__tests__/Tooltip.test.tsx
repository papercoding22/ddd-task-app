import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { Tooltip } from "../Tooltip";

describe("Tooltip", () => {
  it("should not show tooltip by default", () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("should show tooltip on mouse enter", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button", { name: /show more information/i });
    await user.hover(trigger);

    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByRole("tooltip")).toHaveTextContent("Test tooltip");
  });

  it("should hide tooltip on mouse leave", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button", { name: /show more information/i });
    await user.hover(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    await user.unhover(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("should show tooltip on focus", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Test tooltip">
        <button>Focus me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button", { name: /show more information/i });
    await user.tab();

    expect(trigger).toHaveFocus();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("should hide tooltip on blur", () => {
    render(
      <div>
        <Tooltip content="Test tooltip">
          <span>Focus me</span>
        </Tooltip>
        <button>Other button</button>
      </div>
    );

    const trigger = screen.getByRole("button", { name: /show more information/i });
    const otherButton = screen.getByRole("button", { name: "Other button" });

    // Focus to show tooltip
    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    // Focus other element to blur and hide tooltip
    fireEvent.blur(trigger);
    fireEvent.focus(otherButton);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <Tooltip content="Test tooltip" className="custom-class">
        <button>Hover me</button>
      </Tooltip>
    );

    const wrapper = container.querySelector(".custom-class");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass("relative");
    expect(wrapper).toHaveClass("inline-block");
  });

  it("should position tooltip at the top by default", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Test tooltip">
        <span>Hover me</span>
      </Tooltip>
    );

    await user.hover(screen.getByRole("button", { name: /show more information/i }));
    const tooltip = screen.getByRole("tooltip");

    expect(tooltip).toHaveClass("bottom-full");
  });

  it("should position tooltip at the bottom when specified", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Test tooltip" position="bottom">
        <span>Hover me</span>
      </Tooltip>
    );

    await user.hover(screen.getByRole("button", { name: /show more information/i }));
    const tooltip = screen.getByRole("tooltip");

    expect(tooltip).toHaveClass("top-full");
  });

  it("should position tooltip at the left when specified", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Test tooltip" position="left">
        <span>Hover me</span>
      </Tooltip>
    );

    await user.hover(screen.getByRole("button", { name: /show more information/i }));
    const tooltip = screen.getByRole("tooltip");

    expect(tooltip).toHaveClass("right-full");
  });

  it("should position tooltip at the right when specified", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Test tooltip" position="right">
        <span>Hover me</span>
      </Tooltip>
    );

    await user.hover(screen.getByRole("button", { name: /show more information/i }));
    const tooltip = screen.getByRole("tooltip");

    expect(tooltip).toHaveClass("left-full");
  });

  it("should render children correctly", () => {
    render(
      <Tooltip content="Test tooltip">
        <div data-testid="child-element">Child content</div>
      </Tooltip>
    );

    expect(screen.getByTestId("child-element")).toBeInTheDocument();
    expect(screen.getByTestId("child-element")).toHaveTextContent(
      "Child content"
    );
  });

  it("should toggle tooltip on click (mobile behavior)", () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Click me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole("button", { name: /show more information/i });

    // Click to show
    fireEvent.click(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    // Click again to hide
    fireEvent.click(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("should close tooltip when clicking outside", () => {
    render(
      <div>
        <Tooltip content="Test tooltip">
          <button>Click me</button>
        </Tooltip>
        <button>Outside button</button>
      </div>
    );

    const trigger = screen.getByRole("button", { name: /show more information/i });
    const outsideButton = screen.getByRole("button", { name: "Outside button" });

    // Click to show tooltip
    fireEvent.click(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    // Click outside to close
    fireEvent.mouseDown(outsideButton);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("should have touch-manipulation class for better mobile UX", () => {
    const { container } = render(
      <Tooltip content="Test tooltip">
        <button>Touch me</button>
      </Tooltip>
    );

    const trigger = container.querySelector('.touch-manipulation');
    expect(trigger).toBeInTheDocument();
  });

  it("should apply responsive max-width classes", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole("button", { name: /show more information/i }));
    const tooltip = screen.getByRole("tooltip");

    expect(tooltip).toHaveClass("max-w-[200px]");
    expect(tooltip).toHaveClass("sm:max-w-xs");
  });
});
