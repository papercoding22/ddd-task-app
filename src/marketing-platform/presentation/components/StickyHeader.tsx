import React from "react";
import { PromotionHeader } from "./PromotionHeader";
import { StatsBar } from "./StatsBar";
import { ActionButtons, type ButtonConfig } from "./ActionButtons";

interface StickyHeaderProps {
  title: string;
  totalCount: number;
  selectedCount: number;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  title,
  totalCount,
  selectedCount,
  onSelectAll,
  onClearAll,
}) => {
  const actionButtons: ButtonConfig[] = [
    {
      label: "Select All",
      onClick: onSelectAll,
      variant: "primary",
    },
    {
      label: "Clear All",
      onClick: onClearAll,
      variant: "secondary",
      disabled: selectedCount === 0,
    },
  ];

  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="px-4 py-5">
        <PromotionHeader title={title} totalCount={totalCount} />
        <StatsBar totalCount={totalCount} selectedCount={selectedCount} />
        <ActionButtons buttons={actionButtons} />
      </div>
    </div>
  );
};
