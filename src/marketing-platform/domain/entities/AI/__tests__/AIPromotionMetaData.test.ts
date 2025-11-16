import { describe, it, expect } from "vitest";
import { AIPromotionMetaData } from "../AIPromotionMetaData";
import { ContentTemplate } from "../../types";

describe("AIPromotionMetaData", () => {
  const mockContentTemplate1: ContentTemplate = {
    title: "General Insight",
    description: "This is a general insight.",
  };

  const mockContentTemplate2: ContentTemplate = {
    title: "Low Budget Insight",
    description: "Insight for low budget.",
  };

  const mockContentTemplate3: ContentTemplate = {
    title: "Mid Budget Insight",
    description: "Insight for mid budget.",
  };

  const mockContentTemplate4: ContentTemplate = {
    title: "High Budget Insight",
    description: "Insight for high budget.",
  };

  const defaultParams = {
    promotionGeneralInsight: mockContentTemplate1,
    lowBudgetInsight: mockContentTemplate2,
    midBudgetInsight: mockContentTemplate3,
    highBudgetInsight: mockContentTemplate4,
  };

  it("should create an instance with provided parameters", () => {
    const metaData = new AIPromotionMetaData(defaultParams);

    expect(metaData).toBeInstanceOf(AIPromotionMetaData);
    expect(metaData.getPromotionGeneralInsight()).toBe(defaultParams.promotionGeneralInsight);
    expect(metaData.getLowBudgetInsight()).toBe(defaultParams.lowBudgetInsight);
    expect(metaData.getMidBudgetInsight()).toBe(defaultParams.midBudgetInsight);
    expect(metaData.getHighBudgetInsight()).toBe(defaultParams.highBudgetInsight);
  });

  it("should return correct values via getters", () => {
    const metaData = new AIPromotionMetaData({
      promotionGeneralInsight: { title: "New General", description: "New description" },
      lowBudgetInsight: { title: "New Low", description: "New low description" },
      midBudgetInsight: { title: "New Mid", description: "New mid description" },
      highBudgetInsight: { title: "New High", description: "New high description" },
    });

    expect(metaData.getPromotionGeneralInsight().title).toBe("New General");
    expect(metaData.getLowBudgetInsight().description).toBe("New low description");
    expect(metaData.getMidBudgetInsight().title).toBe("New Mid");
    expect(metaData.getHighBudgetInsight().description).toBe("New high description");
  });
});
