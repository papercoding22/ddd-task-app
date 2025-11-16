import { describe, it, expect } from "vitest";
import { AIRewardCouponBudgetSettings } from "../AIRewardCouponBudgetSettings";
import { YesNo } from "../../types";

describe("AIRewardCouponBudgetSettings", () => {
  const defaultParams = {
    purchasedCouponQuantity: 100,
    couponDiscountPrice: 10,
    fullPaymentYn: "Y" as YesNo,
    minimumPaymentPrice: 50,
    couponGrantYn: "Y" as YesNo,
    couponGrantMinPrice: 100,
  };

  it("should create an instance with provided parameters", () => {
    const settings = new AIRewardCouponBudgetSettings(defaultParams);

    expect(settings).toBeInstanceOf(AIRewardCouponBudgetSettings);
    expect(settings.getPurchasedCouponQuantity()).toBe(defaultParams.purchasedCouponQuantity);
    expect(settings.getCouponDiscountPrice()).toBe(defaultParams.couponDiscountPrice);
    expect(settings.getFullPaymentYn()).toBe(defaultParams.fullPaymentYn);
    expect(settings.getMinimumPaymentPrice()).toBe(defaultParams.minimumPaymentPrice);
    expect(settings.getCouponGrantYn()).toBe(defaultParams.couponGrantYn);
    expect(settings.getCouponGrantMinPrice()).toBe(defaultParams.couponGrantMinPrice);
  });

  it("should return correct values via getters", () => {
    const settings = new AIRewardCouponBudgetSettings({
      purchasedCouponQuantity: 200,
      couponDiscountPrice: 20,
      fullPaymentYn: "N",
      minimumPaymentPrice: 0,
      couponGrantYn: "N",
      couponGrantMinPrice: null,
    });

    expect(settings.getPurchasedCouponQuantity()).toBe(200);
    expect(settings.getCouponDiscountPrice()).toBe(20);
    expect(settings.getFullPaymentYn()).toBe("N");
    expect(settings.getMinimumPaymentPrice()).toBe(0);
    expect(settings.getCouponGrantYn()).toBe("N");
    expect(settings.getCouponGrantMinPrice()).toBeNull();
  });
});
