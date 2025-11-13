import { describe, it, expect, vi } from "vitest";
import { DownloadableCoupon } from "../DownloadableCoupon";
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
  CouponExpiredException,
  MinimumPaymentNotMetException,
  InsufficientBudgetException,
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

// Mock Coupon parent class
vi.mock("../Coupon", async (importOriginal) => {
  const actual = await importOriginal();
  class MockCoupon extends (actual as any).Coupon {
    constructor(params: any) {
      super(params);
    }
    // Implement abstract method for testing
    calculateCouponExpirationDate(referenceDate: Date): Date {
      const endDate = new Date(referenceDate);
      endDate.setDate(endDate.getDate() + this.validityPeriodDays);
      return endDate;
    }
    // Expose protected method for testing
    public exposeValidateCouponUsage(paymentAmount: number): void {
      this.validateCouponUsage(paymentAmount);
    }
  }
  return {
    ...actual,
    Coupon: MockCoupon,
  };
});

const defaultDownloadableCouponParams = {
  id: "download-1",
  title: "Downloadable Coupon",
  startDate: new Date("2023-01-01"),
  endDate: new Date("2023-12-31"),
  promotionType: "POINT_COUPON" as PromotionType,
  distributionType: "DOWNLOAD" as DistributionType,
  productType: "ALL" as ProductType,
  imageType: "SQUARE" as ImageType,
  imageObsId: "obs-2",
  imageObsHash: "hash-2",
  imageUrl: "http://example.com/image2.png",
  exhaustionAlarmYn: "N" as YesNo,
  exhaustionAlarmPercentageList: [],
  couponDiscountPrice: 50,
  purchasedCouponQuantity: 200,
  usedCouponQuantity: 50,
  remainingCouponQuantity: 150,
  fullPaymentYn: "Y" as YesNo,
  fullPaymentMinPrice: 100,
  flexibleDaysType: "FLEXIBLE_DAYS" as FlexibleDaysType,
  flexibleDays: 60,
  couponName: "Summer Sale",
  couponIssuanceQuantity: 1000,
  minimumPaymentPrice: 100, // This is specific to DownloadableCoupon
  downloadableCouponQuantity: 500,
  downloadedCouponQuantity: 100,
  generalQuantityPerDay: 10,
  downloadableMultiply: 1,
  minDownloadableQuantity: 1,
  multipleIssuedYn: "Y" as YesNo,
};

describe("DownloadableCoupon", () => {
  describe("Constructor Validations", () => {
    it("should create a downloadable coupon with valid quantities", () => {
      const coupon = new DownloadableCoupon(defaultDownloadableCouponParams);
      expect(coupon).toBeInstanceOf(DownloadableCoupon);
      expect(coupon.getDownloadableCouponQuantity()).toBe(500);
    });

    it("should throw InvalidCouponQuantityException for negative downloadable quantity", () => {
      expect(
        () => new DownloadableCoupon({ ...defaultDownloadableCouponParams, downloadableCouponQuantity: -1 })
      ).toThrow(InvalidCouponQuantityException);
    });

    it("should throw InvalidCouponQuantityException for negative downloaded quantity", () => {
      expect(
        () => new DownloadableCoupon({ ...defaultDownloadableCouponParams, downloadedCouponQuantity: -1 })
      ).toThrow(InvalidCouponQuantityException);
    });

    it("should throw InvalidCouponQuantityException if downloaded quantity exceeds downloadable", () => {
      expect(
        () => new DownloadableCoupon({ ...defaultDownloadableCouponParams, downloadedCouponQuantity: 501 })
      ).toThrow(InvalidCouponQuantityException);
    });
  });

  describe("hasAvailableDownloads", () => {
    it("should return true if received quantity is less than downloadable quantity", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, downloadedCouponQuantity: 499 });
      expect(coupon.hasAvailableDownloads()).toBe(true);
    });

    it("should return false if received quantity is equal to downloadable quantity", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, downloadedCouponQuantity: 500 });
      expect(coupon.hasAvailableDownloads()).toBe(false);
    });
  });

  describe("allowsMultipleDownloads", () => {
    it("should return true if multipleIssuedYn is 'Y'", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, multipleIssuedYn: "Y" });
      expect(coupon.allowsMultipleDownloads()).toBe(true);
    });

    it("should return false if multipleIssuedYn is 'N'", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, multipleIssuedYn: "N" });
      expect(coupon.allowsMultipleDownloads()).toBe(false);
    });
  });

  describe("getRemainingDownloadableQuantity", () => {
    it("should calculate the correct remaining downloadable quantity", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, downloadableCouponQuantity: 500, downloadedCouponQuantity: 100 });
      expect(coupon.getRemainingDownloadableQuantity()).toBe(400);
    });
  });

  describe("calculateDownloadPercentage", () => {
    it("should return 0 if downloadable quantity is 0", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, downloadableCouponQuantity: 0, downloadedCouponQuantity: 0 });
      expect(coupon.calculateDownloadPercentage()).toBe(0);
    });

    it("should calculate correct download percentage", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, downloadableCouponQuantity: 500, downloadedCouponQuantity: 100 });
      expect(coupon.calculateDownloadPercentage()).toBe(20);
    });
  });

  describe("calculateCouponExpirationDate", () => {
    it("should return end date for FIXED_DATE validity type", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, flexibleDaysType: "FIXED_DATE" });
      const downloadDate = new Date("2023-03-15");
      expect(coupon.calculateCouponExpirationDate(downloadDate)).toEqual(defaultDownloadableCouponParams.endDate);
    });

    it("should calculate expiration date based on flexible days for FLEXIBLE_DAYS validity type", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, flexibleDaysType: "FLEXIBLE_DAYS", flexibleDays: 30 });
      const downloadDate = new Date("2023-03-15");
      const expectedExpiration = new Date("2023-04-14"); // 30 days after 2023-03-15
      expect(coupon.calculateCouponExpirationDate(downloadDate)).toEqual(expectedExpiration);
    });
  });

  describe("isCouponExpired", () => {
    it("should return true if current date is after expiration date", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, flexibleDaysType: "FLEXIBLE_DAYS", flexibleDays: 10 });
      const downloadDate = new Date("2023-04-01");
      const currentDate = new Date("2023-04-12"); // 11 days after download
      expect(coupon.isCouponExpired(downloadDate, currentDate)).toBe(true);
    });

    it("should return false if current date is before expiration date", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, flexibleDaysType: "FLEXIBLE_DAYS", flexibleDays: 10 });
      const downloadDate = new Date("2023-04-01");
      const currentDate = new Date("2023-04-05"); // 4 days after download
      expect(coupon.isCouponExpired(downloadDate, currentDate)).toBe(false);
    });
  });

  describe("validateCouponForUse", () => {
    it("should throw CouponExpiredException if coupon is expired", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, flexibleDaysType: "FLEXIBLE_DAYS", flexibleDays: 10 });
      const downloadDate = new Date("2023-05-01");
      const currentDate = new Date("2023-05-15");
      expect(() => coupon.validateCouponForUse(downloadDate, 200, currentDate)).toThrow(CouponExpiredException);
    });

    it("should throw InsufficientBudgetException if no coupons available (from parent)", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, remainingCouponQuantity: 0 });
      const downloadDate = new Date("2023-05-01");
      const currentDate = new Date("2023-05-05");
      expect(() => coupon.validateCouponForUse(downloadDate, 200, currentDate)).toThrow(InsufficientBudgetException);
    });

    it("should throw MinimumPaymentNotMetException if minimum payment not met (from parent)", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, minimumPaymentPrice: 200 });
      const downloadDate = new Date("2023-05-01");
      const currentDate = new Date("2023-05-05");
      expect(() => coupon.validateCouponForUse(downloadDate, 150, currentDate)).toThrow(MinimumPaymentNotMetException);
    });

    it("should not throw if all conditions are met", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, remainingCouponQuantity: 1 });
      const downloadDate = new Date("2023-05-01");
      const currentDate = new Date("2023-05-05");
      expect(() => coupon.validateCouponForUse(downloadDate, 200, currentDate)).not.toThrow();
    });
  });

  describe("meetsMinimumPayment (override)", () => {
    it("should use downloadable coupon's minimumPaymentPrice", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, minimumPaymentPrice: 250 });
      expect(coupon.meetsMinimumPayment(250)).toBe(true);
      expect(coupon.meetsMinimumPayment(200)).toBe(false);
    });
  });

  describe("calculateDiscount (override)", () => {
    it("should return 0 if downloadable coupon's minimum payment is not met", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, minimumPaymentPrice: 250, couponDiscountPrice: 50 });
      expect(coupon.calculateDiscount(200)).toBe(0);
    });

    it("should return discount if downloadable coupon's minimum payment is met", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, minimumPaymentPrice: 250, couponDiscountPrice: 50 });
      expect(coupon.calculateDiscount(300)).toBe(50);
    });
  });

  describe("getDailyDownloadLimit", () => {
    it("should return the generalQuantityPerDay", () => {
      const coupon = new DownloadableCoupon({ ...defaultDownloadableCouponParams, generalQuantityPerDay: 25 });
      expect(coupon.getDailyDownloadLimit()).toBe(25);
    });
  });

  describe("calculateTotalDownloadableFromDaily", () => {
    it("should calculate total downloadable based on daily limit and duration", () => {
      const startDate = new Date("2023-01-01");
      const endDate = new Date("2023-01-10"); // 9 days duration
      const coupon = new DownloadableCoupon({
        ...defaultDownloadableCouponParams,
        startDate,
        endDate,
        generalQuantityPerDay: 5,
      });
      // Duration is 9 days (from 01 to 10 inclusive)
      // (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) = 9
      // Math.ceil(9) = 9
      expect(coupon.calculateTotalDownloadableFromDaily()).toBe(5 * 9); // 45
    });
  });

  describe("Getters", () => {
    it("should return correct values for all getters", () => {
      const coupon = new DownloadableCoupon(defaultDownloadableCouponParams);
      expect(coupon.getCouponName()).toBe(defaultDownloadableCouponParams.couponName);
      expect(coupon.getCouponIssuanceQuantity()).toBe(defaultDownloadableCouponParams.couponIssuanceQuantity);
      expect(coupon.getMinimumPaymentPrice()).toBe(defaultDownloadableCouponParams.minimumPaymentPrice);
      expect(coupon.getDownloadableCouponQuantity()).toBe(defaultDownloadableCouponParams.downloadableCouponQuantity);
      expect(coupon.getDownloadedCouponQuantity()).toBe(defaultDownloadableCouponParams.downloadedCouponQuantity);
      expect(coupon.getGeneralQuantityPerDay()).toBe(defaultDownloadableCouponParams.generalQuantityPerDay);
      expect(coupon.getMultipleIssuedYn()).toBe(defaultDownloadableCouponParams.multipleIssuedYn);
    });
  });
});
