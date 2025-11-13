import React from "react";

interface PromotionTypeInfo {
  type: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
  icon: string;
}

interface PromotionCardWrapperProps {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  typeInfo: PromotionTypeInfo;
}

export const PromotionCardWrapper: React.FC<PromotionCardWrapperProps> = ({
  children,
  isSelected,
  onClick,
  typeInfo,
}) => (
  <div
    onClick={onClick}
    className={`
      relative rounded-xl p-5 cursor-pointer transition-all duration-200
      ${typeInfo.bgColor} border-2 ${typeInfo.borderColor}
      ${
        isSelected
          ? "ring-4 ring-blue-400/50 shadow-xl scale-[1.02]"
          : "shadow-md hover:shadow-xl hover:scale-[1.01]"
      }
      active:scale-[0.99]
    `}
  >
    {children}
  </div>
);
