import { Promotion } from "./Promotion";
import {
  PromotionType,
  DistributionType,
  ProductType,
  ImageType,
  ExhaustionAlarmPercentages,
  YesNo,
  PromotionSavingType,
  ClientLimitType,
} from "../types";
import {
  InvalidPercentageException,
  InsufficientBudgetException,
  MinimumPaymentNotMetException,
  InvalidPointCalculationException,
} from "../exceptions/PromotionExceptions";

/**
 * Point Promotion entity
 * Handles percentage-based point rewards for purchases
 */
export class PointPromotion extends Promotion {
  private promotionName: string;
  private promotionBudget: number;
  private promotionSavingType: PromotionSavingType;
  private promotionSavingRate: number | null;
  private promotionSavingPoint: number | null;
  private minimumPaymentPriceYn: YesNo;
  private minimumPaymentPrice: number;
  private maximumSavingPoint: number;
  private clientLimitType: ClientLimitType;
  private clientLimitTerm: number | null;
  private clientLimitCount: number | null;
  private clientLimitPoint: number | null;
  private usedPoint: number;
  private usedPointPercentage: number;
  private remainingPoint: number;
  private remainingPointPercentage: number;

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
    // Point Promotion specific
    promotionName: string;
    promotionBudget: number;
    promotionSavingType: PromotionSavingType;
    promotionSavingRate: number | null;
    promotionSavingPoint: number | null;
    minimumPaymentPriceYn: YesNo;
    minimumPaymentPrice: number;
    maximumSavingPoint: number;
    clientLimitType: ClientLimitType;
    clientLimitTerm: number | null;
    clientLimitCount: number | null;
    clientLimitPoint: number | null;
    usedPoint?: number;
    usedPointPercentage?: number;
    remainingPoint?: number;
    remainingPointPercentage?: number;
  }) {
    super(params);

    this.validateSavingRate(
      params.promotionSavingRate,
      params.promotionSavingType
    );
    this.validateBudget(params.promotionBudget);

    this.promotionName = params.promotionName;
    this.promotionBudget = params.promotionBudget;
    this.promotionSavingType = params.promotionSavingType;
    this.promotionSavingRate = params.promotionSavingRate;
    this.promotionSavingPoint = params.promotionSavingPoint;
    this.minimumPaymentPriceYn = params.minimumPaymentPriceYn;
    this.minimumPaymentPrice = params.minimumPaymentPrice;
    this.maximumSavingPoint = params.maximumSavingPoint;
    this.clientLimitType = params.clientLimitType;
    this.clientLimitTerm = params.clientLimitTerm;
    this.clientLimitCount = params.clientLimitCount;
    this.clientLimitPoint = params.clientLimitPoint;
    this.usedPoint = params.usedPoint ?? 0;
    this.usedPointPercentage = params.usedPointPercentage ?? 0;
    this.remainingPoint = params.remainingPoint ?? params.promotionBudget;
    this.remainingPointPercentage =
      params.remainingPointPercentage ?? this.calculateRemainingPercentage();
  }

  /**
   * Validates the saving rate for fixed rate promotions
   */
  private validateSavingRate(
    rate: number | null,
    type: PromotionSavingType
  ): void {
    if (type === "FIXED_RATE" && rate !== null) {
      if (rate < 0 || rate > 100) {
        throw new InvalidPercentageException(rate);
      }
    }
  }

  /**
   * Validates the promotion budget
   */
  private validateBudget(budget: number): void {
    if (budget <= 0) {
      throw new InvalidPointCalculationException(
        "Promotion budget must be positive"
      );
    }
  }

  /**
   * Calculates remaining point percentage
   */
  private calculateRemainingPercentage(): number {
    if (this.promotionBudget === 0) {
      return 0;
    }
    return (this.remainingPoint / this.promotionBudget) * 100;
  }

  /**
   * Checks if there are sufficient points remaining
   */
  public hasSufficientPoints(requiredPoints: number): boolean {
    return this.remainingPoint >= requiredPoints;
  }

  /**
   * Checks if the payment amount meets the minimum requirement
   */
  public meetsMinimumPayment(paymentAmount: number): boolean {
    if (this.minimumPaymentPriceYn === "Y") {
      return paymentAmount >= this.minimumPaymentPrice;
    }
    return true;
  }

  /**
   * Calculates point reward based on payment amount
   */
  public calculatePointReward(paymentAmount: number): number {
    if (!this.meetsMinimumPayment(paymentAmount)) {
      return 0;
    }

    let calculatedPoints = 0;

    if (
      this.promotionSavingType === "FIXED_RATE" &&
      this.promotionSavingRate !== null
    ) {
      calculatedPoints = (paymentAmount * this.promotionSavingRate) / 100;
    } else if (
      this.promotionSavingType === "FIXED_POINT" &&
      this.promotionSavingPoint !== null
    ) {
      calculatedPoints = this.promotionSavingPoint;
    }

    // Apply maximum saving point cap
    calculatedPoints = Math.min(calculatedPoints, this.maximumSavingPoint);

    // Ensure we don't exceed remaining budget
    calculatedPoints = Math.min(calculatedPoints, this.remainingPoint);

    return calculatedPoints;
  }

  /**
   * Applies the point reward for a payment
   */
  public applyPointReward(paymentAmount: number): number {
    this.ensureActive();

    if (!this.meetsMinimumPayment(paymentAmount)) {
      throw new MinimumPaymentNotMetException(
        this.minimumPaymentPrice,
        paymentAmount
      );
    }

    const pointReward = this.calculatePointReward(paymentAmount);

    if (pointReward === 0) {
      throw new InsufficientBudgetException("No points available for reward");
    }

    if (!this.hasSufficientPoints(pointReward)) {
      throw new InsufficientBudgetException(
        `Insufficient points. Required: ${pointReward}, Available: ${this.remainingPoint}`
      );
    }

    // Update point tracking
    this.usedPoint += pointReward;
    this.remainingPoint -= pointReward;
    this.usedPointPercentage = (this.usedPoint / this.promotionBudget) * 100;
    this.remainingPointPercentage = this.calculateRemainingPercentage();

    return pointReward;
  }

  /**
   * Calculates the usage percentage of the promotion budget
   */
  public calculateUsagePercentage(): number {
    return this.usedPointPercentage;
  }

  /**
   * Checks if the promotion can be applied to a payment
   */
  public canApply(
    paymentAmount: number,
    currentDate: Date = new Date()
  ): boolean {
    const pointReward = this.calculatePointReward(paymentAmount);
    return (
      this.isWithinValidPeriod(currentDate) &&
      this.meetsMinimumPayment(paymentAmount) &&
      pointReward > 0 &&
      this.hasSufficientPoints(pointReward)
    );
  }

  /**
   * Checks if client limit allows another use
   * Note: This is a simplified version. In production, you'd need to track per-user usage
   */
  public canUserApply(userUsageCount: number, userUsedPoints: number): boolean {
    if (this.clientLimitType === "NONE") {
      return true;
    }

    if (
      this.clientLimitCount !== null &&
      userUsageCount >= this.clientLimitCount
    ) {
      return false;
    }

    if (
      this.clientLimitPoint !== null &&
      userUsedPoints >= this.clientLimitPoint
    ) {
      return false;
    }

    return true;
  }

  // Getters
  public getPromotionName(): string {
    return this.promotionName;
  }

  public getPromotionBudget(): number {
    return this.promotionBudget;
  }

  public getPromotionSavingType(): PromotionSavingType {
    return this.promotionSavingType;
  }

  public getPromotionSavingRate(): number | null {
    return this.promotionSavingRate;
  }

  public getMinimumPaymentPrice(): number {
    return this.minimumPaymentPrice;
  }

  public getMaximumSavingPoint(): number {
    return this.maximumSavingPoint;
  }

  public getUsedPoint(): number {
    return this.usedPoint;
  }

  public getRemainingPoint(): number {
    return this.remainingPoint;
  }

  public getUsedPointPercentage(): number {
    return this.usedPointPercentage;
  }

  public getRemainingPointPercentage(): number {
    return this.remainingPointPercentage;
  }
}
