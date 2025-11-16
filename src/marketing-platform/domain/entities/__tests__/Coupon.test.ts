import { describe, it, expect, vi } from "vitest";
import { Coupon } from "../Coupon";
import {
  PromotionType,
  DistributionType,
  ProductType,
  ImageType,
  YesNo,
  FlexibleDaysType,
} from "../../types";
import {
  InvalidCouponQuantityException,
  InsufficientBudgetException,
  MinimumPaymentNotMetException,
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
  }
  return { Promotion: MockPromotion };
});

// Concrete implementation for testing abstract Coupon class
class TestCoupon extends Coupon {
  constructor(params: any) {
    super(params);
  }

  public calculateCouponExpirationDate(referenceDate: Date): Date {
    const endDate = new Date(referenceDate);
    endDate.setDate(endDate.getDate() + this.validityPeriodDays);
    return endDate;
  }

  // Expose protected method for testing
  public exposeValidateCouponUsage(paymentAmount: number): void {
    this.validateCouponUsage(paymentAmount);
  }
}

const defaultCouponParams = {
  id: "coupon-1",
  title: "Test Coupon",
  startDate: new Date("2023-01-01"),
  endDate: new Date("2023-12-31"),
  promotionType: "POINT_COUPON" as PromotionType,
  distributionType: "DOWNLOAD" as DistributionType,
  productType: "ALL" as ProductType,
  imageType: "SQUARE" as ImageType,
  imageObsId: "obs-1",
  imageObsHash: "hash-1",
  imageUrl: "http://example.com/image.png",
  exhaustionAlarmYn: "N" as YesNo,
  exhaustionAlarmPercentageList: [],
  couponDiscountPrice: 100,
  purchasedCouponQuantity: 100,
  usedCouponQuantity: 20,
  remainingCouponQuantity: 80,
  fullPaymentYn: "N" as YesNo,
  fullPaymentMinPrice: 0,
  validityPeriodType: "FLEXIBLE_DAYS" as FlexibleDaysType,
  validityPeriodDays: 30,
  receivedCouponQuantity: 10,
};

describe("Coupon", () => {
  describe("Constructor Validations", () => {
    it("should create a coupon with valid quantities", () => {
      const coupon = new TestCoupon(defaultCouponParams);
      expect(coupon).toBeInstanceOf(TestCoupon);
      expect(coupon.getPurchasedCouponQuantity()).toBe(100);
    });

    it("should throw InvalidCouponQuantityException for negative purchased quantity", () => {
      expect(
        () => new TestCoupon({ ...defaultCouponParams, purchasedCouponQuantity: -1 })
      ).toThrow(InvalidCouponQuantityException);
    });

    it("should throw InvalidCouponQuantityException for negative used quantity", () => {
      expect(
        () => new TestCoupon({ ...defaultCouponParams, usedCouponQuantity: -1 })
      ).toThrow(InvalidCouponQuantityException);
    });

    it("should throw InvalidCouponQuantityException for negative remaining quantity", () => {
      expect(
        () => new TestCoupon({ ...defaultCouponParams, remainingCouponQuantity: -1 })
      ).toThrow(InvalidCouponQuantityException);
    });

    it("should throw InvalidCouponQuantityException if used quantity exceeds purchased", () => {
      expect(
        () => new TestCoupon({ ...defaultCouponParams, usedCouponQuantity: 101 })
      ).toThrow(InvalidCouponQuantityException);
    });

    it("should throw InvalidCouponQuantityException if remaining quantity exceeds purchased", () => {
      expect(
        () => new TestCoupon({ ...defaultCouponParams, remainingCouponQuantity: 101 })
      ).toThrow(InvalidCouponQuantityException);
    });

    it("should throw InvalidCouponQuantityException if discount price is not positive", () => {
      expect(
        () => new TestCoupon({ ...defaultCouponParams, couponDiscountPrice: 0 })
      ).toThrow(InvalidCouponQuantityException);
      expect(
        () => new TestCoupon({ ...defaultCouponParams, couponDiscountPrice: -10 })
      ).toThrow(InvalidCouponQuantityException);
    });

    it("should throw InvalidCouponQuantityException if minimum price is negative", () => {
      expect(
        () => new TestCoupon({ ...defaultCouponParams, fullPaymentMinPrice: -1 })
      ).toThrow(InvalidCouponQuantityException);
    });
  });

  describe("hasAvailableCoupons", () => {
    it("should return true if remaining quantity is greater than 0", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, remainingCouponQuantity: 1 });
      expect(coupon.hasAvailableCoupons()).toBe(true);
    });

    it("should return false if remaining quantity is 0", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, remainingCouponQuantity: 0 });
      expect(coupon.hasAvailableCoupons()).toBe(false);
    });
  });

  describe("meetsMinimumPayment", () => {
    it("should return true if fullPaymentYn is 'N'", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, fullPaymentYn: "N" });
      expect(coupon.meetsMinimumPayment(50)).toBe(true);
    });

    it("should return true if fullPaymentYn is 'Y' and payment meets min price", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, fullPaymentYn: "Y", fullPaymentMinPrice: 50 });
      expect(coupon.meetsMinimumPayment(50)).toBe(true);
      expect(coupon.meetsMinimumPayment(100)).toBe(true);
    });

    it("should return false if fullPaymentYn is 'Y' and payment is less than min price", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, fullPaymentYn: "Y", fullPaymentMinPrice: 50 });
      expect(coupon.meetsMinimumPayment(49)).toBe(false);
    });
  });

  describe("exposeValidateCouponUsage (protected method)", () => {
    it("should throw InsufficientBudgetException if no coupons available", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, remainingCouponQuantity: 0 });
      expect(() => coupon.exposeValidateCouponUsage(100)).toThrow(InsufficientBudgetException);
    });

    it("should throw MinimumPaymentNotMetException if minimum payment not met", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, fullPaymentYn: "Y", fullPaymentMinPrice: 100 });
      expect(() => coupon.exposeValidateCouponUsage(50)).toThrow(MinimumPaymentNotMetException);
    });

    it("should not throw if conditions are met", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, remainingCouponQuantity: 1, fullPaymentYn: "Y", fullPaymentMinPrice: 50 });
      expect(() => coupon.exposeValidateCouponUsage(100)).not.toThrow();
    });
  });

  describe("calculateDiscount", () => {
    it("should return 0 if minimum payment is not met", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, fullPaymentYn: "Y", fullPaymentMinPrice: 100, couponDiscountPrice: 50 });
      expect(coupon.calculateDiscount(99)).toBe(0);
    });

    it("should return discount price if payment meets minimum and is greater than discount", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, fullPaymentYn: "Y", fullPaymentMinPrice: 50, couponDiscountPrice: 50 });
      expect(coupon.calculateDiscount(100)).toBe(50);
    });

    it("should return payment amount if payment is less than discount price but meets minimum", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, fullPaymentYn: "Y", fullPaymentMinPrice: 10, couponDiscountPrice: 50 });
      expect(coupon.calculateDiscount(30)).toBe(30); // Discount should not exceed payment amount
    });
  });

  describe("calculateUsagePercentage", () => {
    it("should return 0 if purchased quantity is 0", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, purchasedCouponQuantity: 0, usedCouponQuantity: 0, remainingCouponQuantity: 0 });
      expect(coupon.calculateUsagePercentage()).toBe(0);
    });

    it("should calculate correct percentage", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, purchasedCouponQuantity: 100, usedCouponQuantity: 25 });
      expect(coupon.calculateUsagePercentage()).toBe(25);
    });
  });

  describe("getFinalPaymentAmount", () => {
    it("should return payment amount minus discount", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, fullPaymentYn: "N", couponDiscountPrice: 50 });
      expect(coupon.getFinalPaymentAmount(100)).toBe(50);
    });

    it("should not return negative final payment", () => {
      const coupon = new TestCoupon({ ...defaultCouponParams, fullPaymentYn: "N", couponDiscountPrice: 150 });
      expect(coupon.getFinalPaymentAmount(100)).toBe(0);
    });
  });

  describe("Getters", () => {
    it("should return correct values for all getters", () => {
      const coupon = new TestCoupon(defaultCouponParams);
      expect(coupon.getCouponDiscountPrice()).toBe(defaultCouponParams.couponDiscountPrice);
      expect(coupon.getPurchasedCouponQuantity()).toBe(defaultCouponParams.purchasedCouponQuantity);
      expect(coupon.getUsedCouponQuantity()).toBe(defaultCouponParams.usedCouponQuantity);
      expect(coupon.getRemainingCouponQuantity()).toBe(defaultCouponParams.remainingCouponQuantity);
      expect(coupon.getFullPaymentYn()).toBe(defaultCouponParams.fullPaymentYn);
      expect(coupon.getFullPaymentMinPrice()).toBe(defaultCouponParams.fullPaymentMinPrice);
      expect(coupon.getValidityPeriodType()).toBe(defaultCouponParams.validityPeriodType);
      expect(coupon.getValidityPeriodDays()).toBe(defaultCouponParams.validityPeriodDays);
      expect(coupon.getReceivedCouponQuantity()).toBe(defaultCouponParams.receivedCouponQuantity);
    });
  });
});
