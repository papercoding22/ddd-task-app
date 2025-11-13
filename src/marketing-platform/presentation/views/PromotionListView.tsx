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
      {/* Sticky Header with Backdrop Blur */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Promotions
            </h1>
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
              {promotions.length}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between text-sm mb-4">
            <p className="text-gray-600 font-medium">
              {promotions.length} promotion
              {promotions.length !== 1 ? "s" : ""} available
            </p>
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                <span className="bg-blue-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                  {selectedIds.size}
                </span>
                <span className="text-blue-600 font-semibold">selected</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={selectAll}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-200"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              disabled={selectedIds.size === 0}
              className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:bg-gray-50 hover:border-gray-400 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:active:scale-100 transition-all duration-200"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

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

      {/* Bottom Action Bar - Floating */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 animate-in slide-in-from-bottom duration-300">
          <div className="bg-gradient-to-t from-white via-white to-transparent pt-8 pb-safe">
            <div className="px-4 pb-4">
              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-base shadow-2xl hover:shadow-blue-500/50 hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
                <span>
                  Apply {selectedIds.size} Promotion
                  {selectedIds.size !== 1 ? "s" : ""}
                </span>
                <span className="text-xl">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionListView;
