import { CurrencyType } from "../../types";
import { AIBudgetSettings } from "./AIBudgetSettings";
import { AICouponBudgetSettings } from "./AICouponBudgetSettings";

/**
 * A.I Recommended Budget Options Value Object
 * Contains different budget settings for AI recommended promotions
 * Includes low, mid, and high budget configurations
 */
export class AIBudgetOptions {
  private readonly currency: CurrencyType;
  private readonly lowBudget: AIBudgetSettings;
  private readonly midBudget: AIBudgetSettings;
  private readonly highBudget: AIBudgetSettings;
  private readonly recommendedOption: "low" | "mid" | "high";

  constructor(params: {
    lowBudget: AICouponBudgetSettings;
    midBudget: AICouponBudgetSettings;
    highBudget: AICouponBudgetSettings;
    recommendedOption: "low" | "mid" | "high";
    currency?: CurrencyType;
  }) {
    this.currency = params.currency ?? "TWD";
    this.lowBudget = params.lowBudget;
    this.midBudget = params.midBudget;
    this.highBudget = params.highBudget;
    this.recommendedOption = params.recommendedOption;
  }

  public getCurrency(): CurrencyType {
    return this.currency;
  }

  public getLowBudget(): AICouponBudgetSettings {
    return this.lowBudget;
  }

  public getMidBudget(): AICouponBudgetSettings {
    return this.midBudget;
  }

  public getHighBudget(): AICouponBudgetSettings {
    return this.highBudget;
  }

  public getRecommendedOption(): "low" | "mid" | "high" {
    return this.recommendedOption;
  }
}
