import React from "react";

interface StatsBarProps {
  totalCount: number;
  selectedCount: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalCount,
  selectedCount,
}) => (
  <div className="flex items-center justify-between text-sm mb-4">
    <p className="text-gray-600 font-medium">
      {totalCount} promotion{totalCount !== 1 ? "s" : ""} available
    </p>
    {selectedCount > 0 && (
      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
        <span className="bg-blue-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
          {selectedCount}
        </span>
        <span className="text-blue-600 font-semibold">selected</span>
      </div>
    )}
  </div>
);
