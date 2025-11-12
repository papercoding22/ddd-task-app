import { Promotion } from "./Promotion";
import { PromotionOrder } from "./PromotionOrder";
import {
  CountryType,
  ApplicationRouteType,
  ApplicationStatus,
  YesNo,
  ReviewDetail,
  EarlyEndInfo,
} from "../types";

/**
 * PromotionApplication aggregate root
 * Represents a complete promotion application including the promotion details,
 * order information, review status, and lifecycle management
 */
export class PromotionApplication {
  private readonly applySeq: number;
  private readonly countryType: CountryType;
  private readonly merchantId: string;
  private readonly merchantName: string;
  private readonly managerEmail: string;
  private readonly applicationRouteType: ApplicationRouteType;
  private readonly appliedAt: Date;
  private applicationStatus: ApplicationStatus;
  private cancelReason: string | null;
  private readonly appliedByAdmin: YesNo;

  // Aggregate components
  private readonly promotion: Promotion;
  private readonly promotionOrder: PromotionOrder;

  // Review and early termination
  private reviewDetail: ReviewDetail | null;
  private earlyEndInfo: EarlyEndInfo[];
  private earlyEndDate: Date | null;

  constructor(params: {
    applySeq: number;
    countryType: CountryType;
    merchantId: string;
    merchantName: string;
    managerEmail: string;
    applicationRouteType: ApplicationRouteType;
    appliedAt: Date;
    applicationStatus: ApplicationStatus;
    cancelReason?: string | null;
    appliedByAdmin: YesNo;
    promotion: Promotion;
    promotionOrder: PromotionOrder;
    reviewDetail?: ReviewDetail | null;
    earlyEndInfo?: EarlyEndInfo[];
    earlyEndDate?: Date | null;
  }) {
    this.applySeq = params.applySeq;
    this.countryType = params.countryType;
    this.merchantId = params.merchantId;
    this.merchantName = params.merchantName;
    this.managerEmail = params.managerEmail;
    this.applicationRouteType = params.applicationRouteType;
    this.appliedAt = params.appliedAt;
    this.applicationStatus = params.applicationStatus;
    this.cancelReason = params.cancelReason ?? null;
    this.appliedByAdmin = params.appliedByAdmin;
    this.promotion = params.promotion;
    this.promotionOrder = params.promotionOrder;
    this.reviewDetail = params.reviewDetail ?? null;
    this.earlyEndInfo = params.earlyEndInfo ?? [];
    this.earlyEndDate = params.earlyEndDate ?? null;
  }

  /**
   * Checks if the promotion is currently active based on current date
   */
  public isActive(currentDate: Date = new Date()): boolean {
    return (
      this.applicationStatus === "IN_SERVICE" &&
      currentDate >= this.promotion.getStartDate() &&
      currentDate <= this.promotion.getEndDate()
    );
  }

  /**
   * Checks if the application is currently in service
   */
  public isInService(): boolean {
    return this.applicationStatus === "IN_SERVICE";
  }

  /**
   * Checks if the application is still being processed
   */
  public isApplying(): boolean {
    return this.applicationStatus === "APPLYING";
  }

  /**
   * Checks if the application has been cancelled
   */
  public isCancelled(): boolean {
    return this.applicationStatus === "CANCELLED";
  }

  /**
   * Checks if the application has been completed
   */
  public isCompleted(): boolean {
    return this.applicationStatus === "COMPLETED";
  }

  /**
   * Checks if the application was applied by an admin
   */
  public isAppliedByAdmin(): boolean {
    return this.appliedByAdmin === "Y";
  }

  /**
   * Checks if the application has been reviewed
   */
  public hasReview(): boolean {
    return this.reviewDetail !== null;
  }

  /**
   * Checks if the promotion has an early end date
   */
  public hasEarlyEndDate(): boolean {
    return this.earlyEndDate !== null;
  }

  /**
   * Checks if there are early end requests
   */
  public hasEarlyEndRequests(): boolean {
    return this.earlyEndInfo.length > 0;
  }

  /**
   * Cancels the application with a reason
   */
  public cancel(reason: string): void {
    if (!reason || reason.trim().length === 0) {
      throw new Error("Cancel reason cannot be empty");
    }

    if (this.isCancelled()) {
      throw new Error("Application is already cancelled");
    }

    this.applicationStatus = "CANCELLED";
    this.cancelReason = reason;
  }

  /**
   * Marks the application as in service
   */
  public approve(): void {
    if (this.applicationStatus !== "APPLYING") {
      throw new Error("Can only approve applications with APPLYING status");
    }

    if (!this.promotionOrder.isPaymentCompleted()) {
      throw new Error("Cannot approve application without completed payment");
    }

    this.applicationStatus = "IN_SERVICE";
  }

  /**
   * Completes the application
   */
  public complete(): void {
    if (!this.isInService()) {
      throw new Error("Can only complete applications that are in service");
    }

    this.applicationStatus = "COMPLETED";
  }

  /**
   * Adds a review to the application
   */
  public addReview(review: ReviewDetail): void {
    this.reviewDetail = review;
  }

  /**
   * Requests early termination of the promotion
   */
  public requestEarlyEnd(earlyEndInfo: EarlyEndInfo, earlyEndDate: Date): void {
    if (!this.isInService()) {
      throw new Error("Can only request early end for applications in service");
    }

    if (earlyEndDate <= new Date()) {
      throw new Error("Early end date must be in the future");
    }

    this.earlyEndInfo.push(earlyEndInfo);
    this.earlyEndDate = earlyEndDate;
  }

  /**
   * Gets the number of days since application
   */
  public getDaysSinceApplication(currentDate: Date = new Date()): number {
    const diffTime = currentDate.getTime() - this.appliedAt.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Checks if the application and order information are consistent
   */
  public validateConsistency(): boolean {
    // Check that promotion type matches
    const promotionType = this.promotion.getPromotionType();
    const orderPromotionType =
      this.promotionOrder.getPaymentInfo().promotionType;

    if (promotionType !== orderPromotionType) {
      return false;
    }

    // Check that distribution type matches
    const distributionType = this.promotion.getDistributionType();
    const orderDistributionType =
      this.promotionOrder.getPaymentInfo().distributionType;

    if (distributionType !== orderDistributionType) {
      return false;
    }

    return true;
  }

  // Getters
  public getApplySeq(): number {
    return this.applySeq;
  }

  public getCountryType(): CountryType {
    return this.countryType;
  }

  public getMerchantId(): string {
    return this.merchantId;
  }

  public getMerchantName(): string {
    return this.merchantName;
  }

  public getManagerEmail(): string {
    return this.managerEmail;
  }

  public getApplicationRouteType(): ApplicationRouteType {
    return this.applicationRouteType;
  }

  public getAppliedAt(): Date {
    return new Date(this.appliedAt);
  }

  public getApplicationStatus(): ApplicationStatus {
    return this.applicationStatus;
  }

  public getCancelReason(): string | null {
    return this.cancelReason;
  }

  public getAppliedByAdmin(): YesNo {
    return this.appliedByAdmin;
  }

  public getPromotion(): Promotion {
    return this.promotion;
  }

  public getPromotionOrder(): PromotionOrder {
    return this.promotionOrder;
  }

  public getReviewDetail(): ReviewDetail | null {
    return this.reviewDetail ? { ...this.reviewDetail } : null;
  }

  public getEarlyEndInfo(): EarlyEndInfo[] {
    return [...this.earlyEndInfo];
  }

  public getEarlyEndDate(): Date | null {
    return this.earlyEndDate ? new Date(this.earlyEndDate) : null;
  }
}
