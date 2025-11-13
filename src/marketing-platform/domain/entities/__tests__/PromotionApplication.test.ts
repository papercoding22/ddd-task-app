import { describe, it, expect, vi } from "vitest";
import { PromotionApplication } from "../PromotionApplication";
import { Promotion } from "../Promotion";
import { PromotionOrder } from "../PromotionOrder";
import {
  CountryType,
  ApplicationRouteType,
  ApplicationStatus,
  YesNo,
  ReviewDetail,
  EarlyEndInfo,
  PromotionType,
  DistributionType,
} from "../../types";

// Mock Promotion class
class MockPromotion {
  startDate: Date;
  endDate: Date;
  promotionType: PromotionType;
  distributionType: DistributionType;

  constructor(startDate: Date, endDate: Date, promotionType: PromotionType, distributionType: DistributionType) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.promotionType = promotionType;
    this.distributionType = distributionType;
  }

  getStartDate = vi.fn(() => this.startDate);
  getEndDate = vi.fn(() => this.endDate);
  getPromotionType = vi.fn(() => this.promotionType);
  getDistributionType = vi.fn(() => this.distributionType);
}

// Mock PromotionOrder class
class MockPromotionOrder {
  paymentCompleted: boolean;
  paymentInfo: any;

  constructor(paymentCompleted: boolean, paymentInfo: any) {
    this.paymentCompleted = paymentCompleted;
    this.paymentInfo = paymentInfo;
  }

  isPaymentCompleted = vi.fn(() => this.paymentCompleted);
  getPaymentInfo = vi.fn(() => this.paymentInfo);
}

const defaultPromotion = new MockPromotion(
  new Date("2023-01-01"),
  new Date("2023-12-31"),
  "POINT_PROMOTION",
  "NA"
) as unknown as Promotion;

const defaultPromotionOrder = new MockPromotionOrder(true, {
  promotionType: "POINT_PROMOTION",
  distributionType: "NA",
}) as unknown as PromotionOrder;

const defaultPromotionApplicationParams = {
  applySeq: 1,
  countryType: "KR" as CountryType,
  merchantId: "merchant-1",
  merchantName: "Test Merchant",
  managerEmail: "manager@test.com",
  applicationRouteType: "ADMIN" as ApplicationRouteType,
  appliedAt: new Date("2023-10-01"),
  applicationStatus: "APPLYING" as ApplicationStatus,
  appliedByAdmin: "Y" as YesNo,
  promotion: defaultPromotion,
  promotionOrder: defaultPromotionOrder,
};

describe("PromotionApplication", () => {
  describe("Constructor and Getters", () => {
    it("should create a PromotionApplication with valid parameters", () => {
      const app = new PromotionApplication(defaultPromotionApplicationParams);
      expect(app).toBeInstanceOf(PromotionApplication);
      expect(app.getApplySeq()).toBe(1);
      expect(app.getMerchantName()).toBe("Test Merchant");
    });
  });

  describe("isActive", () => {
    it("should return true if in service and within date range", () => {
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, applicationStatus: "IN_SERVICE" });
      expect(app.isActive(new Date("2023-06-01"))).toBe(true);
    });

    it("should return false if not in service", () => {
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, applicationStatus: "APPLYING" });
      expect(app.isActive(new Date("2023-06-01"))).toBe(false);
    });

    it("should return false if outside date range", () => {
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, applicationStatus: "IN_SERVICE" });
      expect(app.isActive(new Date("2024-01-01"))).toBe(false);
    });
  });

  describe("Status checks", () => {
    it("isInService should return true for IN_SERVICE status", () => {
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, applicationStatus: "IN_SERVICE" });
      expect(app.isInService()).toBe(true);
    });

    it("isApplying should return true for APPLYING status", () => {
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, applicationStatus: "APPLYING" });
      expect(app.isApplying()).toBe(true);
    });

    it("isCancelled should return true for CANCELLED status", () => {
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, applicationStatus: "CANCELLED" });
      expect(app.isCancelled()).toBe(true);
    });

    it("isCompleted should return true for COMPLETED status", () => {
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, applicationStatus: "COMPLETED" });
      expect(app.isCompleted()).toBe(true);
    });
  });

  describe("cancel", () => {
    it("should change status to CANCELLED and set reason", () => {
      const app = new PromotionApplication(defaultPromotionApplicationParams);
      app.cancel("Test reason");
      expect(app.isCancelled()).toBe(true);
      expect(app.getCancelReason()).toBe("Test reason");
    });

    it("should throw error for empty reason", () => {
      const app = new PromotionApplication(defaultPromotionApplicationParams);
      expect(() => app.cancel("")).toThrow("Cancel reason cannot be empty");
    });

    it("should throw error if already cancelled", () => {
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, applicationStatus: "CANCELLED" });
      expect(() => app.cancel("Another reason")).toThrow("Application is already cancelled");
    });
  });

  describe("approve", () => {
    it("should change status to IN_SERVICE", () => {
      const app = new PromotionApplication(defaultPromotionApplicationParams);
      app.approve();
      expect(app.isInService()).toBe(true);
    });

    it("should throw error if status is not APPLYING", () => {
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, applicationStatus: "IN_SERVICE" });
      expect(() => app.approve()).toThrow("Can only approve applications with APPLYING status");
    });

    it("should throw error if payment is not completed", () => {
      const order = new MockPromotionOrder(false, {}) as unknown as PromotionOrder;
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, promotionOrder: order });
      expect(() => app.approve()).toThrow("Cannot approve application without completed payment");
    });
  });

  describe("complete", () => {
    it("should change status to COMPLETED", () => {
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, applicationStatus: "IN_SERVICE" });
      app.complete();
      expect(app.isCompleted()).toBe(true);
    });

    it("should throw error if status is not IN_SERVICE", () => {
      const app = new PromotionApplication(defaultPromotionApplicationParams);
      expect(() => app.complete()).toThrow("Can only complete applications that are in service");
    });
  });

  describe("requestEarlyEnd", () => {
    it("should set early end date and info", () => {
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, applicationStatus: "IN_SERVICE" });
      const earlyEndDate = new Date("2025-11-30");
      const earlyEndInfo: EarlyEndInfo = { requestedBy: "admin", reason: "Budget exhausted" };
      app.requestEarlyEnd(earlyEndInfo, earlyEndDate);
      expect(app.hasEarlyEndDate()).toBe(true);
      expect(app.getEarlyEndDate()).toEqual(earlyEndDate);
      expect(app.getEarlyEndInfo()).toEqual([earlyEndInfo]);
    });

    it("should throw error if status is not IN_SERVICE", () => {
      const app = new PromotionApplication(defaultPromotionApplicationParams);
      expect(() => app.requestEarlyEnd({} as EarlyEndInfo, new Date())).toThrow("Can only request early end for applications in service");
    });

    it("should throw error if early end date is not in the future", () => {
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, applicationStatus: "IN_SERVICE" });
      expect(() => app.requestEarlyEnd({} as EarlyEndInfo, new Date("2022-01-01"))).toThrow("Early end date must be in the future");
    });
  });

  describe("validateConsistency", () => {
    it("should return true if promotion and order types are consistent", () => {
      const app = new PromotionApplication(defaultPromotionApplicationParams);
      expect(app.validateConsistency()).toBe(true);
    });

    it("should return false if promotion types are inconsistent", () => {
      const order = new MockPromotionOrder(true, { promotionType: "POINT_COUPON" }) as unknown as PromotionOrder;
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, promotionOrder: order });
      expect(app.validateConsistency()).toBe(false);
    });

    it("should return false if distribution types are inconsistent", () => {
      const order = new MockPromotionOrder(true, { promotionType: "POINT_PROMOTION", distributionType: "REWARD" }) as unknown as PromotionOrder;
      const app = new PromotionApplication({ ...defaultPromotionApplicationParams, promotionOrder: order });
      expect(app.validateConsistency()).toBe(false);
    });
  });
});
