import { AIBudgetSettings } from "./AIBudgetSettings";
import { DistributionType } from "../../types";

/**
 * AI Point Budget Settings Value Object
 * Used specifically for Point-based Promotions
 */
export class AIPointBudgetSettings extends AIBudgetSettings {
  private readonly promotionBudget: number;
  private readonly promotionSavingRate: number | null;
  private readonly promotionSavingPoint: number | null;

  constructor(params: {
    distributionType: DistributionType;
    promotionBudget: number;
    promotionSavingRate: number | null;
    promotionSavingPoint: number | null;
  }) {
    super({ distributionType: params.distributionType });
    this.promotionBudget = params.promotionBudget;
    this.promotionSavingRate = params.promotionSavingRate;
    this.promotionSavingPoint = params.promotionSavingPoint;
  }

  public getPromotionBudget(): number {
    return this.promotionBudget;
  }

  public getPromotionSavingRate(): number | null {
    return this.promotionSavingRate;
  }

  public getPromotionSavingPoint(): number | null {
    return this.promotionSavingPoint;
  }
}
