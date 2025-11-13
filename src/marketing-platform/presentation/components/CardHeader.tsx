import React from "react";

interface PromotionTypeInfo {
  type: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
  icon: string;
}

interface CardHeaderProps {
  icon: string;
  title: string;
  typeInfo: PromotionTypeInfo;
  status: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  icon,
  title,
  typeInfo,
  status,
}) => (
  <div className="flex items-start gap-3 mb-4 pr-10">
    <div className="text-3xl flex-shrink-0 mt-1">{icon}</div>
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap gap-2 mb-2">
        <span
          className={`
          ${typeInfo.badgeColor} text-white text-xs px-2.5 py-1 
          rounded-md font-semibold uppercase tracking-wide
        `}
        >
          {typeInfo.type}
        </span>
        <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2.5 py-1 rounded-md font-medium">
          {status}
        </span>
      </div>
      <h3 className="font-bold text-lg text-gray-900 leading-snug break-words">
        {title}
      </h3>
    </div>
  </div>
);
