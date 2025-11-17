import { describe, it, expect } from "vitest";
import { AIPromotionPreset } from "../AIPromotionPreset";
import { AIBudgetOptions } from "../AIBudgetOptions";
import { AICouponBudgetSettings } from "../AICouponBudgetSettings";
import { PromotionApplication } from "../../PromotionApplication";
import { AIPromotionMetaData } from "../AIPromotionMetaData"; // Import AIPromotionMetaData
import {
  PromotionType,
  ProductType,
  DistributionType,
  YesNo,
  PromotionStatus,
  FlexibleDaysType,
  ContentTemplate,
} from "../../types";

describe("AIPromotionPreset", () => {
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

  const mockBudgetOptions = new AIBudgetOptions({
    lowBudget: mockLowBudget,
    midBudget: mockMidBudget,
    highBudget: mockHighBudget,
    recommendedOption: "mid",
    currency: "TWD",
  });

  const mockBasePromotionApplication = new PromotionApplication({
    id: "app-1",
    promotionId: "promo-1",
    promotionType: "POINT_PROMOTION" as PromotionType,
    promotionName: "Test Promotion",
    promotionStatus: "ACTIVE" as PromotionStatus,
    budget: 1000,
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-12-31"),
    productType: "ALL" as ProductType,
    distributionType: "ONLINE" as DistributionType,
    image: {
      imageType: "SQUARE",
      imageObsId: "obs-1",
      imageObsHash: "hash-1",
      imageUrl: "http://example.com/image.png",
    },
    couponDiscountPrice: 50,
    purchasedCouponQuantity: 100,
    usedCouponQuantity: 20,
    remainingCouponQuantity: 80,
    fullPaymentYn: "Y" as YesNo,
    fullPaymentMinPrice: 100,
    validityPeriodType: "FLEXIBLE_DAYS" as FlexibleDaysType,
    validityPeriodDays: 30,
    receivedCouponQuantity: 10,
    couponName: "Test Coupon",
    couponIssuanceQuantity: 100,
    minimumPaymentPrice: 50,
    downloadableCouponQuantity: 50,
    downloadedCouponQuantity: 10,
    generalQuantityPerDay: 5,
    downloadableMultiply: 1,
    minDownloadableQuantity: 1,
    multipleIssuedYn: "Y" as YesNo,
  });

  const mockMetaData = new AIPromotionMetaData({
    promotionGeneralInsight: { title: "General Insight", description: "General description" },
    lowBudgetInsight: { title: "Low Insight", description: "Low description" },
    midBudgetInsight: { title: "Mid Insight", description: "Mid description" },
    highBudgetInsight: { title: "High Insight", description: "High description" },
  });

  const defaultParams = {
    id: "preset-1",
    promotionType: "POINT_PROMOTION" as PromotionType,
    productType: "ALL" as ProductType,
    distributionType: "ONLINE" as DistributionType,
    budgetOptions: mockBudgetOptions,
    basePromotionApplication: mockBasePromotionApplication,
    metadata: mockMetaData,
    matchedApplySeqs: [1, 2, 3],
  };

  it("should create an instance with provided parameters", () => {
    const preset = new AIPromotionPreset(defaultParams);

    expect(preset).toBeInstanceOf(AIPromotionPreset);
    expect(preset.getId()).toBe(defaultParams.id);
    expect(preset.getPromotionType()).toBe(defaultParams.promotionType);
    expect(preset.getProductType()).toBe(defaultParams.productType);
    expect(preset.getDistributionType()).toBe(defaultParams.distributionType);
    expect(preset.getBudgetOptions()).toBe(defaultParams.budgetOptions);
    expect(preset.getBasePromotionApplication()).toBe(defaultParams.basePromotionApplication);
    expect(preset.getMetadata()).toBe(defaultParams.metadata);
    expect(preset.getMatchedApplySeqs()).toEqual(defaultParams.matchedApplySeqs);
  });

  it("should return correct values via getters", () => {
    const preset = new AIPromotionPreset({
      id: "preset-2",
      promotionType: "REWARD_COUPON",
      productType: "FOOD",
      distributionType: "OFFLINE",
      budgetOptions: mockBudgetOptions,
      basePromotionApplication: mockBasePromotionApplication,
      metadata: mockMetaData,
      matchedApplySeqs: [4, 5],
    });

    expect(preset.getId()).toBe("preset-2");
    expect(preset.getPromotionType()).toBe("REWARD_COUPON");
    expect(preset.getProductType()).toBe("FOOD");
    expect(preset.getDistributionType()).toBe("OFFLINE");
    expect(preset.getBudgetOptions()).toBe(mockBudgetOptions);
    expect(preset.getBasePromotionApplication()).toBe(mockBasePromotionApplication);
    expect(preset.getMetadata()).toBe(mockMetaData);
    expect(preset.getMatchedApplySeqs()).toEqual([4, 5]);
  });

  it("getMetadata should return the correct metadata", () => {
    const preset = new AIPromotionPreset(defaultParams);
    expect(preset.getMetadata()).toBe(mockMetaData);
  });

  it("hasMatchedApplySeqs should return true if matchedApplySeqs is not empty", () => {
    const preset = new AIPromotionPreset(defaultParams);
    expect(preset.hasMatchedApplySeqs()).toBe(true);
  });

  it("hasMatchedApplySeqs should return false if matchedApplySeqs is empty", () => {
    const preset = new AIPromotionPreset({ ...defaultParams, matchedApplySeqs: [] });
    expect(preset.hasMatchedApplySeqs()).toBe(false);
  });

  it("getMatchedApplySeqs should return the correct array of matched apply sequences", () => {
    const preset = new AIPromotionPreset(defaultParams);
    expect(preset.getMatchedApplySeqs()).toEqual([1, 2, 3]);
  });

  describe("Domain Logic Methods", () => {
    it("isPresetForPointCouponPromotion should return true for POINT_COUPON", () => {
      const preset = new AIPromotionPreset({ ...defaultParams, promotionType: "POINT_COUPON" });
      expect(preset.isPresetForPointCouponPromotion()).toBe(true);
    });

    it("isPresetForPointCouponPromotion should return false for other promotion types", () => {
      const preset = new AIPromotionPreset({ ...defaultParams, promotionType: "POINT_PROMOTION" });
      expect(preset.isPresetForPointCouponPromotion()).toBe(false);
    });

    it("isPresetForRewardCouponPromotion should return true for POINT_COUPON with REWARD distribution", () => {
      const preset = new AIPromotionPreset({ ...defaultParams, promotionType: "POINT_COUPON", distributionType: "REWARD" });
      expect(preset.isPresetForRewardCouponPromotion()).toBe(true);
    });

    it("isPresetForRewardCouponPromotion should return false for other combinations", () => {
      let preset = new AIPromotionPreset({ ...defaultParams, promotionType: "POINT_PROMOTION", distributionType: "REWARD" });
      expect(preset.isPresetForRewardCouponPromotion()).toBe(false);
      preset = new AIPromotionPreset({ ...defaultParams, promotionType: "POINT_COUPON", distributionType: "DOWNLOAD" });
      expect(preset.isPresetForRewardCouponPromotion()).toBe(false);
    });

    it("isPresetForDownloadableCouponPromotion should return true for POINT_COUPON with DOWNLOAD distribution", () => {
      const preset = new AIPromotionPreset({ ...defaultParams, promotionType: "POINT_COUPON", distributionType: "DOWNLOAD" });
      expect(preset.isPresetForDownloadableCouponPromotion()).toBe(true);
    });

    it("isPresetForDownloadableCouponPromotion should return false for other combinations", () => {
      let preset = new AIPromotionPreset({ ...defaultParams, promotionType: "POINT_PROMOTION", distributionType: "DOWNLOAD" });
      expect(preset.isPresetForDownloadableCouponPromotion()).toBe(false);
      preset = new AIPromotionPreset({ ...defaultParams, promotionType: "POINT_COUPON", distributionType: "REWARD" });
      expect(preset.isPresetForDownloadableCouponPromotion()).toBe(false);
    });

    it("isPresetForPointPromotion should return true for POINT_PROMOTION", () => {
      const preset = new AIPromotionPreset({ ...defaultParams, promotionType: "POINT_PROMOTION" });
      expect(preset.isPresetForPointPromotion()).toBe(true);
    });

    it("isPresetForPointPromotion should return false for other promotion types", () => {
      const preset = new AIPromotionPreset({ ...defaultParams, promotionType: "POINT_COUPON" });
      expect(preset.isPresetForPointPromotion()).toBe(false);
    });
  });
});
