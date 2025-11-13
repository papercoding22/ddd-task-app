import React from "react";

export interface ButtonConfig {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
}

interface ActionButtonsProps {
  buttons: ButtonConfig[];
  gap?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary:
    "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700",
  secondary:
    "bg-white border-2 border-gray-300 text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400",
};

const gapStyles = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  buttons,
  gap = "md",
}) => (
  <div className={`flex ${gapStyles[gap]}`}>
    {buttons.map((button, index) => {
      const variant = button.variant || "primary";
      const baseClassName = `flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm active:scale-95 transition-all duration-200 ${variantStyles[variant]}`;
      const disabledClassName = button.disabled
        ? "opacity-40 cursor-not-allowed hover:bg-white hover:from-blue-500 hover:to-blue-600 active:scale-100"
        : "";
      const finalClassName = button.className
        ? `${baseClassName} ${disabledClassName} ${button.className}`
        : `${baseClassName} ${disabledClassName}`;

      return (
        <button
          key={index}
          onClick={button.onClick}
          disabled={button.disabled}
          className={finalClassName}
        >
          {button.label}
        </button>
      );
    })}
  </div>
);
