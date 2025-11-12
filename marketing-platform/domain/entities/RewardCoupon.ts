import { Coupon } from "./Coupon";
import {
  PromotionType,
  DistributionType,
  ProductType,
  ApplicationStatus,
  ImageType,
  ExhaustionAlarmPercentages,
  YesNo,
  FlexibleDaysType,
} from "../types";
import {
  InsufficientBudgetException,
  CouponExpiredException,
  MinimumPaymentNotMetException,
} from "../exceptions/PromotionExceptions";

/**
 * Reward Coupon entity
 * Handles reward-based coupon distribution with automatic granting
 */
export class RewardCoupon extends Coupon {
  private couponGrantYn: YesNo;
  private couponGrantMinPrice: number | null;

  constructor(params: {
    title: string;
    startDate: Date;
    endDate: Date;
    promotionType: PromotionType;
    distributionType: DistributionType;
    productType: ProductType;
    imageType: ImageType;
    imageObsId: string;
    imageObsHash: string;
    imageUrl: string;
    exhaustionAlarmYn: YesNo;
    exhaustionAlarmPercentageList: ExhaustionAlarmPercentages[];
    couponDiscountPrice: number;
    purchasedCouponQuantity: number;
    usedCouponQuantity: number;
    remainingCouponQuantity: number;
    fullPaymentYn: YesNo;
    fullPaymentMinPrice: number;
    validityPeriodType: FlexibleDaysType;
    validityPeriodDays: number;
    // Reward Coupon specific
    couponGrantYn: YesNo;
    couponGrantMinPrice: number | null;
    receivedCouponQuantity: number;
  }) {
    super(params);

    this.couponGrantYn = params.couponGrantYn;
    this.couponGrantMinPrice = params.couponGrantMinPrice;
  }

  /**
   * Checks if automatic coupon granting is enabled
   */
  public isAutomaticGrantEnabled(): boolean {
    return this.couponGrantYn === "Y";
  }

  /**
   * Checks if a payment amount qualifies for automatic coupon grant
   */
  public qualifiesForAutoGrant(paymentAmount: number): boolean {
    if (!this.isAutomaticGrantEnabled()) {
      return false;
    }

    if (this.couponGrantMinPrice === null) {
      return true;
    }

    return paymentAmount >= this.couponGrantMinPrice;
  }

  /**
   * Calculates the coupon expiration date based on validity period
   * Implements abstract method from Coupon base class
   * @param issueDate - The issue date to calculate expiration from
   */
  public calculateCouponExpirationDate(issueDate: Date = new Date()): Date {
    const endDate = new Date(issueDate);
    endDate.setDate(endDate.getDate() + this.validityPeriodDays);
    return endDate;
  }

  /**
   * Checks if a coupon is still valid
   */
  public isCouponValid(
    issueDate: Date,
    currentDate: Date = new Date()
  ): boolean {
    const validityEndDate = this.calculateCouponExpirationDate(issueDate);
    return currentDate <= validityEndDate;
  }

  /**
   * Calculates discount with validity period check
   */
  public calculateDiscountWithValidity(
    issueDate: Date,
    paymentAmount: number,
    currentDate: Date = new Date()
  ): number {
    if (!this.isCouponValid(issueDate, currentDate)) {
      return 0;
    }

    return this.calculateDiscount(paymentAmount);
  }

  /**
   * Gets the number of days until the coupon expires
   */
  public getDaysUntilExpiration(
    issueDate: Date,
    currentDate: Date = new Date()
  ): number {
    const validityEndDate = this.calculateCouponExpirationDate(issueDate);
    const diffTime = validityEndDate.getTime() - currentDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Checks if a coupon is expiring soon (within specified days)
   */
  public isExpiringSoon(
    issueDate: Date,
    daysThreshold: number = 3,
    currentDate: Date = new Date()
  ): boolean {
    if (!this.isCouponValid(issueDate, currentDate)) {
      return false;
    }

    const daysUntilExpiration = this.getDaysUntilExpiration(
      issueDate,
      currentDate
    );
    return daysUntilExpiration <= daysThreshold && daysUntilExpiration > 0;
  }

  /**
   * Gets information about the validity period
   */
  public getValidityPeriodInfo(): {
    type: FlexibleDaysType;
    days: number;
    description: string;
  } {
    return {
      type: this.validityPeriodType,
      days: this.validityPeriodDays,
      description: `Valid for ${this.validityPeriodDays} days from issue date`,
    };
  }

  // Getters
  public getCouponGrantYn(): YesNo {
    return this.couponGrantYn;
  }

  public getCouponGrantMinPrice(): number | null {
    return this.couponGrantMinPrice;
  }
}
