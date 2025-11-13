import React from "react";

interface PromotionHeaderProps {
  title: string;
  totalCount: number;
}

export const PromotionHeader: React.FC<PromotionHeaderProps> = ({
  title,
  totalCount,
}) => (
  <div className="flex items-center justify-between mb-4">
    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
      {totalCount}
    </div>
  </div>
);
