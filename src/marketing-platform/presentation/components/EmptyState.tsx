import React from "react";

export const EmptyState: React.FC = () => (
  <div className="text-center py-20">
    <div className="text-6xl mb-4">📭</div>
    <p className="text-gray-500 text-lg font-medium">No promotions found</p>
    <p className="text-gray-400 text-sm mt-2">Check back later for new offers</p>
  </div>
);
