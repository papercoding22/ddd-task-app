import React from "react";

interface MerchantInfoProps {
  merchantName: string;
}

export const MerchantInfo: React.FC<MerchantInfoProps> = ({ merchantName }) => (
  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
    <span className="text-gray-400">🏪</span>
    <span className="text-sm text-gray-600 font-medium">{merchantName}</span>
  </div>
);
