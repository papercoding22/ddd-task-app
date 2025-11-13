import React from "react";

interface BottomActionBarProps {
  isVisible: boolean;
  selectedCount: number;
  itemLabel: string;
  actionText?: string;
  onAction?: () => void;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  isVisible,
  selectedCount,
  itemLabel,
  actionText = "Apply",
  onAction,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 animate-in slide-in-from-bottom duration-300">
      <div className="bg-gradient-to-t from-white via-white to-transparent pt-8 pb-safe">
        <div className="px-4 pb-4">
          <button
            onClick={onAction}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-base shadow-2xl hover:shadow-blue-500/50 hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>
              {actionText} {selectedCount} {itemLabel}
              {selectedCount !== 1 ? "s" : ""}
            </span>
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
