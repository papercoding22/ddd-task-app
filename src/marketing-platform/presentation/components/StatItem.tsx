import React from "react";

interface StatItemProps {
  label: string;
  value: string | React.ReactNode;
}

export const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <div className="bg-white/50 rounded-lg p-3">
    <p className="text-xs text-gray-500 mb-1 font-medium">{label}</p>
    <p className="text-sm font-bold text-gray-900">{value}</p>
  </div>
);
