import React from "react";

interface SelectionCheckboxProps {
  isSelected: boolean;
}

export const SelectionCheckbox: React.FC<SelectionCheckboxProps> = ({
  isSelected,
}) => (
  <div className="absolute top-4 right-4 z-10">
    <div
      data-testid="checkbox-inner-div"
      className={`
        w-7 h-7 rounded-lg border-2 flex items-center justify-center
        transition-all duration-200
        ${
          isSelected
            ? "bg-blue-500 border-blue-500 scale-110"
            : "bg-white border-gray-300 group-hover:border-gray-400"
        }
      `}
    >
      {isSelected && (
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7" data-testid="checkmark-path" />
        </svg>
      )}
    </div>
  </div>
);
