import React, { useState } from "react";
import { useGetPromotions } from "../hooks/useGetPromotions";
import type {
  PromotionApplication,
  PointPromotion,
  DownloadableCoupon,
  RewardCoupon,
} from "../../domain";

// Type definitions for promotion styling
interface PromotionTypeInfo {
  type: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
  icon: string;
}

interface PromotionCardProps {
  application: PromotionApplication;
  isSelected: boolean;
  onToggle: (applySeq: number) => void;
  typeInfo: PromotionTypeInfo;
}

/**
 * Reusable Card Wrapper Component
 */
const PromotionCardWrapper: React.FC<{
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  typeInfo: PromotionTypeInfo;
}> = ({ children, isSelected, onClick, typeInfo }) => (
  <div
    onClick={onClick}
    className={`
      relative rounded-xl p-5 cursor-pointer transition-all duration-200
      ${typeInfo.bgColor} border-2 ${typeInfo.borderColor}
      ${
        isSelected
          ? "ring-4 ring-blue-400/50 shadow-xl scale-[1.02]"
          : "shadow-md hover:shadow-xl hover:scale-[1.01]"
      }
      active:scale-[0.99]
    `}
  >
    {children}
  </div>
);

/**
 * Checkbox Component
 */
const SelectionCheckbox: React.FC<{ isSelected: boolean }> = ({
  isSelected,
}) => (
  <div className="absolute top-4 right-4 z-10">
    <div
      className={`
        w-7 h-7 rounded-lg border-2 flex items-center justify-center
        transition-all duration-200
        ${
          isSelected
            ? "bg-blue-500 border-blue-500 scale-110"
            : "bg-white border-gray-300 group-hover:border-gray-400"
        }
      `}
    >
      {isSelected && (
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  </div>
);

/**
 * Card Header Component
 */
const CardHeader: React.FC<{
  icon: string;
  title: string;
  typeInfo: PromotionTypeInfo;
  status: string;
}> = ({ icon, title, typeInfo, status }) => (
  <div className="flex items-start gap-3 mb-4 pr-10">
    <div className="text-3xl flex-shrink-0 mt-1">{icon}</div>
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap gap-2 mb-2">
        <span
          className={`
          ${typeInfo.badgeColor} text-white text-xs px-2.5 py-1 
          rounded-md font-semibold uppercase tracking-wide
        `}
        >
          {typeInfo.type}
        </span>
        <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2.5 py-1 rounded-md font-medium">
          {status}
        </span>
      </div>
      <h3 className="font-bold text-lg text-gray-900 leading-snug break-words">
        {title}
      </h3>
    </div>
  </div>
);

/**
 * Merchant Info Component
 */
const MerchantInfo: React.FC<{ merchantName: string }> = ({ merchantName }) => (
  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
    <span className="text-gray-400">🏪</span>
    <span className="text-sm text-gray-600 font-medium">{merchantName}</span>
  </div>
);

/**
 * Stats Grid Item Component
 */
const StatItem: React.FC<{
  label: string;
  value: string | React.ReactNode;
}> = ({ label, value }) => (
  <div className="bg-white/50 rounded-lg p-3">
    <p className="text-xs text-gray-500 mb-1 font-medium">{label}</p>
    <p className="font-bold text-gray-900 text-sm">{value}</p>
  </div>
);

/**
 * Date Range Component
 */
const DateRange: React.FC<{ startDate: Date; endDate: Date }> = ({
  startDate,
  endDate,
}) => (
  <div className="mt-4 pt-4 border-t border-gray-200">
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span>📅</span>
      <span className="font-medium">
        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
      </span>
    </div>
  </div>
);

/**
 * Status Indicators Component
 */
const StatusIndicators: React.FC<{
  isActive: boolean;
  secondaryStatus: { isPositive: boolean; label: string };
}> = ({ isActive, secondaryStatus }) => (
  <div className="mt-3 flex items-center gap-3 text-xs">
    <span
      className={`flex items-center gap-1 font-medium ${
        isActive ? "text-green-600" : "text-gray-400"
      }`}
    >
      <span className={isActive ? "animate-pulse" : ""}>●</span>
      {isActive ? "Active" : "Inactive"}
    </span>
    <span className="text-gray-300">•</span>
    <span
      className={`font-medium ${
        secondaryStatus.isPositive ? "text-green-600" : "text-red-500"
      }`}
    >
      {secondaryStatus.label}
    </span>
  </div>
);

/**
 * Point Promotion Card
 */
const PointPromotionCard: React.FC<PromotionCardProps> = ({
  application,
  isSelected,
  onToggle,
  typeInfo,
}) => {
  const promotion = application.getPromotion() as unknown as PointPromotion;

  return (
    <PromotionCardWrapper
      isSelected={isSelected}
      onClick={() => onToggle(application.getApplySeq())}
      typeInfo={typeInfo}
    >
      <SelectionCheckbox isSelected={isSelected} />

      <CardHeader
        icon={typeInfo.icon}
        title={promotion.getTitle()}
        typeInfo={typeInfo}
        status={application.getApplicationStatus()}
      />

      <MerchantInfo merchantName={application.getMerchantName()} />

      <div className="grid grid-cols-2 gap-3">
        <StatItem
          label="Budget"
          value={`${promotion.getPromotionBudget().toLocaleString()} pts`}
        />
        <StatItem
          label="Remaining"
          value={`${promotion.getRemainingPoint().toLocaleString()} pts`}
        />
        <StatItem
          label="Usage"
          value={
            <span className="flex items-baseline gap-1">
              {promotion.getUsedPointPercentage().toFixed(1)}%
              <span className="text-xs text-gray-500">used</span>
            </span>
          }
        />
        <StatItem
          label="Saving Type"
          value={
            promotion.getPromotionSavingType() === "FIXED_RATE"
              ? `${promotion.getPromotionSavingRate()}%`
              : "Fixed"
          }
        />
      </div>

      <DateRange
        startDate={promotion.getStartDate()}
        endDate={promotion.getEndDate()}
      />

      <StatusIndicators
        isActive={application.isActive()}
        secondaryStatus={{
          isPositive: promotion.hasSufficientPoints(100),
          label: promotion.hasSufficientPoints(100)
            ? "Points Available"
            : "Low Points",
        }}
      />
    </PromotionCardWrapper>
  );
};

/**
 * Downloadable Coupon Card
 */
const DownloadableCouponCard: React.FC<PromotionCardProps> = ({
  application,
  isSelected,
  onToggle,
  typeInfo,
}) => {
  const coupon = application.getPromotion() as unknown as DownloadableCoupon;

  return (
    <PromotionCardWrapper
      isSelected={isSelected}
      onClick={() => onToggle(application.getApplySeq())}
      typeInfo={typeInfo}
    >
      <SelectionCheckbox isSelected={isSelected} />

      <CardHeader
        icon={typeInfo.icon}
        title={coupon.getTitle()}
        typeInfo={typeInfo}
        status={application.getApplicationStatus()}
      />

      <MerchantInfo merchantName={application.getMerchantName()} />

      <div className="grid grid-cols-2 gap-3">
        <StatItem
          label="Discount"
          value={`$${coupon.getCouponDiscountPrice().toLocaleString()}`}
        />
        <StatItem
          label="Min Payment"
          value={`$${coupon.getMinimumPaymentPrice().toLocaleString()}`}
        />
        <StatItem
          label="Downloads"
          value={`${coupon.getDownloadedCouponQuantity()} / ${coupon.getDownloadableCouponQuantity()}`}
        />
        <StatItem
          label="Usage"
          value={
            <span className="flex items-baseline gap-1">
              {coupon.calculateUsagePercentage().toFixed(1)}%
              <span className="text-xs text-gray-500">used</span>
            </span>
          }
        />
      </div>

      <DateRange
        startDate={coupon.getStartDate()}
        endDate={coupon.getEndDate()}
      />

      <StatusIndicators
        isActive={application.isActive()}
        secondaryStatus={{
          isPositive: coupon.hasAvailableCoupons(),
          label: coupon.hasAvailableCoupons()
            ? "Coupons Available"
            : "Sold Out",
        }}
      />
    </PromotionCardWrapper>
  );
};

/**
 * Reward Coupon Card
 */
const RewardCouponCard: React.FC<PromotionCardProps> = ({
  application,
  isSelected,
  onToggle,
  typeInfo,
}) => {
  const coupon = application.getPromotion() as unknown as RewardCoupon;

  return (
    <PromotionCardWrapper
      isSelected={isSelected}
      onClick={() => onToggle(application.getApplySeq())}
      typeInfo={typeInfo}
    >
      <SelectionCheckbox isSelected={isSelected} />

      <CardHeader
        icon={typeInfo.icon}
        title={coupon.getTitle()}
        typeInfo={typeInfo}
        status={application.getApplicationStatus()}
      />

      <MerchantInfo merchantName={application.getMerchantName()} />

      <div className="grid grid-cols-2 gap-3">
        <StatItem
          label="Discount"
          value={`$${coupon.getCouponDiscountPrice().toLocaleString()}`}
        />
        <StatItem
          label="Received"
          value={coupon.getReceivedCouponQuantity().toLocaleString()}
        />
        <StatItem
          label="Remaining"
          value={coupon.getRemainingCouponQuantity().toLocaleString()}
        />
        <StatItem
          label="Auto Grant"
          value={
            <span
              className={
                coupon.isAutomaticGrantEnabled()
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              {coupon.isAutomaticGrantEnabled() ? "✓ Yes" : "○ No"}
            </span>
          }
        />
      </div>

      <DateRange
        startDate={coupon.getStartDate()}
        endDate={coupon.getEndDate()}
      />

      <StatusIndicators
        isActive={application.isActive()}
        secondaryStatus={{
          isPositive: coupon.hasAvailableCoupons(),
          label: coupon.hasAvailableCoupons()
            ? "Coupons Available"
            : "No Coupons",
        }}
      />
    </PromotionCardWrapper>
  );
};

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
    setSelectedIds(new Set(promotions.map((p) => p.getApplySeq())));
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
        bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
        borderColor: "border-green-400",
        badgeColor: "bg-gradient-to-r from-green-500 to-emerald-600",
        icon: "🎯",
      };
    } else if (
      promotionType === "POINT_COUPON" &&
      distributionType === "DOWNLOAD"
    ) {
      return {
        type: "Downloadable",
        bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
        borderColor: "border-orange-400",
        badgeColor: "bg-gradient-to-r from-orange-500 to-amber-600",
        icon: "🎫",
      };
    } else if (
      promotionType === "POINT_COUPON" &&
      distributionType === "REWARD"
    ) {
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

    const cardProps: PromotionCardProps = {
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
    return (
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
  }

  if (error) {
    return (
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
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg font-medium">
              No promotions found
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Check back later for new offers
            </p>
          </div>
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
