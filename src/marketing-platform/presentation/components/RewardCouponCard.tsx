import React from "react";
import { format } from "date-fns";
import type { PromotionApplication, RewardCoupon } from "../../domain";
import {
  PromotionCardWrapper,
  SelectionCheckbox,
  CardHeader,
  MerchantInfo,
  StatItem,
  DateRange,
  StatusIndicators,
  ViewDetailsButton,
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

  const lastDayToRedeem = coupon.calculateCouponExpirationDate(
    coupon.getEndDate()
  );

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
          tooltip="The discount amount you'll receive when this reward coupon is applied to your purchase"
        />
        <StatItem
          label="Min Grant Price"
          value={
            coupon.getCouponGrantMinPrice()
              ? `$${coupon.getCouponGrantMinPrice()?.toLocaleString()}`
              : "No minimum"
          }
          tooltip="The minimum purchase amount required to automatically receive this reward coupon"
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
        <p className="text-xs text-purple-700 font-medium">
          Last day to redeem: {format(lastDayToRedeem, "d MMM, yyyy")}
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

      <ViewDetailsButton
        variant="purple"
        onClick={(e) => {
          e.stopPropagation();
          // TODO: Navigate to detail page
          console.log("Navigate to reward coupon details:", application.getApplySeq());
        }}
      />
    </PromotionCardWrapper>
  );
};
