import { describe, it, expect } from "vitest";
import { AIBudgetOptions } from "../AIBudgetOptions";
import { AICouponBudgetSettings } from "../AICouponBudgetSettings";
import { YesNo } from "../../types";

describe("AIBudgetOptions", () => {
  const mockLowBudget = new AICouponBudgetSettings({
    purchasedCouponQuantity: 100,
    couponDiscountPrice: 10,
    fullPaymentYn: "Y" as YesNo,
    minimumPaymentPrice: 50,
  });

  const mockMidBudget = new AICouponBudgetSettings({
    purchasedCouponQuantity: 200,
    couponDiscountPrice: 20,
    fullPaymentYn: "N" as YesNo,
    minimumPaymentPrice: 0,
  });

  const mockHighBudget = new AICouponBudgetSettings({
    purchasedCouponQuantity: 300,
    couponDiscountPrice: 30,
    fullPaymentYn: "Y" as YesNo,
    minimumPaymentPrice: 100,
  });

  it("should create an instance with provided parameters and default currency", () => {
    const options = new AIBudgetOptions({
      lowBudget: mockLowBudget,
      midBudget: mockMidBudget,
      highBudget: mockHighBudget,
      recommendedOption: "mid",
    });

    expect(options).toBeInstanceOf(AIBudgetOptions);
    expect(options.getCurrency()).toBe("TWD"); // Default currency
    expect(options.getLowBudget()).toBe(mockLowBudget);
    expect(options.getMidBudget()).toBe(mockMidBudget);
    expect(options.getHighBudget()).toBe(mockHighBudget);
    expect(options.getRecommendedOption()).toBe("mid");
  });

  it("should create an instance with provided parameters and specified currency", () => {
    const options = new AIBudgetOptions({
      lowBudget: mockLowBudget,
      midBudget: mockMidBudget,
      highBudget: mockHighBudget,
      recommendedOption: "high",
      currency: "USD",
    });

    expect(options.getCurrency()).toBe("USD");
    expect(options.getRecommendedOption()).toBe("high");
  });

  it("should return correct values via getters", () => {
    const options = new AIBudgetOptions({
      lowBudget: mockLowBudget,
      midBudget: mockMidBudget,
      highBudget: mockHighBudget,
      recommendedOption: "low",
      currency: "JPY",
    });

    expect(options.getCurrency()).toBe("JPY");
    expect(options.getLowBudget()).toBe(mockLowBudget);
    expect(options.getMidBudget()).toBe(mockMidBudget);
    expect(options.getHighBudget()).toBe(mockHighBudget);
    expect(options.getRecommendedOption()).toBe("low");
  });
});
