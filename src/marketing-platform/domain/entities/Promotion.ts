import {
  PromotionType,
  DistributionType,
  ProductType,
  ImageType,
  ExhaustionAlarmPercentages,
  YesNo,
  ExposureProduct,
} from "../types";
import { InvalidPromotionDateException } from "../exceptions/PromotionExceptions";

const MAX_TITLE_LENGTH = 300;

/**
 * Abstract base class for all promotions
 * Contains common properties and behaviors shared across all promotion types
 */
export abstract class Promotion {
  protected readonly id: string;
  protected title: string;
  protected startDate: Date;
  protected endDate: Date;
  protected readonly promotionType: PromotionType;
  protected readonly distributionType: DistributionType;
  protected readonly productType: ProductType;

  // Image management
  protected imageType: ImageType;
  protected imageObsId: string;
  protected imageObsHash: string;
  protected imageUrl: string;

  // Exhaustion alarm settings
  protected exhaustionAlarmYn: YesNo;
  protected exhaustionAlarmPercentageList: ExhaustionAlarmPercentages[];

  // Exposure products for marketing campaigns
  protected exposureProductList: ExposureProduct[];

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
    exposureProductList?: ExposureProduct[];
  }) {
    this.validateDates(params.startDate, params.endDate);

    this.id = params.id;
    this.title = params.title;
    this.startDate = params.startDate;
    this.endDate = params.endDate;
    this.promotionType = params.promotionType;
    this.distributionType = params.distributionType;
    this.productType = params.productType;
    this.imageType = params.imageType;
    this.imageObsId = params.imageObsId;
    this.imageObsHash = params.imageObsHash;
    this.imageUrl = params.imageUrl;
    this.exhaustionAlarmYn = params.exhaustionAlarmYn;
    this.exhaustionAlarmPercentageList = params.exhaustionAlarmPercentageList;
    this.exposureProductList = params.exposureProductList ?? [];
  }

  /**
   * Validates that start date is before end date
   */
  protected validateDates(startDate: Date, endDate: Date): void {
    if (startDate >= endDate) {
      throw new InvalidPromotionDateException(
        `Start date (${startDate.toISOString()}) must be before end date (${endDate.toISOString()})`
      );
    }
  }

  /**
   * Checks if the promotion is within its valid date range
   */
  public isWithinValidPeriod(currentDate: Date = new Date()): boolean {
    return currentDate >= this.startDate && currentDate <= this.endDate;
  }

  /**
   * Checks if the promotion has started
   */
  public hasStarted(currentDate: Date = new Date()): boolean {
    return currentDate >= this.startDate;
  }

  /**
   * Checks if the promotion has ended
   */
  public hasEnded(currentDate: Date = new Date()): boolean {
    return currentDate > this.endDate;
  }

  /**
   * Ensures that the promotion is currently active
   * @throws Error if the promotion is not active
   */
  protected ensureActive(currentDate: Date = new Date()): void {
    if (!this.isWithinValidPeriod(currentDate)) {
      throw new Error(
        `Promotion is not active. Valid period: ${this.startDate.toISOString()} - ${this.endDate.toISOString()}`
      );
    }
  }

  /**
   * Updates the image information
   */
  public updateImage(
    imageType: ImageType,
    imageObsId: string,
    imageObsHash: string,
    imageUrl: string
  ): void {
    this.imageType = imageType;
    this.imageObsId = imageObsId;
    this.imageObsHash = imageObsHash;
    this.imageUrl = imageUrl;
  }

  /**
   * Updates the promotion title
   */
  public updateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error("Title cannot be empty");
    }
    if (title.length > MAX_TITLE_LENGTH) {
      throw new Error("Title cannot exceed 300 characters.");
    }
    this.title = title;
  }

  public getId(): string {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  /**
   * Entity equality is based on identity, not attributes
   * Two promotions are equal if they have the same id
   */
  public equals(other: Promotion | null | undefined): boolean {
    if (!other) return false;
    if (this === other) return true;
    return this.id === other.getId();
  }

  public getStartDate(): Date {
    return new Date(this.startDate);
  }

  public getEndDate(): Date {
    return new Date(this.endDate);
  }

  public getPromotionType(): PromotionType {
    return this.promotionType;
  }

  public getDistributionType(): DistributionType {
    return this.distributionType;
  }

  public getProductType(): ProductType {
    return this.productType;
  }

  public getImageType(): ImageType {
    return this.imageType;
  }

  public getImageUrl(): string {
    return this.imageUrl;
  }

  public getExhaustionAlarmYn(): YesNo {
    return this.exhaustionAlarmYn;
  }

  public getExhaustionAlarmPercentageList(): ExhaustionAlarmPercentages[] {
    return [...this.exhaustionAlarmPercentageList];
  }

  public getExposureProductList(): ExposureProduct[] {
    return [...this.exposureProductList];
  }

  /**
   * Gets active exposure products for the promotion
   */
  public getActiveExposureProducts(
    currentDate: Date = new Date()
  ): ExposureProduct[] {
    return this.exposureProductList.filter((product) => {
      const productStartDate = new Date(product.startDate);
      const productEndDate = new Date(product.endDate);
      return (
        product.exposureStatus === "ON" &&
        currentDate >= productStartDate &&
        currentDate <= productEndDate
      );
    });
  }

  /**
   * Checks if promotion has any active exposure products
   */
  public hasActiveExposureProducts(currentDate: Date = new Date()): boolean {
    return this.getActiveExposureProducts(currentDate).length > 0;
  }

  /**
   * Gets exposure products by type
   */
  public getExposureProductsByType(exposureType: string): ExposureProduct[] {
    return this.exposureProductList.filter(
      (product) => product.exposureType === exposureType
    );
  }

  /**
   * Abstract method to calculate usage percentage
   * Must be implemented by subclasses
   */
  public abstract calculateUsagePercentage(): number;

  public reschedulePromotion(newStartDate: Date, newEndDate: Date, today: Date = new Date()): void {
    // Business rule 1: newStartDate > today
    if (newStartDate <= today) {
      throw new InvalidPromotionDateException("New start date must be in the future.");
    }

    // Business rule 2: newEndDate is not over 365 days from today
    const maxEndDate = new Date(today);
    maxEndDate.setDate(maxEndDate.getDate() + 365);
    if (newEndDate > maxEndDate) {
      throw new InvalidPromotionDateException("New end date cannot be more than 365 days from today.");
    }

    // Also need to validate that newStartDate < newEndDate
    this.validateDates(newStartDate, newEndDate);

    this.startDate = newStartDate;
    this.endDate = newEndDate;
  }

}
