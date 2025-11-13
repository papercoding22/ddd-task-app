import React, { useState, useEffect, useRef } from "react";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  /** The text content to display in the tooltip */
  content: string;
  /** The element(s) that will trigger the tooltip on hover/focus */
  children: React.ReactNode;
  /** Position of the tooltip relative to the children. Defaults to "top" */
  position?: TooltipPosition;
  /** Additional CSS classes to apply to the wrapper element */
  className?: string;
}

/**
 * Mobile-first tooltip component that displays informative text on hover, focus, or tap
 *
 * Features:
 * - Touch-friendly: Tap to toggle on mobile devices
 * - Responsive: Adjusts width for smaller screens
 * - Accessible: Supports keyboard navigation
 * - Auto-dismiss: Closes when clicking outside
 *
 * @example
 * ```tsx
 * <Tooltip content="This is helpful information" position="top">
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900",
    left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900",
    right:
      "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900",
  };

  // Handle click outside to close tooltip on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isVisible]);

  const handleToggle = () => {
    setIsVisible((prev) => !prev);
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleFocus = () => {
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  return (
    <span ref={wrapperRef} className={`relative inline-block ${className}`}>
      <span
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="cursor-pointer touch-manipulation"
        role="button"
        tabIndex={0}
        aria-label="Show more information"
      >
        {children}
      </span>

      {isVisible && (
        <span
          ref={tooltipRef}
          role="tooltip"
          className={`absolute z-50 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg
            max-w-[200px] sm:max-w-xs md:whitespace-nowrap
            animate-in fade-in duration-150
            ${positionClasses[position]}`}
        >
          <span className="block break-words">{content}</span>
          <span
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          />
        </span>
      )}
    </span>
  );
};
