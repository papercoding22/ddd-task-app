import { ContentTemplate } from "../../types";

/**
 * AIPromotionMetaData Value Object
 * Contains metadata insights for AI-generated promotions
 */
export class AIPromotionMetaData {
  private readonly promotionGeneralInsight: ContentTemplate;
  private readonly lowBudgetInsight: ContentTemplate;
  private readonly midBudgetInsight: ContentTemplate;
  private readonly highBudgetInsight: ContentTemplate;

  constructor(params: {
    promotionGeneralInsight: ContentTemplate;
    lowBudgetInsight: ContentTemplate;
    midBudgetInsight: ContentTemplate;
    highBudgetInsight: ContentTemplate;
  }) {
    this.promotionGeneralInsight = params.promotionGeneralInsight;
    this.lowBudgetInsight = params.lowBudgetInsight;
    this.midBudgetInsight = params.midBudgetInsight;
    this.highBudgetInsight = params.highBudgetInsight;
  }

  public getPromotionGeneralInsight(): ContentTemplate {
    return this.promotionGeneralInsight;
  }

  public getLowBudgetInsight(): ContentTemplate {
    return this.lowBudgetInsight;
  }

  public getMidBudgetInsight(): ContentTemplate {
    return this.midBudgetInsight;
  }

  public getHighBudgetInsight(): ContentTemplate {
    return this.highBudgetInsight;
  }
}
