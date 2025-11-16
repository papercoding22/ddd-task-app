import { describe, it, expect } from "vitest";
import { AICouponBudgetSettings } from "../AICouponBudgetSettings";
import { YesNo } from "../../../types";

describe("AICouponBudgetSettings", () => {
  const defaultParams = {
    purchasedCouponQuantity: 100,
    couponDiscountPrice: 10,
    fullPaymentYn: "Y" as YesNo,
    minimumPaymentPrice: 50,
  };

  it("should create an instance with provided parameters", () => {
    const settings = new AICouponBudgetSettings(defaultParams);

    expect(settings).toBeInstanceOf(AICouponBudgetSettings);
    expect(settings.getPurchasedCouponQuantity()).toBe(defaultParams.purchasedCouponQuantity);
    expect(settings.getCouponDiscountPrice()).toBe(defaultParams.couponDiscountPrice);
    expect(settings.getFullPaymentYn()).toBe(defaultParams.fullPaymentYn);
    expect(settings.getMinimumPaymentPrice()).toBe(defaultParams.minimumPaymentPrice);
  });

  it("should return correct values via getters", () => {
    const settings = new AICouponBudgetSettings({
      purchasedCouponQuantity: 200,
      couponDiscountPrice: 20,
      fullPaymentYn: "N",
      minimumPaymentPrice: 0,
    });

    expect(settings.getPurchasedCouponQuantity()).toBe(200);
    expect(settings.getCouponDiscountPrice()).toBe(20);
    expect(settings.getFullPaymentYn()).toBe("N");
    expect(settings.getMinimumPaymentPrice()).toBe(0);
  });
});
