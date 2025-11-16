import { DistributionType, PromotionType, ProductType } from "../../types";
import { PromotionApplication } from "../PromotionApplication";
import { AIBudgetOptions } from "./AIBudgetOptions";

/**
 * AI Promotion Preset Entity
 * Contains preset configurations for AI-generated promotions
 */
export class AIPromotionPreset {
  private readonly id: string;
  // It should tell what type of promotion it is
  private readonly promotionType: PromotionType;
  private readonly productType: ProductType;
  private readonly distributionType: DistributionType;

  // Budget Options
  private readonly budgetOptions: AIBudgetOptions;

  // Base PromotionApplication
  private readonly basePromotionApplication: PromotionApplication;

  constructor(params: {
    id: string;
    promotionType: PromotionType;
    productType: ProductType;
    distributionType: DistributionType;
    budgetOptions: AIBudgetOptions;
    basePromotionApplication: PromotionApplication;
  }) {
    this.id = params.id;
    this.promotionType = params.promotionType;
    this.productType = params.productType;
    this.distributionType = params.distributionType;
    this.budgetOptions = params.budgetOptions;
    this.basePromotionApplication = params.basePromotionApplication;
  }

  public getId(): string {
    return this.id;
  }

  public getPromotionType(): PromotionType {
    return this.promotionType;
  }

  public getProductType(): ProductType {
    return this.productType;
  }

  public getDistributionType(): DistributionType {
    return this.distributionType;
  }

  public getBudgetOptions(): AIBudgetOptions {
    return this.budgetOptions;
  }

  public getBasePromotionApplication(): PromotionApplication {
    return this.basePromotionApplication;
  }

  // ----------------------- Domain Logic Methods ---------------------- //
  public isPresetForCouponPromotion(): boolean {
    return this.promotionType === "POINT_COUPON";
  }

  public isPresetForRewardCouponPromotion(): boolean {
    return (
      this.promotionType === "POINT_COUPON" &&
      this.distributionType === "REWARD"
    );
  }

  public isPresetForDownloadableCouponPromotion(): boolean {
    return (
      this.promotionType === "POINT_COUPON" &&
      this.distributionType === "DOWNLOAD"
    );
  }

  public isPresetForPointPromotion(): boolean {
    return this.promotionType === "POINT_PROMOTION";
  }
}
