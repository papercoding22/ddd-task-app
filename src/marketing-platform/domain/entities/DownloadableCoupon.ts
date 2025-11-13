import { Coupon } from "./Coupon";
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
  CouponExpiredException,
  InvalidCouponQuantityException,
} from "../exceptions/PromotionExceptions";

/**
 * Downloadable Coupon entity
 * Handles downloadable coupon mechanics with download limits and flexible validity
 */
export class DownloadableCoupon extends Coupon {
  private couponName: string;
  private couponIssuanceQuantity: number;
  private minimumPaymentPrice: number;
  private downloadableCouponQuantity: number;
  private generalQuantityPerDay: number;
  // private downloadableMultiply: number;
  // private minDownloadableQuantity: number;
  private multipleIssuedYn: YesNo;

  constructor(params: {
    id: string;
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
    flexibleDaysType: FlexibleDaysType;
    flexibleDays: number;
    // Downloadable Coupon specific
    couponName: string;
    couponIssuanceQuantity: number;
    minimumPaymentPrice: number;
    downloadableCouponQuantity: number;
    downloadedCouponQuantity: number;
    generalQuantityPerDay: number;
    downloadableMultiply: number;
    minDownloadableQuantity: number;
    multipleIssuedYn: YesNo;
  }) {
    super({
      ...params,
      distributionType: "DOWNLOAD",
      validityPeriodType: params.flexibleDaysType,
      validityPeriodDays: params.flexibleDays,
      receivedCouponQuantity: params.downloadedCouponQuantity,
    });

    this.validateDownloadQuantities(
      params.downloadableCouponQuantity,
      params.downloadedCouponQuantity
    );

    this.couponName = params.couponName;
    this.couponIssuanceQuantity = params.couponIssuanceQuantity;
    this.minimumPaymentPrice = params.minimumPaymentPrice;
    this.downloadableCouponQuantity = params.downloadableCouponQuantity;
    this.generalQuantityPerDay = params.generalQuantityPerDay;
    // this.downloadableMultiply = params.downloadableMultiply;
    // this.minDownloadableQuantity = params.minDownloadableQuantity;
    this.multipleIssuedYn = params.multipleIssuedYn;
  }

  /**
   * Validates download quantities
   */
  private validateDownloadQuantities(
    downloadable: number,
    downloaded: number
  ): void {
    if (downloadable < 0 || downloaded < 0) {
      throw new InvalidCouponQuantityException(
        "Download quantities cannot be negative"
      );
    }

    if (downloaded > downloadable) {
      throw new InvalidCouponQuantityException(
        `Downloaded quantity (${downloaded}) cannot exceed downloadable quantity (${downloadable})`
      );
    }
  }

  /**
   * Checks if there are downloadable coupons available
   */
  public hasAvailableDownloads(): boolean {
    return this.receivedCouponQuantity < this.downloadableCouponQuantity;
  }

  /**
   * Checks if multiple downloads are allowed per user
   */
  public allowsMultipleDownloads(): boolean {
    return this.multipleIssuedYn === "Y";
  }

  /**
   * Calculates the remaining downloadable quantity
   */
  public getRemainingDownloadableQuantity(): number {
    return this.downloadableCouponQuantity - this.receivedCouponQuantity;
  }

  /**
   * Calculates the download usage percentage
   */
  public calculateDownloadPercentage(): number {
    if (this.downloadableCouponQuantity === 0) {
      return 0;
    }
    return (
      (this.receivedCouponQuantity / this.downloadableCouponQuantity) * 100
    );
  }

  /**
   * Calculates the coupon expiration date based on validity period
   * Implements abstract method from Coupon base class
   * @param downloadDate - The download date to calculate expiration from
   */
  public calculateCouponExpirationDate(downloadDate: Date = new Date()): Date {
    if (this.validityPeriodType === "FIXED_DATE") {
      return this.getEndDate();
    }

    // FLEXIBLE_DATE: Add validity period days to download date
    const expirationDate = new Date(downloadDate);
    expirationDate.setDate(expirationDate.getDate() + this.validityPeriodDays);
    return expirationDate;
  }

  /**
   * Checks if a downloaded coupon is expired
   */
  public isCouponExpired(
    downloadDate: Date,
    currentDate: Date = new Date()
  ): boolean {
    const expirationDate = this.calculateCouponExpirationDate(downloadDate);
    return currentDate > expirationDate;
  }

  /**
   * Validates that a coupon can be used
   */
  public validateCouponForUse(
    downloadDate: Date,
    paymentAmount: number,
    currentDate: Date = new Date()
  ): void {
    if (this.isCouponExpired(downloadDate, currentDate)) {
      throw new CouponExpiredException(
        `Coupon expired on ${this.calculateCouponExpirationDate(
          downloadDate
        ).toISOString()}`
      );
    }

    this.validateCouponUsage(paymentAmount);
  }

  /**
   * Checks if the minimum payment requirement is met for this downloadable coupon
   */
  public override meetsMinimumPayment(paymentAmount: number): boolean {
    return paymentAmount >= this.minimumPaymentPrice;
  }

  /**
   * Calculates discount with minimum payment check
   */
  public override calculateDiscount(paymentAmount: number): number {
    if (!this.meetsMinimumPayment(paymentAmount)) {
      return 0;
    }
    return super.calculateDiscount(paymentAmount);
  }

  /**
   * Gets the daily download limit information
   */
  public getDailyDownloadLimit(): number {
    return this.generalQuantityPerDay;
  }

  /**
   * Calculates total theoretical downloadable quantity based on daily limit
   */
  public calculateTotalDownloadableFromDaily(): number {
    const startDate = this.getStartDate();
    const endDate = this.getEndDate();
    const durationInDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return this.generalQuantityPerDay * durationInDays;
  }

  // Getters
  public getCouponName(): string {
    return this.couponName;
  }

  public getCouponIssuanceQuantity(): number {
    return this.couponIssuanceQuantity;
  }

  public getMinimumPaymentPrice(): number {
    return this.minimumPaymentPrice;
  }

  public getDownloadableCouponQuantity(): number {
    return this.downloadableCouponQuantity;
  }

  /**
   * Alias for getReceivedCouponQuantity() to maintain backwards compatibility
   * Returns the number of coupons that have been downloaded
   */
  public getDownloadedCouponQuantity(): number {
    return this.getReceivedCouponQuantity();
  }

  public getGeneralQuantityPerDay(): number {
    return this.generalQuantityPerDay;
  }

  public getMultipleIssuedYn(): YesNo {
    return this.multipleIssuedYn;
  }
}
