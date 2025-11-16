import { YesNo } from "../../types";
import { DistributionType } from "../../types";

import { AIBudgetSettings } from "./AIBudgetSettings";
/**
 * A.I Recommended Coupon Budget Settings Value Object
 * Used for Downloadable/Reward Coupon Types
 */
export abstract class AICouponBudgetSettings extends AIBudgetSettings {
  private readonly purchasedCouponQuantity: number;
  private readonly couponDiscountPrice: number;
  private readonly fullPaymentYn: YesNo;
  private readonly minimumPaymentPrice: number;

  constructor(params: {
    distributionType: DistributionType;
    purchasedCouponQuantity: number;
    couponDiscountPrice: number;
    fullPaymentYn: YesNo;
    minimumPaymentPrice: number;
  }) {
    super({ distributionType: params.distributionType });
    this.purchasedCouponQuantity = params.purchasedCouponQuantity;
    this.couponDiscountPrice = params.couponDiscountPrice;
    this.fullPaymentYn = params.fullPaymentYn;
    this.minimumPaymentPrice = params.minimumPaymentPrice;
  }

  public getPurchasedCouponQuantity(): number {
    return this.purchasedCouponQuantity;
  }

  public getCouponDiscountPrice(): number {
    return this.couponDiscountPrice;
  }

  public getFullPaymentYn(): YesNo {
    return this.fullPaymentYn;
  }

  public getMinimumPaymentPrice(): number {
    return this.minimumPaymentPrice;
  }
}
