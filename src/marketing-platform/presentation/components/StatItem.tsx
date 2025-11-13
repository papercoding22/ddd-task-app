import React from "react";
import { Tooltip } from "./Tooltip";

interface StatItemProps {
  label: string;
  value: string | React.ReactNode;
  tooltip?: string;
}

export const StatItem: React.FC<StatItemProps> = ({ label, value, tooltip }) => (
  <div className="bg-white/50 rounded-lg p-3">
    <p className="text-xs text-gray-500 mb-1 font-medium">
      {tooltip ? (
        <Tooltip content={tooltip} position="top">
          <span className="inline-flex items-center gap-1 cursor-help">
            {label}
            <span className="text-gray-400">ℹ️</span>
          </span>
        </Tooltip>
      ) : (
        label
      )}
    </p>
    <p className="text-sm font-bold text-gray-900">{value}</p>
  </div>
);
