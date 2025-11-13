import React, { useState } from "react";
import { useGetPromotions } from "../hooks/useGetPromotions";
import { getPromotionDisplayInfo } from "../utils/getPromotionDisplayInfo";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  StickyHeader,
  BottomActionBar,
  PromotionCard,
} from "../components";

/**
 * Mobile-first Promotion List View
 * Displays promotions as selectable cards with different types
 */
export const PromotionListView: React.FC = () => {
  const { promotions, loading, error } = useGetPromotions();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggleSelection = (applySeq: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(applySeq)) {
        newSet.delete(applySeq);
      } else {
        newSet.add(applySeq);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const allIds = new Set(promotions.map((app) => app.getApplySeq()));
    setSelectedIds(allIds);
  };

  const clearAll = () => {
    setSelectedIds(new Set());
  };

  const handleApply = () => {
    // In a real app, this would dispatch an action to apply promotions
    console.log(`Applying ${selectedIds.size} promotions:`, selectedIds);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <StickyHeader
        title="Promotions"
        totalCount={promotions.length}
        selectedCount={selectedIds.size}
        onSelectAll={selectAll}
        onClearAll={clearAll}
      />

      {/* Promotions List */}
      <div className="px-4 py-6 space-y-4 pb-32">
        {promotions.length === 0 ? (
          <EmptyState />
        ) : (
          promotions.map((application) => (
            <div
              key={application.getApplySeq()}
              className="animate-in fade-in slide-in-from-bottom-4 duration-300"
            >
              <PromotionCard
                application={application}
                isSelected={selectedIds.has(application.getApplySeq())}
                onToggle={toggleSelection}
                typeInfo={getPromotionDisplayInfo(application)}
              />
            </div>
          ))
        )}
      </div>

      <BottomActionBar
        isVisible={selectedIds.size > 0}
        selectedCount={selectedIds.size}
        itemLabel="promotion"
        onAction={handleApply}
      />
    </div>
  );
};

export default PromotionListView;
