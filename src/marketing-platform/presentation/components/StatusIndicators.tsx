import React from "react";

interface StatusIndicatorsProps {
  isActive: boolean;
  secondaryStatus: { isPositive: boolean; label: string };
}

export const StatusIndicators: React.FC<StatusIndicatorsProps> = ({
  isActive,
  secondaryStatus,
}) => (
  <div className="mt-3 flex items-center gap-3 text-xs">
    <span
      className={`flex items-center gap-1 font-medium ${
        isActive ? "text-green-600" : "text-gray-400"
      }`}
    >
      <span className={isActive ? "animate-pulse" : ""}>●</span>
      {isActive ? "Active" : "Inactive"}
    </span>
    <span className="text-gray-300">•</span>
    <span
      className={`font-medium ${
        secondaryStatus.isPositive ? "text-green-600" : "text-red-500"
      }`}
    >
      {secondaryStatus.label}
    </span>
  </div>
);
