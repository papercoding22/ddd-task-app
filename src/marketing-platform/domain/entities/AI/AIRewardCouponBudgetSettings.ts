import { YesNo } from "../../types";
import { AICouponBudgetSettings } from "./AICouponBudgetSettings";
import { DistributionType } from "../../types";

/**
 * A.I Recommended Reward Coupon Budget Settings Value Object
 * Used specifically for Reward Coupon Types
 */
export class AIRewardCouponBudgetSettings extends AICouponBudgetSettings {
  private couponGrantYn: YesNo;
  private couponGrantMinPrice: number | null;

  constructor(params: {
    distributionType: DistributionType;
    purchasedCouponQuantity: number;
    fullPaymentYn: YesNo;
    couponDiscountPrice: number;
    minimumPaymentPrice: number;
    couponGrantYn: YesNo;
    couponGrantMinPrice: number | null;
  }) {
    super({
      distributionType: params.distributionType,
      purchasedCouponQuantity: params.purchasedCouponQuantity,
      couponDiscountPrice: params.couponDiscountPrice,
      fullPaymentYn: params.fullPaymentYn,
      minimumPaymentPrice: params.minimumPaymentPrice,
    });

    this.couponGrantYn = params.couponGrantYn;
    this.couponGrantMinPrice = params.couponGrantMinPrice;
  }

  public getCouponGrantYn(): YesNo {
    return this.couponGrantYn;
  }

  public getCouponGrantMinPrice(): number | null {
    return this.couponGrantMinPrice;
  }
}
