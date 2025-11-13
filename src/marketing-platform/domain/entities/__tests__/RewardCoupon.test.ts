import { describe, it, expect, vi } from "vitest";
import { RewardCoupon } from "../RewardCoupon";
import {
  PromotionType,
  DistributionType,
  ProductType,
  ImageType,
  YesNo,
  FlexibleDaysType,
} from "../../types";

const defaultParams = {
  id: "reward-123",
  title: "Test Reward Coupon",
  startDate: new Date("2023-01-01"),
  endDate: new Date("2023-12-31"),
  promotionType: "POINT_COUPON" as PromotionType,
  distributionType: "REWARD" as DistributionType,
  productType: "ALL" as ProductType,
  imageType: "SQUARE" as ImageType,
  imageObsId: "obs-1",
  imageObsHash: "hash-1",
  imageUrl: "http://example.com/image.png",
  exhaustionAlarmYn: "N" as YesNo,
  exhaustionAlarmPercentageList: [],
  couponDiscountPrice: 10,
  purchasedCouponQuantity: 100,
  usedCouponQuantity: 20,
  remainingCouponQuantity: 80,
  fullPaymentYn: "N" as YesNo,
  fullPaymentMinPrice: 50,
  validityPeriodType: "FLEXIBLE_DAYS" as FlexibleDaysType,
  validityPeriodDays: 30,
  couponGrantYn: "Y" as YesNo,
  couponGrantMinPrice: 100,
  receivedCouponQuantity: 50,
};

// Mock the parent Coupon class methods that are not overridden
vi.mock("../Coupon", () => {
  class MockCoupon {
    id: string;
    title: string;
    endDate: Date;
    validityPeriodDays: number;
    validityPeriodType: FlexibleDaysType;

    constructor(params: any) {
      this.id = params.id;
      this.title = params.title;
      this.endDate = params.endDate;
      this.validityPeriodDays = params.validityPeriodDays;
      this.validityPeriodType = params.validityPeriodType;
    }
    getId = () => this.id;
    getTitle = () => this.title;
    getEndDate = () => new Date(this.endDate);
    calculateDiscount = (paymentAmount: number) =>
      paymentAmount > 50 ? 10 : 0;
  }
  return { Coupon: MockCoupon };
});

describe("RewardCoupon", () => {
  describe("Constructor and Getters", () => {
    it("should create an instance and set properties correctly", () => {
      const coupon = new RewardCoupon(defaultParams);
      expect(coupon.getId()).toBe(defaultParams.id);
      expect(coupon.getTitle()).toBe(defaultParams.title);
      expect(coupon.getCouponGrantYn()).toBe("Y");
      expect(coupon.getCouponGrantMinPrice()).toBe(100);
    });
  });

  describe("isAutomaticGrantEnabled", () => {
    it("should return true if couponGrantYn is 'Y'", () => {
      const coupon = new RewardCoupon({ ...defaultParams, couponGrantYn: "Y" });
      expect(coupon.isAutomaticGrantEnabled()).toBe(true);
    });

    it("should return false if couponGrantYn is 'N'", () => {
      const coupon = new RewardCoupon({ ...defaultParams, couponGrantYn: "N" });
      expect(coupon.isAutomaticGrantEnabled()).toBe(false);
    });
  });

  describe("qualifiesForAutoGrant", () => {
    it("should return false if automatic grant is disabled", () => {
      const coupon = new RewardCoupon({ ...defaultParams, couponGrantYn: "N" });
      expect(coupon.qualifiesForAutoGrant(200)).toBe(false);
    });

    it("should return true if grant is enabled and no minimum price is set", () => {
      const coupon = new RewardCoupon({
        ...defaultParams,
        couponGrantYn: "Y",
        couponGrantMinPrice: null,
      });
      expect(coupon.qualifiesForAutoGrant(50)).toBe(true);
    });

    it("should return true if payment amount is equal to or greater than min price", () => {
      const coupon = new RewardCoupon({
        ...defaultParams,
        couponGrantYn: "Y",
        couponGrantMinPrice: 100,
      });
      expect(coupon.qualifiesForAutoGrant(100)).toBe(true);
      expect(coupon.qualifiesForAutoGrant(150)).toBe(true);
    });

    it("should return false if payment amount is less than min price", () => {
      const coupon = new RewardCoupon({
        ...defaultParams,
        couponGrantYn: "Y",
        couponGrantMinPrice: 100,
      });
      expect(coupon.qualifiesForAutoGrant(99)).toBe(false);
    });
  });

  describe("calculateCouponExpirationDate", () => {
    it("should calculate the correct expiration date for FLEXIBLE_DAYS", () => {
      const coupon = new RewardCoupon({ ...defaultParams, validityPeriodDays: 15, validityPeriodType: "FLEXIBLE_DAYS" });
      const issueDate = new Date("2023-05-10");
      const expectedExpiration = new Date("2023-05-25");
      expect(coupon.calculateCouponExpirationDate(issueDate)).toEqual(
        expectedExpiration
      );
    });

    it("should return promotion end date for FIXED_DATE", () => {
      const endDate = new Date("2023-12-31");
      const coupon = new RewardCoupon({
        ...defaultParams,
        validityPeriodType: "FIXED_DATE",
        endDate
      });
      const issueDate = new Date("2023-05-10");
      expect(coupon.calculateCouponExpirationDate(issueDate)).toEqual(endDate);
    });
  });

  describe("isCouponValid", () => {
    const coupon = new RewardCoupon({ ...defaultParams, validityPeriodDays: 10 });
    const issueDate = new Date("2023-06-01");

    it("should return true if current date is before expiration", () => {
      const currentDate = new Date("2023-06-05");
      expect(coupon.isCouponValid(issueDate, currentDate)).toBe(true);
    });

    it("should return true if current date is on the expiration date", () => {
      const currentDate = new Date("2023-06-11");
      expect(coupon.isCouponValid(issueDate, currentDate)).toBe(true);
    });

    it("should return false if current date is after expiration", () => {
      const currentDate = new Date("2023-06-12");
      expect(coupon.isCouponValid(issueDate, currentDate)).toBe(false);
    });
  });

  describe("calculateDiscountWithValidity", () => {
    const coupon = new RewardCoupon({ ...defaultParams, validityPeriodDays: 10 });
    const issueDate = new Date("2023-07-01");

    it("should return discount if coupon is valid", () => {
      const currentDate = new Date("2023-07-05");
      expect(coupon.calculateDiscountWithValidity(issueDate, 100, currentDate)).toBe(10);
    });

    it("should return 0 if coupon is invalid", () => {
      const currentDate = new Date("2023-07-15");
      expect(coupon.calculateDiscountWithValidity(issueDate, 100, currentDate)).toBe(0);
    });
  });

  describe("getDaysUntilExpiration", () => {
    const coupon = new RewardCoupon({ ...defaultParams, validityPeriodDays: 20 });
    const issueDate = new Date("2023-08-01");

    it("should return the correct number of days until expiration", () => {
      const currentDate = new Date("2023-08-11");
      expect(coupon.getDaysUntilExpiration(issueDate, currentDate)).toBe(10);
    });
  });

  describe("isExpiringSoon", () => {
    const coupon = new RewardCoupon({ ...defaultParams, validityPeriodDays: 10 });
    const issueDate = new Date("2023-09-01");

    it("should return true if coupon is expiring soon", () => {
      const currentDate = new Date("2023-09-09");
      expect(coupon.isExpiringSoon(issueDate, 3, currentDate)).toBe(true);
    });

    it("should return false if coupon is not expiring soon", () => {
      const currentDate = new Date("2023-09-05");
      expect(coupon.isExpiringSoon(issueDate, 3, currentDate)).toBe(false);
    });

    it("should return false if coupon is expired", () => {
      const currentDate = new Date("2023-09-15");
      expect(coupon.isExpiringSoon(issueDate, 3, currentDate)).toBe(false);
    });
  });

  describe("getValidityPeriodInfo", () => {
    it("should return correct validity period information", () => {
      const coupon = new RewardCoupon({
        ...defaultParams,
        validityPeriodType: "FLEXIBLE_DAYS",
        validityPeriodDays: 45,
      });
      const info = coupon.getValidityPeriodInfo();
      expect(info).toEqual({
        type: "FLEXIBLE_DAYS",
        days: 45,
        description: "Valid for 45 days from issue date",
      });
    });
  });
});
