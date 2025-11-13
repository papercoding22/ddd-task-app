import { describe, it, expect } from "vitest";
import { Promotion } from "../Promotion";
import {
  PromotionType,
  DistributionType,
  ProductType,
  ImageType,
  YesNo,
  ExposureProduct,
} from "../../types";
import { InvalidPromotionDateException } from "../../exceptions/PromotionExceptions";

// Concrete implementation for testing abstract Promotion class
class TestPromotion extends Promotion {
  constructor(params: any) {
    super(params);
  }

  public calculateUsagePercentage(): number {
    return 50; // Mock implementation
  }

  // Expose protected method for testing
  public exposeEnsureActive(currentDate: Date = new Date()): void {
    this.ensureActive(currentDate);
  }
}

const defaultPromotionParams = {
  id: "promo-1",
  title: "Test Promotion",
  startDate: new Date("2023-01-01"),
  endDate: new Date("2023-12-31"),
  promotionType: "POINT_PROMOTION" as PromotionType,
  distributionType: "NA" as DistributionType,
  productType: "ALL" as ProductType,
  imageType: "SQUARE" as ImageType,
  imageObsId: "obs-1",
  imageObsHash: "hash-1",
  imageUrl: "http://example.com/image.png",
  exhaustionAlarmYn: "N" as YesNo,
  exhaustionAlarmPercentageList: [],
  exposureProductList: [],
};

describe("Promotion", () => {
  describe("Constructor Validations", () => {
    it("should create a promotion with valid dates", () => {
      const promo = new TestPromotion(defaultPromotionParams);
      expect(promo).toBeInstanceOf(TestPromotion);
      expect(promo.getTitle()).toBe("Test Promotion");
    });

    it("should throw InvalidPromotionDateException if start date is after end date", () => {
      expect(
        () => new TestPromotion({ ...defaultPromotionParams, startDate: new Date("2024-01-01"), endDate: new Date("2023-12-31") })
      ).toThrow(InvalidPromotionDateException);
    });

    it("should throw InvalidPromotionDateException if start date is same as end date", () => {
      const date = new Date("2023-12-31");
      expect(
        () => new TestPromotion({ ...defaultPromotionParams, startDate: date, endDate: date })
      ).toThrow(InvalidPromotionDateException);
    });
  });

  describe("Date-based methods", () => {
    const promo = new TestPromotion({ ...defaultPromotionParams, startDate: new Date("2023-06-01"), endDate: new Date("2023-06-30") });

    it("isWithinValidPeriod should return true for dates within the period", () => {
      expect(promo.isWithinValidPeriod(new Date("2023-06-15"))).toBe(true);
    });

    it("isWithinValidPeriod should return false for dates outside the period", () => {
      expect(promo.isWithinValidPeriod(new Date("2023-05-31"))).toBe(false);
      expect(promo.isWithinValidPeriod(new Date("2023-07-01"))).toBe(false);
    });

    it("hasStarted should return true for dates on or after start date", () => {
      expect(promo.hasStarted(new Date("2023-06-01"))).toBe(true);
      expect(promo.hasStarted(new Date("2023-06-15"))).toBe(true);
    });

    it("hasStarted should return false for dates before start date", () => {
      expect(promo.hasStarted(new Date("2023-05-31"))).toBe(false);
    });

    it("hasEnded should return true for dates after end date", () => {
      expect(promo.hasEnded(new Date("2023-07-01"))).toBe(true);
    });

    it("hasEnded should return false for dates on or before end date", () => {
      expect(promo.hasEnded(new Date("2023-06-30"))).toBe(false);
      expect(promo.hasEnded(new Date("2023-06-15"))).toBe(false);
    });
  });

  describe("ensureActive (protected method)", () => {
    const promo = new TestPromotion({ ...defaultPromotionParams, startDate: new Date("2023-06-01"), endDate: new Date("2023-06-30") });

    it("should not throw if promotion is active", () => {
      expect(() => promo.exposeEnsureActive(new Date("2023-06-15"))).not.toThrow();
    });

    it("should throw an error if promotion is not active", () => {
      expect(() => promo.exposeEnsureActive(new Date("2023-07-01"))).toThrow("Promotion is not active");
    });
  });

  describe("updateImage", () => {
    it("should update image properties", () => {
      const promo = new TestPromotion(defaultPromotionParams);
      promo.updateImage("WIDE", "obs-2", "hash-2", "http://example.com/new.png");
      expect(promo.getImageType()).toBe("WIDE");
      expect(promo.getImageUrl()).toBe("http://example.com/new.png");
    });
  });

  describe("updateTitle", () => {
    it("should update the title", () => {
      const promo = new TestPromotion(defaultPromotionParams);
      promo.updateTitle("New Title");
      expect(promo.getTitle()).toBe("New Title");
    });

    it("should throw an error for empty title", () => {
      const promo = new TestPromotion(defaultPromotionParams);
      expect(() => promo.updateTitle("")).toThrow("Title cannot be empty");
      expect(() => promo.updateTitle("   ")).toThrow("Title cannot be empty");
    });

    it("should throw an error if title exceeds MAX_TITLE_LENGTH characters", () => {
      const promo = new TestPromotion(defaultPromotionParams);
      const MAX_TITLE_LENGTH = 300; // Define locally for test clarity
      const longTitle = "a".repeat(MAX_TITLE_LENGTH + 1);
      expect(() => promo.updateTitle(longTitle)).toThrow(`Title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
    });
  });

  describe("equals", () => {
    it("should return true for promotions with the same id", () => {
      const promo1 = new TestPromotion({ ...defaultPromotionParams, id: "promo-1" });
      const promo2 = new TestPromotion({ ...defaultPromotionParams, id: "promo-1", title: "Different Title" });
      expect(promo1.equals(promo2)).toBe(true);
    });

    it("should return false for promotions with different ids", () => {
      const promo1 = new TestPromotion({ ...defaultPromotionParams, id: "promo-1" });
      const promo2 = new TestPromotion({ ...defaultPromotionParams, id: "promo-2" });
      expect(promo1.equals(promo2)).toBe(false);
    });

    it("should return false for null or undefined", () => {
      const promo1 = new TestPromotion(defaultPromotionParams);
      expect(promo1.equals(null)).toBe(false);
      expect(promo1.equals(undefined)).toBe(false);
    });
  });

  describe("Exposure Products", () => {
    const exposureProductList: ExposureProduct[] = [
      { exposureType: "MAIN", exposureStatus: "ON", startDate: "2023-01-01", endDate: "2023-01-31", productId: "p1" },
      { exposureType: "SUB", exposureStatus: "ON", startDate: "2023-02-01", endDate: "2023-02-28", productId: "p2" },
      { exposureType: "MAIN", exposureStatus: "OFF", startDate: "2023-01-01", endDate: "2023-01-31", productId: "p3" },
    ];
    const promo = new TestPromotion({ ...defaultPromotionParams, exposureProductList });

    it("getActiveExposureProducts should return only active products for the given date", () => {
      const activeProducts = promo.getActiveExposureProducts(new Date("2023-01-15"));
      expect(activeProducts).toHaveLength(1);
      expect(activeProducts[0].productId).toBe("p1");
    });

    it("hasActiveExposureProducts should return true if there are active products", () => {
      expect(promo.hasActiveExposureProducts(new Date("2023-02-15"))).toBe(true);
    });

    it("hasActiveExposureProducts should return false if there are no active products", () => {
      expect(promo.hasActiveExposureProducts(new Date("2023-03-15"))).toBe(false);
    });

    it("getExposureProductsByType should return products of a specific type", () => {
      const mainProducts = promo.getExposureProductsByType("MAIN");
      expect(mainProducts).toHaveLength(2);
      expect(mainProducts.map(p => p.productId)).toEqual(["p1", "p3"]);
    });
  });

  describe("Getters", () => {
    it("should return correct values for all getters", () => {
      const promo = new TestPromotion(defaultPromotionParams);
      expect(promo.getId()).toBe(defaultPromotionParams.id);
      expect(promo.getTitle()).toBe(defaultPromotionParams.title);
      expect(promo.getStartDate()).toEqual(defaultPromotionParams.startDate);
      expect(promo.getEndDate()).toEqual(defaultPromotionParams.endDate);
      expect(promo.getPromotionType()).toBe(defaultPromotionParams.promotionType);
      expect(promo.getDistributionType()).toBe(defaultPromotionParams.distributionType);
      expect(promo.getProductType()).toBe(defaultPromotionParams.productType);
      expect(promo.getImageType()).toBe(defaultPromotionParams.imageType);
      expect(promo.getImageUrl()).toBe(defaultPromotionParams.imageUrl);
      expect(promo.getExhaustionAlarmYn()).toBe(defaultPromotionParams.exhaustionAlarmYn);
      expect(promo.getExhaustionAlarmPercentageList()).toEqual(defaultPromotionParams.exhaustionAlarmPercentageList);
      expect(promo.getExposureProductList()).toEqual(defaultPromotionParams.exposureProductList);
    });
  });

  describe("reschedulePromotion", () => {
    const today = new Date("2023-10-26T10:00:00Z");

    it("should reschedule the promotion with valid dates", () => {
      const promo = new TestPromotion(defaultPromotionParams);
      const newStartDate = new Date("2023-11-01");
      const newEndDate = new Date("2024-01-01");
      promo.reschedulePromotion(newStartDate, newEndDate, today);
      expect(promo.getStartDate()).toEqual(newStartDate);
      expect(promo.getEndDate()).toEqual(newEndDate);
    });

    it("should throw InvalidPromotionDateException if new start date is not in the future", () => {
      const promo = new TestPromotion(defaultPromotionParams);
      const newStartDate = new Date("2023-10-26"); // Same as today
      const newEndDate = new Date("2024-01-01");
      expect(() => promo.reschedulePromotion(newStartDate, newEndDate, today)).toThrow(InvalidPromotionDateException);
    });

    it("should throw InvalidPromotionDateException if new end date is more than 365 days from today", () => {
      const promo = new TestPromotion(defaultPromotionParams);
      const newStartDate = new Date("2023-11-01");
      const newEndDate = new Date("2024-10-27"); // 366 days from today
      expect(() => promo.reschedulePromotion(newStartDate, newEndDate, today)).toThrow(InvalidPromotionDateException);
    });

    it("should throw InvalidPromotionDateException if new start date is after new end date", () => {
      const promo = new TestPromotion(defaultPromotionParams);
      const newStartDate = new Date("2024-01-01");
      const newEndDate = new Date("2023-12-01");
      expect(() => promo.reschedulePromotion(newStartDate, newEndDate, today)).toThrow(InvalidPromotionDateException);
    });
  });

});
