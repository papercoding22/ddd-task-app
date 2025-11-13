import React from "react";

interface ErrorMessageProps {
  error: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
    <div className="bg-white border-2 border-red-200 rounded-xl p-6 max-w-md shadow-xl">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-red-800 font-bold text-xl">Error</h3>
      </div>
      <p className="text-red-600 leading-relaxed">{error}</p>
    </div>
  </div>
);
