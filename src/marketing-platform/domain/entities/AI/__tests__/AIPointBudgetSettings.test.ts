import { describe, it, expect } from "vitest";
import { AIPointBudgetSettings } from "../AIPointBudgetSettings";
import { DistributionType } from "../../types";

describe("AIPointBudgetSettings", () => {
  const defaultParams = {
    distributionType: "ONLINE" as DistributionType,
    promotionBudget: 1000,
    promotionSavingRate: 0.1,
    promotionSavingPoint: 100,
  };

  it("should create an instance with provided parameters", () => {
    const settings = new AIPointBudgetSettings(defaultParams);

    expect(settings).toBeInstanceOf(AIPointBudgetSettings);
    expect(settings.getDistributionType()).toBe(defaultParams.distributionType);
    expect(settings.getPromotionBudget()).toBe(defaultParams.promotionBudget);
    expect(settings.getPromotionSavingRate()).toBe(defaultParams.promotionSavingRate);
    expect(settings.getPromotionSavingPoint()).toBe(defaultParams.promotionSavingPoint);
  });

  it("should return correct values via getters", () => {
    const settings = new AIPointBudgetSettings({
      distributionType: "OFFLINE",
      promotionBudget: 500,
      promotionSavingRate: null,
      promotionSavingPoint: null,
    });

    expect(settings.getDistributionType()).toBe("OFFLINE");
    expect(settings.getPromotionBudget()).toBe(500);
    expect(settings.getPromotionSavingRate()).toBeNull();
    expect(settings.getPromotionSavingPoint()).toBeNull();
  });
});
