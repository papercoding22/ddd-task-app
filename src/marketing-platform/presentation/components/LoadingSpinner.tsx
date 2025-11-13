import React from "react";

export const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500 mx-auto mb-4"></div>
        <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-300 animate-ping mx-auto opacity-20"></div>
      </div>
      <p className="text-gray-600 font-medium">Loading promotions...</p>
    </div>
  </div>
);
