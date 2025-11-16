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
  title: string;

  constructor(startDate: Date, endDate: Date, promotionType: PromotionType, distributionType: DistributionType, title: string = "Default Title") {
    this.startDate = startDate;
    this.endDate = endDate;
    this.promotionType = promotionType;
    this.distributionType = distributionType;
    this.title = title;
  }

  getStartDate = vi.fn(() => this.startDate);
  getEndDate = vi.fn(() => this.endDate);
  getPromotionType = vi.fn(() => this.promotionType);
  getDistributionType = vi.fn(() => this.distributionType);
  updateTitle = vi.fn((title: string) => {
    if (!title || title.trim().length === 0) {
      throw new Error("Title cannot be empty");
    }
    if (title.length > 300) {
      throw new Error("Title cannot exceed 300 characters.");
    }
    this.title = title;
  });
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

  describe("updateTitle", () => {
    it("should update title when application status is APPLYING", () => {
      const promotion = new MockPromotion(
        new Date("2023-01-01"),
        new Date("2023-12-31"),
        "POINT_PROMOTION",
        "NA"
      ) as unknown as Promotion;
      const app = new PromotionApplication({
        ...defaultPromotionApplicationParams,
        applicationStatus: "APPLYING",
        promotion
      });

      app.updateTitle("New Title");

      expect(promotion.updateTitle).toHaveBeenCalledWith("New Title");
      expect(promotion.updateTitle).toHaveBeenCalledTimes(1);
    });

    it("should throw error when application status is IN_SERVICE", () => {
      const app = new PromotionApplication({
        ...defaultPromotionApplicationParams,
        applicationStatus: "IN_SERVICE"
      });

      expect(() => app.updateTitle("New Title")).toThrow(
        "Can only update title when application status is APPLYING"
      );
    });

    it("should throw error when application status is CANCELLED", () => {
      const app = new PromotionApplication({
        ...defaultPromotionApplicationParams,
        applicationStatus: "CANCELLED"
      });

      expect(() => app.updateTitle("New Title")).toThrow(
        "Can only update title when application status is APPLYING"
      );
    });

    it("should throw error when application status is COMPLETED", () => {
      const app = new PromotionApplication({
        ...defaultPromotionApplicationParams,
        applicationStatus: "COMPLETED"
      });

      expect(() => app.updateTitle("New Title")).toThrow(
        "Can only update title when application status is APPLYING"
      );
    });

    it("should propagate error from promotion when title is empty", () => {
      const promotion = new MockPromotion(
        new Date("2023-01-01"),
        new Date("2023-12-31"),
        "POINT_PROMOTION",
        "NA"
      ) as unknown as Promotion;
      const app = new PromotionApplication({
        ...defaultPromotionApplicationParams,
        applicationStatus: "APPLYING",
        promotion
      });

      expect(() => app.updateTitle("")).toThrow("Title cannot be empty");
    });

    it("should propagate error from promotion when title exceeds 300 characters", () => {
      const promotion = new MockPromotion(
        new Date("2023-01-01"),
        new Date("2023-12-31"),
        "POINT_PROMOTION",
        "NA"
      ) as unknown as Promotion;
      const app = new PromotionApplication({
        ...defaultPromotionApplicationParams,
        applicationStatus: "APPLYING",
        promotion
      });

      const longTitle = "a".repeat(301);
      expect(() => app.updateTitle(longTitle)).toThrow("Title cannot exceed 300 characters.");
    });

    it("should allow title update with exactly 300 characters", () => {
      const promotion = new MockPromotion(
        new Date("2023-01-01"),
        new Date("2023-12-31"),
        "POINT_PROMOTION",
        "NA"
      ) as unknown as Promotion;
      const app = new PromotionApplication({
        ...defaultPromotionApplicationParams,
        applicationStatus: "APPLYING",
        promotion
      });

      const maxLengthTitle = "a".repeat(300);
      app.updateTitle(maxLengthTitle);

      expect(promotion.updateTitle).toHaveBeenCalledWith(maxLengthTitle);
    });
  });

  describe("updateMerchantName", () => {
    it("should update merchant name with valid input", () => {
      const app = new PromotionApplication(defaultPromotionApplicationParams);

      app.updateMerchantName("New Merchant Name");

      expect(app.getMerchantName()).toBe("New Merchant Name");
    });

    it("should throw error when merchant name is empty string", () => {
      const app = new PromotionApplication(defaultPromotionApplicationParams);

      expect(() => app.updateMerchantName("")).toThrow("Merchant name cannot be empty");
    });

    it("should throw error when merchant name is only whitespace", () => {
      const app = new PromotionApplication(defaultPromotionApplicationParams);

      expect(() => app.updateMerchantName("   ")).toThrow("Merchant name cannot be empty");
    });

    it("should allow updating merchant name multiple times", () => {
      const app = new PromotionApplication(defaultPromotionApplicationParams);

      app.updateMerchantName("First Name");
      expect(app.getMerchantName()).toBe("First Name");

      app.updateMerchantName("Second Name");
      expect(app.getMerchantName()).toBe("Second Name");
    });

    it("should update merchant name regardless of application status", () => {
      const statuses: ApplicationStatus[] = ["APPLYING", "IN_SERVICE", "CANCELLED", "COMPLETED"];

      statuses.forEach((status) => {
        const app = new PromotionApplication({
          ...defaultPromotionApplicationParams,
          applicationStatus: status
        });

        app.updateMerchantName("Updated Name");

        expect(app.getMerchantName()).toBe("Updated Name");
      });
    });

    it("should trim leading and trailing whitespace from merchant name", () => {
      const app = new PromotionApplication(defaultPromotionApplicationParams);

      app.updateMerchantName("  Merchant Name  ");

      expect(app.getMerchantName()).toBe("Merchant Name");
    });
  });
});
