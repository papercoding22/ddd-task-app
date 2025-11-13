import React from "react";

type ButtonVariant = "purple" | "blue" | "amber";

interface ViewDetailsButtonProps {
  /** Handler for button click */
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Visual variant of the button, defaults to "blue" */
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  purple:
    "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
  blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  amber:
    "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
};

/**
 * ViewDetailsButton component for navigating to promotion detail pages
 *
 * @example
 * ```tsx
 * <ViewDetailsButton
 *   variant="purple"
 *   onClick={(e) => {
 *     e.stopPropagation();
 *     navigate(`/promotions/${id}`);
 *   }}
 * />
 * ```
 */
export const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({
  onClick,
  variant = "blue",
}) => {
  return (
    <button
      onClick={onClick}
      className={`mt-4 w-full py-2.5 px-4 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses[variant]}`}
    >
      View Details
    </button>
  );
};
