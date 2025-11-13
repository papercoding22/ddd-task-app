import React, { useState } from "react";
import { useGetPromotions } from "../hooks/useGetPromotions";
import type { PromotionApplication } from "../../domain";
import {
  PointPromotionCard,
  DownloadableCouponCard,
  RewardCouponCard,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  StickyHeader,
  BottomActionBar,
  type PromotionTypeInfo,
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

  const getPromotionTypeInfo = (
    application: PromotionApplication
  ): PromotionTypeInfo => {
    const promotion = application.getPromotion();
    const promotionType = promotion.getPromotionType();
    const distributionType = promotion.getDistributionType();

    if (promotionType === "POINT_PROMOTION" && distributionType === "NA") {
      return {
        type: "Point Promotion",
        bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
        borderColor: "border-blue-400",
        badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-600",
        icon: "💎",
      };
    }

    if (promotionType === "POINT_COUPON" && distributionType === "DOWNLOAD") {
      return {
        type: "Download Coupon",
        bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
        borderColor: "border-green-400",
        badgeColor: "bg-gradient-to-r from-green-500 to-emerald-600",
        icon: "🎫",
      };
    }

    if (promotionType === "POINT_COUPON" && distributionType === "REWARD") {
      return {
        type: "Reward",
        bgColor: "bg-gradient-to-br from-purple-50 to-violet-50",
        borderColor: "border-purple-400",
        badgeColor: "bg-gradient-to-r from-purple-500 to-violet-600",
        icon: "🎁",
      };
    }

    return {
      type: "Unknown",
      bgColor: "bg-gradient-to-br from-gray-50 to-slate-50",
      borderColor: "border-gray-400",
      badgeColor: "bg-gradient-to-r from-gray-500 to-slate-600",
      icon: "📋",
    };
  };

  const renderPromotionCard = (application: PromotionApplication) => {
    const promotion = application.getPromotion();
    const promotionType = promotion.getPromotionType();
    const distributionType = promotion.getDistributionType();
    const isSelected = selectedIds.has(application.getApplySeq());
    const typeInfo = getPromotionTypeInfo(application);

    const cardProps = {
      application,
      isSelected,
      onToggle: toggleSelection,
      typeInfo,
    };

    if (promotionType === "POINT_PROMOTION" && distributionType === "NA") {
      return <PointPromotionCard {...cardProps} />;
    }

    if (promotionType === "POINT_COUPON" && distributionType === "DOWNLOAD") {
      return <DownloadableCouponCard {...cardProps} />;
    }

    if (promotionType === "POINT_COUPON" && distributionType === "REWARD") {
      return <RewardCouponCard {...cardProps} />;
    }

    return (
      <div className="border-2 border-gray-300 rounded-xl p-5 bg-gray-50">
        <h3 className="font-bold text-gray-900">{promotion.getTitle()}</h3>
        <p className="text-sm text-gray-500 mt-1">Unknown promotion type</p>
      </div>
    );
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
              {renderPromotionCard(application)}
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
