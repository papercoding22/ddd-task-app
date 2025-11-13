import React from "react";
import { format } from "date-fns";

interface DateRangeProps {
  startDate: Date;
  endDate: Date;
}

export const DateRange: React.FC<DateRangeProps> = ({ startDate, endDate }) => (
  <div className="mt-4 pt-4 border-t border-gray-200">
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span>📅</span>
      <span className="font-medium">
        {format(startDate, "d MMM, yyyy")} - {format(endDate, "d MMM, yyyy")}
      </span>
    </div>
  </div>
);
