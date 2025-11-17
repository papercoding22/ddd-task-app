import { DistributionType, PromotionType, ProductType } from "../../types";
import { PromotionApplication } from "../PromotionApplication";
import { AIBudgetOptions } from "./AIBudgetOptions";
import { AIPromotionMetaData } from "./AIPromotionMetaData";

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

  // Metadata Insights
  private readonly metadata: AIPromotionMetaData;

  // Matched On-going Promotion Application Sequences
  private readonly matchedApplySeqs: number[];

  constructor(params: {
    id: string;
    promotionType: PromotionType;
    productType: ProductType;
    distributionType: DistributionType;
    budgetOptions: AIBudgetOptions;
    basePromotionApplication: PromotionApplication;
    metadata: AIPromotionMetaData;
    matchedApplySeqs: number[];
  }) {
    this.id = params.id;
    this.promotionType = params.promotionType;
    this.productType = params.productType;
    this.distributionType = params.distributionType;
    this.budgetOptions = params.budgetOptions;
    this.basePromotionApplication = params.basePromotionApplication;
    this.metadata = params.metadata;
    this.matchedApplySeqs = params.matchedApplySeqs;
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

  public getMetadata(): AIPromotionMetaData {
    return this.metadata;
  }

  public getMatchedApplySeqs(): number[] {
    return this.matchedApplySeqs;
  }

  // ----------------------- Domain Logic Methods ---------------------- //
  public isPresetForPointCouponPromotion(): boolean {
    return this.promotionType === "POINT_COUPON";
  }

  public isPresetForRewardCouponPromotion(): boolean {
    return (
      this.isPresetForPointCouponPromotion() &&
      this.distributionType === "REWARD"
    );
  }

  public isPresetForDownloadableCouponPromotion(): boolean {
    return (
      this.isPresetForPointCouponPromotion() &&
      this.distributionType === "DOWNLOAD"
    );
  }

  public isPresetForPointPromotion(): boolean {
    return this.promotionType === "POINT_PROMOTION";
  }

  public hasMatchedApplySeqs(): boolean {
    return this.matchedApplySeqs && this.matchedApplySeqs.length > 0;
  }
}