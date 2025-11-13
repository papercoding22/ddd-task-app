import { describe, it, expect, vi } from "vitest";
import { PointPromotion } from "../PointPromotion";
import {
  PromotionType,
  DistributionType,
  ProductType,
  ImageType,
  YesNo,
  PromotionSavingType,
  ClientLimitType,
} from "../../types";
import {
  InvalidPercentageException,
  InsufficientBudgetException,
  MinimumPaymentNotMetException,
  InvalidPointCalculationException,
} from "../../exceptions/PromotionExceptions";

// Mock Promotion parent class
vi.mock("../Promotion", () => {
  class MockPromotion {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    promotionType: PromotionType;
    distributionType: DistributionType;
    productType: ProductType;
    imageType: ImageType;
    imageObsId: string;
    imageObsHash: string;
    imageUrl: string;
    exhaustionAlarmYn: YesNo;
    exhaustionAlarmPercentageList: any[];

    constructor(params: any) {
      this.id = params.id;
      this.title = params.title;
      this.startDate = params.startDate;
      this.endDate = params.endDate;
      this.promotionType = params.promotionType;
      this.distributionType = params.distributionType;
      this.productType = params.productType;
      this.imageType = params.imageType;
      this.imageObsId = params.imageObsId;
      this.imageObsHash = params.imageObsHash;
      this.imageUrl = params.imageUrl;
      this.exhaustionAlarmYn = params.exhaustionAlarmYn;
      this.exhaustionAlarmPercentageList = params.exhaustionAlarmPercentageList;
    }

    getId = () => this.id;
    getTitle = () => this.title;
    getStartDate = () => this.startDate;
    getEndDate = () => this.endDate;
    getPromotionType = () => this.promotionType;
    getDistributionType = () => this.distributionType;
    getProductType = () => this.productType;
    getImageType = () => this.imageType;
    getImageObsId = () => this.imageObsId;
    getImageObsHash = () => this.imageObsHash;
    getImageUrl = () => this.imageUrl;
    getExhaustionAlarmYn = () => this.exhaustionAlarmYn;
    getExhaustionAlarmPercentageList = () => this.exhaustionAlarmPercentageList;
    isWithinValidPeriod = vi.fn((currentDate: Date) => currentDate >= this.startDate && currentDate <= this.endDate);
    ensureActive = vi.fn(() => true); // Mock ensureActive to always pass for now
  }
  return { Promotion: MockPromotion };
});

const defaultPointPromotionParams = {
  id: "point-promo-1",
  title: "Test Point Promotion",
  startDate: new Date("2023-01-01"),
  endDate: new Date("2023-12-31"),
  promotionType: "POINT_PROMOTION" as PromotionType,
  distributionType: "NA" as DistributionType,
  productType: "ALL" as ProductType,
  imageType: "SQUARE" as ImageType,
  imageObsId: "obs-3",
  imageObsHash: "hash-3",
  imageUrl: "http://example.com/image3.png",
  exhaustionAlarmYn: "N" as YesNo,
  exhaustionAlarmPercentageList: [],
  promotionName: "Spring Points",
  promotionBudget: 1000,
  promotionSavingType: "FIXED_RATE" as PromotionSavingType,
  promotionSavingRate: 10,
  promotionSavingPoint: null,
  minimumPaymentPriceYn: "Y" as YesNo,
  minimumPaymentPrice: 50,
  maximumSavingPoint: 200,
  clientLimitType: "NONE" as ClientLimitType,
  clientLimitTerm: null,
  clientLimitCount: null,
  clientLimitPoint: null,
  usedPoint: 0,
  usedPointPercentage: 0,
  remainingPoint: 1000,
  remainingPointPercentage: 100,
};

describe("PointPromotion", () => {
  describe("Constructor Validations", () => {
    it("should create a point promotion with valid parameters", () => {
      const promo = new PointPromotion(defaultPointPromotionParams);
      expect(promo).toBeInstanceOf(PointPromotion);
      expect(promo.getPromotionBudget()).toBe(1000);
    });

    it("should throw InvalidPercentageException for invalid saving rate (FIXED_RATE)", () => {
      expect(
        () => new PointPromotion({ ...defaultPointPromotionParams, promotionSavingRate: 101 })
      ).toThrow(InvalidPercentageException);
      expect(
        () => new PointPromotion({ ...defaultPointPromotionParams, promotionSavingRate: -1 })
      ).toThrow(InvalidPercentageException);
    });

    it("should not throw InvalidPercentageException for null saving rate (FIXED_RATE)", () => {
      expect(
        () => new PointPromotion({ ...defaultPointPromotionParams, promotionSavingRate: null })
      ).not.toThrow(InvalidPercentageException);
    });

    it("should throw InvalidPointCalculationException for non-positive budget", () => {
      expect(
        () => new PointPromotion({ ...defaultPointPromotionParams, promotionBudget: 0 })
      ).toThrow(InvalidPointCalculationException);
      expect(
        () => new PointPromotion({ ...defaultPointPromotionParams, promotionBudget: -10 })
      ).toThrow(InvalidPointCalculationException);
    });
  });

  describe("hasSufficientPoints", () => {
    it("should return true if remaining points are sufficient", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, remainingPoint: 100 });
      expect(promo.hasSufficientPoints(50)).toBe(true);
    });

    it("should return false if remaining points are insufficient", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, remainingPoint: 100 });
      expect(promo.hasSufficientPoints(150)).toBe(false);
    });
  });

  describe("meetsMinimumPayment", () => {
    it("should return true if minimumPaymentPriceYn is 'N'", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, minimumPaymentPriceYn: "N" });
      expect(promo.meetsMinimumPayment(10)).toBe(true);
    });

    it("should return true if minimumPaymentPriceYn is 'Y' and payment meets minimum", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, minimumPaymentPriceYn: "Y", minimumPaymentPrice: 50 });
      expect(promo.meetsMinimumPayment(50)).toBe(true);
      expect(promo.meetsMinimumPayment(100)).toBe(true);
    });

    it("should return false if minimumPaymentPriceYn is 'Y' and payment is less than minimum", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, minimumPaymentPriceYn: "Y", minimumPaymentPrice: 50 });
      expect(promo.meetsMinimumPayment(49)).toBe(false);
    });
  });

  describe("calculatePointReward", () => {
    it("should return 0 if minimum payment is not met", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, minimumPaymentPriceYn: "Y", minimumPaymentPrice: 100 });
      expect(promo.calculatePointReward(50)).toBe(0);
    });

    it("should calculate fixed rate reward correctly", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, promotionSavingType: "FIXED_RATE", promotionSavingRate: 10, maximumSavingPoint: 200 });
      expect(promo.calculatePointReward(1000)).toBe(100); // 10% of 1000
    });

    it("should cap fixed rate reward by maximumSavingPoint", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, promotionSavingType: "FIXED_RATE", promotionSavingRate: 10, maximumSavingPoint: 50 });
      expect(promo.calculatePointReward(1000)).toBe(50); // 10% of 1000 is 100, but capped at 50
    });

    it("should calculate fixed point reward correctly", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, promotionSavingType: "FIXED_POINT", promotionSavingPoint: 75, maximumSavingPoint: 200 });
      expect(promo.calculatePointReward(1000)).toBe(75);
    });

    it("should cap fixed point reward by maximumSavingPoint", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, promotionSavingType: "FIXED_POINT", promotionSavingPoint: 75, maximumSavingPoint: 50 });
      expect(promo.calculatePointReward(1000)).toBe(50); // 75 capped at 50
    });

    it("should cap reward by remaining budget", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, promotionSavingType: "FIXED_RATE", promotionSavingRate: 10, remainingPoint: 30, maximumSavingPoint: 200 });
      expect(promo.calculatePointReward(1000)).toBe(30); // 10% of 1000 is 100, but remaining is 30
    });
  });

  describe("applyPointReward", () => {
    it("should throw MinimumPaymentNotMetException if minimum payment not met", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, minimumPaymentPriceYn: "Y", minimumPaymentPrice: 100 });
      expect(() => promo.applyPointReward(50)).toThrow(MinimumPaymentNotMetException);
    });

    it("should throw InsufficientBudgetException if no points available for reward (calculated as 0)", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, promotionSavingRate: 0 });
      expect(() => promo.applyPointReward(100)).toThrow(InsufficientBudgetException);
    });

    it("should apply reward and update points correctly when remaining budget caps the reward", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, promotionBudget: 1000, remainingPoint: 50, usedPoint: 0, promotionSavingRate: 10, maximumSavingPoint: 200 });
      const reward = promo.applyPointReward(1000); // 10% of 1000 = 100, capped by remainingPoint to 50
      expect(reward).toBe(50);
      expect(promo.getUsedPoint()).toBe(50);
      expect(promo.getRemainingPoint()).toBe(0);
      expect(promo.getUsedPointPercentage()).toBe(5); // 50/1000 * 100
      expect(promo.getRemainingPointPercentage()).toBe(0); // 0/1000 * 100
    });

    it("should apply reward and update points correctly", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, promotionBudget: 1000, remainingPoint: 1000, usedPoint: 0, promotionSavingRate: 10, maximumSavingPoint: 200 });
      const reward = promo.applyPointReward(500); // 10% of 500 = 50
      expect(reward).toBe(50);
      expect(promo.getUsedPoint()).toBe(50);
      expect(promo.getRemainingPoint()).toBe(950);
      expect(promo.getUsedPointPercentage()).toBe(5); // 50/1000 * 100
      expect(promo.getRemainingPointPercentage()).toBe(95); // 950/1000 * 100
    });
  });

  describe("calculateUsagePercentage", () => {
    it("should return the usedPointPercentage", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, usedPointPercentage: 75 });
      expect(promo.calculateUsagePercentage()).toBe(75);
    });
  });

  describe("canApply", () => {
    it("should return false if not within valid period", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, startDate: new Date("2024-01-01"), endDate: new Date("2024-12-31") });
      expect(promo.canApply(100, new Date("2023-06-01"))).toBe(false);
    });

    it("should return false if minimum payment not met", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, minimumPaymentPriceYn: "Y", minimumPaymentPrice: 100 });
      expect(promo.canApply(50)).toBe(false);
    });

    it("should return false if calculated point reward is 0", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, promotionSavingRate: 0 });
      expect(promo.canApply(100)).toBe(false);
    });

    it("should return false if insufficient points in budget", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, promotionSavingRate: 10, remainingPoint: 5, maximumSavingPoint: 200 });
      expect(promo.canApply(100)).toBe(false); // Needs 10, has 5
    });

    it("should return true if all conditions are met", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, promotionSavingRate: 10, remainingPoint: 100, maximumSavingPoint: 200 });
      const testDate = new Date("2023-06-15"); // A date within the default range
      expect(promo.canApply(100, testDate)).toBe(true); // 10% of 100 = 10, has 100
    });
  });

  describe("canUserApply", () => {
    it("should return true if clientLimitType is NONE", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, clientLimitType: "NONE" });
      expect(promo.canUserApply(10, 100)).toBe(true);
    });

    it("should return false if clientLimitCount is exceeded", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, clientLimitType: "COUNT", clientLimitCount: 5 });
      expect(promo.canUserApply(5, 100)).toBe(false);
      expect(promo.canUserApply(6, 100)).toBe(false);
    });

    it("should return false if clientLimitPoint is exceeded", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, clientLimitType: "POINT", clientLimitPoint: 50 });
      expect(promo.canUserApply(1, 50)).toBe(false);
      expect(promo.canUserApply(1, 51)).toBe(false);
    });

    it("should return true if client limits are not exceeded", () => {
      const promo = new PointPromotion({ ...defaultPointPromotionParams, clientLimitType: "COUNT", clientLimitCount: 5 });
      expect(promo.canUserApply(4, 100)).toBe(true);
    });
  });

  describe("Getters", () => {
    it("should return correct values for all getters", () => {
      const promo = new PointPromotion(defaultPointPromotionParams);
      expect(promo.getPromotionName()).toBe(defaultPointPromotionParams.promotionName);
      expect(promo.getPromotionBudget()).toBe(defaultPointPromotionParams.promotionBudget);
      expect(promo.getPromotionSavingType()).toBe(defaultPointPromotionParams.promotionSavingType);
      expect(promo.getPromotionSavingRate()).toBe(defaultPointPromotionParams.promotionSavingRate);
      expect(promo.getMinimumPaymentPrice()).toBe(defaultPointPromotionParams.minimumPaymentPrice);
      expect(promo.getMaximumSavingPoint()).toBe(defaultPointPromotionParams.maximumSavingPoint);
      expect(promo.getUsedPoint()).toBe(defaultPointPromotionParams.usedPoint);
      expect(promo.getRemainingPoint()).toBe(defaultPointPromotionParams.remainingPoint);
      expect(promo.getUsedPointPercentage()).toBe(defaultPointPromotionParams.usedPointPercentage);
      expect(promo.getRemainingPointPercentage()).toBe(defaultPointPromotionParams.remainingPointPercentage);
    });
  });
});
