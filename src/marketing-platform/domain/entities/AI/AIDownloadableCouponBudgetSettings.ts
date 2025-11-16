import { YesNo } from "../../types";
import { AICouponBudgetSettings } from "./AICouponBudgetSettings";
import { DistributionType } from "../../types";

/**
 * A.I Recommended Downloadable Coupon Budget Settings Value Object
 * Used specifically for Downloadable Coupon Types
 */
export class AIDownloadableCouponBudgetSettings extends AICouponBudgetSettings {
  constructor(params: {
    distributionType: DistributionType;
    purchasedCouponQuantity: number;
    fullPaymentYn: YesNo;
    couponDiscountPrice: number;
    minimumPaymentPrice: number;
  }) {
    super({
      distributionType: params.distributionType,
      purchasedCouponQuantity: params.purchasedCouponQuantity,
      couponDiscountPrice: params.couponDiscountPrice,
      fullPaymentYn: params.fullPaymentYn,
      minimumPaymentPrice: params.minimumPaymentPrice,
    });
  }
}
