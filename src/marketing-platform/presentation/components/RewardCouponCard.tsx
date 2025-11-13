import React from "react";
import type { PromotionApplication, RewardCoupon } from "../../domain";
import {
  PromotionCardWrapper,
  SelectionCheckbox,
  CardHeader,
  MerchantInfo,
  StatItem,
  DateRange,
  StatusIndicators,
  type PromotionTypeInfo,
} from "./";

interface RewardCouponCardProps {
  application: PromotionApplication;
  isSelected: boolean;
  onToggle: (applySeq: number) => void;
  typeInfo: PromotionTypeInfo;
}

export const RewardCouponCard: React.FC<RewardCouponCardProps> = ({
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
          label="Min Grant Price"
          value={
            coupon.getCouponGrantMinPrice()
              ? `$${coupon.getCouponGrantMinPrice()?.toLocaleString()}`
              : "No minimum"
          }
        />
        <StatItem
          label="Available"
          value={`${coupon.getRemainingCouponQuantity().toLocaleString()}`}
        />
        <StatItem
          label="Validity Period"
          value={`${coupon.getValidityPeriodDays()} days`}
        />
      </div>

      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-xs text-purple-700 font-semibold flex items-center gap-2">
          <span>🎯</span>
          <span>
            Automatically granted when purchase qualifies!
          </span>
        </p>
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
            ? "Rewards Available"
            : "No Rewards",
        }}
      />
    </PromotionCardWrapper>
  );
};
