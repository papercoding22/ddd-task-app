import React from "react";
import { format } from "date-fns";
import type { PromotionApplication, DownloadableCoupon } from "../../domain";
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

interface DownloadableCouponCardProps {
  application: PromotionApplication;
  isSelected: boolean;
  onToggle: (applySeq: number) => void;
  typeInfo: PromotionTypeInfo;
}

export const DownloadableCouponCard: React.FC<DownloadableCouponCardProps> = ({
  application,
  isSelected,
  onToggle,
  typeInfo,
}) => {
  const coupon = application.getPromotion() as unknown as DownloadableCoupon;

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
          tooltip="The discount amount that will be deducted from your purchase when using this coupon"
        />
        <StatItem
          label="Min Payment"
          value={`$${coupon.getMinimumPaymentPrice().toLocaleString()}`}
          tooltip="The minimum purchase amount required to use this coupon"
        />
        <StatItem
          label="Max Per User"
          value={coupon.getDownloadableCouponQuantity().toString()}
        />
        <StatItem
          label="Validity Period"
          value={`${coupon.getValidityPeriodDays()} days`}
        />
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700 font-medium">
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
            ? "Coupons Available"
            : "Sold Out",
        }}
      />

      <ViewDetailsButton
        variant="blue"
        onClick={(e) => {
          e.stopPropagation();
          // TODO: Navigate to detail page
          console.log("Navigate to downloadable coupon details:", application.getApplySeq());
        }}
      />
    </PromotionCardWrapper>
  );
};
