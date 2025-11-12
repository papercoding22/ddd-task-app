import { Promotion } from "./Promotion";
import {
  PromotionType,
  DistributionType,
  ProductType,
  ImageType,
  ExhaustionAlarmPercentages,
  YesNo,
  FlexibleDaysType,
} from "../types";
import {
  InvalidCouponQuantityException,
  InsufficientBudgetException,
  MinimumPaymentNotMetException,
} from "../exceptions/PromotionExceptions";

/**
 * Abstract base class for all coupon types
 * Extends Promotion and adds common coupon-specific functionality
 */
export abstract class Coupon extends Promotion {
  protected couponDiscountPrice: number;
  protected purchasedCouponQuantity: number;
  protected usedCouponQuantity: number;
  protected remainingCouponQuantity: number;
  protected fullPaymentYn: YesNo;
  protected fullPaymentMinPrice: number;

  // Validity period management (common for all coupons)
  protected validityPeriodType: FlexibleDaysType;
  protected validityPeriodDays: number;

  // Received/Downloaded coupon quantity tracking (common for all coupons)
  protected receivedCouponQuantity: number;

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
    // Coupon-specific properties
    couponDiscountPrice: number;
    purchasedCouponQuantity: number;
    usedCouponQuantity: number;
    remainingCouponQuantity: number;
    fullPaymentYn: YesNo;
    fullPaymentMinPrice: number;
    validityPeriodType: FlexibleDaysType;
    validityPeriodDays: number;
    receivedCouponQuantity: number;
  }) {
    super(params);

    this.validateCouponQuantities(
      params.purchasedCouponQuantity,
      params.usedCouponQuantity,
      params.remainingCouponQuantity
    );
    this.validateDiscountPrice(params.couponDiscountPrice);
    this.validateMinimumPrice(params.fullPaymentMinPrice);

    this.couponDiscountPrice = params.couponDiscountPrice;
    this.purchasedCouponQuantity = params.purchasedCouponQuantity;
    this.usedCouponQuantity = params.usedCouponQuantity;
    this.remainingCouponQuantity = params.remainingCouponQuantity;
    this.fullPaymentYn = params.fullPaymentYn;
    this.fullPaymentMinPrice = params.fullPaymentMinPrice;
    this.validityPeriodType = params.validityPeriodType;
    this.validityPeriodDays = params.validityPeriodDays;
    this.receivedCouponQuantity = params.receivedCouponQuantity ?? 0;
  }

  /**
   * Validates that coupon quantities are consistent
   */
  private validateCouponQuantities(
    purchased: number,
    used: number,
    remaining: number
  ): void {
    if (purchased < 0 || used < 0 || remaining < 0) {
      throw new InvalidCouponQuantityException(
        "Coupon quantities cannot be negative"
      );
    }

    if (used > purchased) {
      throw new InvalidCouponQuantityException(
        `Used quantity (${used}) cannot exceed purchased quantity (${purchased})`
      );
    }

    if (remaining > purchased) {
      throw new InvalidCouponQuantityException(
        `Remaining quantity (${remaining}) cannot exceed purchased quantity (${purchased})`
      );
    }
  }

  /**
   * Validates that discount price is positive
   */
  private validateDiscountPrice(price: number): void {
    if (price <= 0) {
      throw new InvalidCouponQuantityException(
        "Discount price must be positive"
      );
    }
  }

  /**
   * Validates that minimum price is non-negative
   */
  private validateMinimumPrice(price: number): void {
    if (price < 0) {
      throw new InvalidCouponQuantityException(
        "Minimum price cannot be negative"
      );
    }
  }

  /**
   * Checks if there are coupons available
   */
  public hasAvailableCoupons(): boolean {
    return this.remainingCouponQuantity > 0;
  }

  /**
   * Checks if the payment amount meets the minimum requirement
   */
  public meetsMinimumPayment(paymentAmount: number): boolean {
    if (this.fullPaymentYn === "Y") {
      return paymentAmount >= this.fullPaymentMinPrice;
    }
    return true;
  }

  /**
   * Validates that a coupon can be used with the given payment amount
   */
  protected validateCouponUsage(paymentAmount: number): void {
    if (!this.hasAvailableCoupons()) {
      throw new InsufficientBudgetException("No coupons available");
    }

    if (!this.meetsMinimumPayment(paymentAmount)) {
      throw new MinimumPaymentNotMetException(
        this.fullPaymentMinPrice,
        paymentAmount
      );
    }
  }

  /**
   * Calculates the discount amount for a given payment
   */
  public calculateDiscount(paymentAmount: number): number {
    if (!this.meetsMinimumPayment(paymentAmount)) {
      return 0;
    }

    // Return the full discount amount if minimum is met
    return Math.min(this.couponDiscountPrice, paymentAmount);
  }

  /**
   * Calculates the usage percentage of coupons
   */
  public calculateUsagePercentage(): number {
    if (this.purchasedCouponQuantity === 0) {
      return 0;
    }
    return (this.usedCouponQuantity / this.purchasedCouponQuantity) * 100;
  }

  /**
   * Gets the final payment amount after discount
   */
  public getFinalPaymentAmount(paymentAmount: number): number {
    const discount = this.calculateDiscount(paymentAmount);
    return Math.max(0, paymentAmount - discount);
  }

  // Getters
  public getCouponDiscountPrice(): number {
    return this.couponDiscountPrice;
  }

  public getPurchasedCouponQuantity(): number {
    return this.purchasedCouponQuantity;
  }

  public getUsedCouponQuantity(): number {
    return this.usedCouponQuantity;
  }

  public getRemainingCouponQuantity(): number {
    return this.remainingCouponQuantity;
  }

  public getFullPaymentYn(): YesNo {
    return this.fullPaymentYn;
  }

  public getFullPaymentMinPrice(): number {
    return this.fullPaymentMinPrice;
  }

  public getValidityPeriodType(): FlexibleDaysType {
    return this.validityPeriodType;
  }

  public getValidityPeriodDays(): number {
    return this.validityPeriodDays;
  }

  public getReceivedCouponQuantity(): number {
    return this.receivedCouponQuantity;
  }

  /**
   * Increments the received coupon quantity
   * Used when a coupon is issued/downloaded
   */
  protected incrementReceivedCouponQuantity(): void {
    this.receivedCouponQuantity++;
  }

  /**
   * Abstract method to calculate coupon expiration date
   * Each subclass implements its own business logic for expiration calculation
   * @param referenceDate - The date to calculate expiration from (e.g., issue date, download date)
   * @returns The calculated expiration date
   */
  public abstract calculateCouponExpirationDate(referenceDate: Date): Date;
}
