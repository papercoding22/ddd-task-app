import { describe, it, expect, beforeEach } from "vitest";
import { GetPromotionApplicationDetailsUseCase } from "./GetPromotionApplicationDetailsUseCase";
import {
  IPromotionApplicationRepository,
  PromotionApplication,
  PromotionOrder,
  PointPromotion,
  DownloadableCoupon,
  RewardCoupon,
} from "../../domain";
import type {
  ApplicationStatus,
  PaymentInfo,
  PromotionSavingType,
  ClientLimitType,
} from "../../domain/types";

// Mock implementation of IPromotionApplicationRepository
class MockPromotionApplicationRepository
  implements IPromotionApplicationRepository
{
  private applications: PromotionApplication[] = [];

  async save(application: PromotionApplication): Promise<void> {
    this.applications.push(application);
  }

  async findById(applySeq: number): Promise<PromotionApplication | null> {
    return (
      this.applications.find((app) => app.getApplySeq() === applySeq) ?? null
    );
  }

  async findAll(): Promise<PromotionApplication[]> {
    return [...this.applications];
  }

  async delete(applySeq: number): Promise<void> {
    this.applications = this.applications.filter(
      (app) => app.getApplySeq() !== applySeq
    );
  }

  // Test helper methods
  setApplications(applications: PromotionApplication[]): void {
    this.applications = applications;
  }

  clear(): void {
    this.applications = [];
  }
}

// Helper function to create test promotion applications
function createTestPromotionApplication(
  applySeq: number,
  merchantId: string,
  merchantName: string,
  status: ApplicationStatus,
  promotionStartDate: Date,
  promotionEndDate: Date
): PromotionApplication {
  const paymentInfo: PaymentInfo = {
    orderId: `ORDER-${applySeq}`,
    paymentDate: "2025-01-01",
    promotionType: "POINT_PROMOTION",
    distributionType: "NA",
    totalOrderAmount: 10000,
  };

  const promotionOrder = new PromotionOrder({
    orderStatus: "PAYMENT_COMPLETED",
    paymentType: "LINE_PAY",
    paymentDate: new Date("2025-01-01"),
    finalPaymentPrice: 10000,
    paymentInfo,
  });

  const promotion = new PointPromotion({
    title: `Test Promotion ${applySeq}`,
    startDate: promotionStartDate,
    endDate: promotionEndDate,
    promotionType: "POINT_PROMOTION",
    distributionType: "NA",
    productType: "STANDARD",
    imageType: "DEFAULT_TEMPLATE",
    imageObsId: "img-123",
    imageObsHash: "hash-123",
    imageUrl: "https://example.com/image.jpg",
    exhaustionAlarmYn: "Y",
    exhaustionAlarmPercentageList: [50, 75, 95],
    promotionName: `Point Promo ${applySeq}`,
    promotionBudget: 100000,
    promotionSavingType: "FIXED_RATE" as PromotionSavingType,
    promotionSavingRate: 10,
    promotionSavingPoint: null,
    minimumPaymentPriceYn: "Y",
    minimumPaymentPrice: 1000,
    maximumSavingPoint: 5000,
    clientLimitType: "NONE" as ClientLimitType,
    clientLimitTerm: null,
    clientLimitCount: null,
    clientLimitPoint: null,
  });

  return new PromotionApplication({
    applySeq,
    countryType: "TW",
    merchantId,
    merchantName,
    managerEmail: `manager${applySeq}@example.com`,
    applicationRouteType: "MERCHANT_CENTER",
    appliedAt: new Date("2025-01-01"),
    applicationStatus: status,
    appliedByAdmin: "N",
    promotion,
    promotionOrder,
  });
}

function createDownloadableCouponApplication(
  applySeq: number,
  merchantId: string,
  merchantName: string
): PromotionApplication {
  const paymentInfo: PaymentInfo = {
    orderId: `ORDER-${applySeq}`,
    paymentDate: "2025-01-01",
    promotionType: "POINT_COUPON",
    distributionType: "DOWNLOAD",
    totalOrderAmount: 20000,
  };

  const promotionOrder = new PromotionOrder({
    orderStatus: "PAYMENT_COMPLETED",
    paymentType: "CREDIT_CARD",
    paymentDate: new Date("2025-01-01"),
    finalPaymentPrice: 20000,
    paymentInfo,
  });

  const coupon = new DownloadableCoupon({
    title: `Downloadable Coupon ${applySeq}`,
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-12-31"),
    promotionType: "POINT_COUPON",
    distributionType: "DOWNLOAD",
    productType: "STANDARD",
    imageType: "DEFAULT_TEMPLATE",
    imageObsId: "img-456",
    imageObsHash: "hash-456",
    imageUrl: "https://example.com/coupon.jpg",
    exhaustionAlarmYn: "Y",
    exhaustionAlarmPercentageList: [50, 75, 95],
    couponDiscountPrice: 500,
    purchasedCouponQuantity: 1000,
    usedCouponQuantity: 200,
    remainingCouponQuantity: 800,
    fullPaymentYn: "N",
    fullPaymentMinPrice: 0,
    flexibleDaysType: "FLEXIBLE_DAYS",
    flexibleDays: 30,
    couponName: "Test Coupon",
    couponIssuanceQuantity: 1000,
    minimumPaymentPrice: 5000,
    downloadableCouponQuantity: 500,
    downloadedCouponQuantity: 100,
    generalQuantityPerDay: 50,
    downloadableMultiply: 1,
    minDownloadableQuantity: 1,
    multipleIssuedYn: "Y",
  });

  return new PromotionApplication({
    applySeq,
    countryType: "TW",
    merchantId,
    merchantName,
    managerEmail: `manager${applySeq}@example.com`,
    applicationRouteType: "MERCHANT_CENTER",
    appliedAt: new Date("2025-01-01"),
    applicationStatus: "IN_SERVICE",
    appliedByAdmin: "N",
    promotion: coupon,
    promotionOrder,
  });
}

describe("GetPromotionApplicationDetailsUseCase", () => {
  let useCase: GetPromotionApplicationDetailsUseCase;
  let repository: MockPromotionApplicationRepository;

  beforeEach(() => {
    repository = new MockPromotionApplicationRepository();
    useCase = new GetPromotionApplicationDetailsUseCase(repository);
  });

  describe("execute", () => {
    it("should return promotion application when it exists", async () => {
      const app = createTestPromotionApplication(
        12345,
        "M001",
        "Test Merchant",
        "IN_SERVICE",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );

      repository.setApplications([app]);

      const result = await useCase.execute(12345);

      expect(result).not.toBeNull();
      expect(result?.getApplySeq()).toBe(12345);
      expect(result?.getMerchantId()).toBe("M001");
      expect(result?.getMerchantName()).toBe("Test Merchant");
      expect(result?.getApplicationStatus()).toBe("IN_SERVICE");
    });

    it("should return null when promotion application does not exist", async () => {
      const app = createTestPromotionApplication(
        12345,
        "M001",
        "Test Merchant",
        "IN_SERVICE",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );

      repository.setApplications([app]);

      const result = await useCase.execute(99999);

      expect(result).toBeNull();
    });

    it("should return null when repository is empty", async () => {
      const result = await useCase.execute(12345);

      expect(result).toBeNull();
    });

    it("should return correct application among multiple applications", async () => {
      const app1 = createTestPromotionApplication(
        1001,
        "M001",
        "Merchant A",
        "IN_SERVICE",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );
      const app2 = createTestPromotionApplication(
        1002,
        "M002",
        "Merchant B",
        "APPLYING",
        new Date("2025-02-01"),
        new Date("2025-11-30")
      );
      const app3 = createTestPromotionApplication(
        1003,
        "M003",
        "Merchant C",
        "COMPLETED",
        new Date("2025-03-01"),
        new Date("2025-10-31")
      );

      repository.setApplications([app1, app2, app3]);

      const result = await useCase.execute(1002);

      expect(result).not.toBeNull();
      expect(result?.getApplySeq()).toBe(1002);
      expect(result?.getMerchantId()).toBe("M002");
      expect(result?.getMerchantName()).toBe("Merchant B");
      expect(result?.getApplicationStatus()).toBe("APPLYING");
    });

    it("should return downloadable coupon application", async () => {
      const app = createDownloadableCouponApplication(
        23456,
        "M002",
        "Coupon Merchant"
      );

      repository.setApplications([app]);

      const result = await useCase.execute(23456);

      expect(result).not.toBeNull();
      expect(result?.getApplySeq()).toBe(23456);
      expect(result?.getMerchantName()).toBe("Coupon Merchant");

      const promotion = result?.getPromotion() as unknown as DownloadableCoupon;
      expect(promotion.getCouponDiscountPrice()).toBe(500);
    });

    it("should throw error for invalid applySeq (zero)", async () => {
      await expect(useCase.execute(0)).rejects.toThrow(
        "Invalid application sequence number. Must be a positive integer."
      );
    });

    it("should throw error for invalid applySeq (negative)", async () => {
      await expect(useCase.execute(-1)).rejects.toThrow(
        "Invalid application sequence number. Must be a positive integer."
      );
    });

    it("should throw error for invalid applySeq (decimal)", async () => {
      await expect(useCase.execute(123.45)).rejects.toThrow(
        "Invalid application sequence number. Must be a positive integer."
      );
    });

    it("should throw error for invalid applySeq (NaN)", async () => {
      await expect(useCase.execute(NaN)).rejects.toThrow(
        "Invalid application sequence number. Must be a positive integer."
      );
    });
  });

  describe("executeOrThrow", () => {
    it("should return promotion application when it exists", async () => {
      const app = createTestPromotionApplication(
        12345,
        "M001",
        "Test Merchant",
        "IN_SERVICE",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );

      repository.setApplications([app]);

      const result = await useCase.executeOrThrow(12345);

      expect(result).not.toBeNull();
      expect(result.getApplySeq()).toBe(12345);
      expect(result.getMerchantName()).toBe("Test Merchant");
    });

    it("should throw error when promotion application does not exist", async () => {
      const app = createTestPromotionApplication(
        12345,
        "M001",
        "Test Merchant",
        "IN_SERVICE",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );

      repository.setApplications([app]);

      await expect(useCase.executeOrThrow(99999)).rejects.toThrow(
        "Promotion application with ID 99999 not found"
      );
    });

    it("should throw error when repository is empty", async () => {
      await expect(useCase.executeOrThrow(12345)).rejects.toThrow(
        "Promotion application with ID 12345 not found"
      );
    });

    it("should throw error for invalid applySeq before checking existence", async () => {
      const app = createTestPromotionApplication(
        12345,
        "M001",
        "Test Merchant",
        "IN_SERVICE",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );

      repository.setApplications([app]);

      await expect(useCase.executeOrThrow(-1)).rejects.toThrow(
        "Invalid application sequence number. Must be a positive integer."
      );
    });

    it("should return correct application with all properties intact", async () => {
      const app = createTestPromotionApplication(
        12345,
        "M001",
        "Test Merchant",
        "IN_SERVICE",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );

      repository.setApplications([app]);

      const result = await useCase.executeOrThrow(12345);

      expect(result.getApplySeq()).toBe(12345);
      expect(result.getMerchantId()).toBe("M001");
      expect(result.getMerchantName()).toBe("Test Merchant");
      expect(result.getApplicationStatus()).toBe("IN_SERVICE");
      expect(result.getManagerEmail()).toBe("manager12345@example.com");
      expect(result.getCountryType()).toBe("TW");

      const promotion = result.getPromotion() as unknown as PointPromotion;
      expect(promotion.getTitle()).toBe("Test Promotion 12345");
      expect(promotion.getPromotionBudget()).toBe(100000);
    });
  });

  describe("integration scenarios", () => {
    it("should handle multiple calls for same ID consistently", async () => {
      const app = createTestPromotionApplication(
        12345,
        "M001",
        "Test Merchant",
        "IN_SERVICE",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );

      repository.setApplications([app]);

      const result1 = await useCase.execute(12345);
      const result2 = await useCase.execute(12345);

      expect(result1?.getApplySeq()).toBe(result2?.getApplySeq());
      expect(result1?.getMerchantId()).toBe(result2?.getMerchantId());
    });

    it("should work with different promotion types", async () => {
      const pointPromo = createTestPromotionApplication(
        1001,
        "M001",
        "Point Merchant",
        "IN_SERVICE",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );

      const downloadCoupon = createDownloadableCouponApplication(
        1002,
        "M002",
        "Coupon Merchant"
      );

      repository.setApplications([pointPromo, downloadCoupon]);

      const pointResult = await useCase.execute(1001);
      const couponResult = await useCase.execute(1002);

      expect(pointResult).not.toBeNull();
      expect(couponResult).not.toBeNull();
      expect(pointResult?.getPromotion().getPromotionType()).toBe(
        "POINT_PROMOTION"
      );
      expect(couponResult?.getPromotion().getPromotionType()).toBe(
        "POINT_COUPON"
      );
    });

    it("should handle sequential lookups correctly", async () => {
      const apps = [
        createTestPromotionApplication(
          1001,
          "M001",
          "Merchant A",
          "IN_SERVICE",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
        createTestPromotionApplication(
          1002,
          "M002",
          "Merchant B",
          "APPLYING",
          new Date("2025-02-01"),
          new Date("2025-11-30")
        ),
        createTestPromotionApplication(
          1003,
          "M003",
          "Merchant C",
          "COMPLETED",
          new Date("2025-03-01"),
          new Date("2025-10-31")
        ),
      ];

      repository.setApplications(apps);

      const result1 = await useCase.execute(1001);
      const result2 = await useCase.execute(1002);
      const result3 = await useCase.execute(1003);
      const result4 = await useCase.execute(9999);

      expect(result1?.getApplySeq()).toBe(1001);
      expect(result2?.getApplySeq()).toBe(1002);
      expect(result3?.getApplySeq()).toBe(1003);
      expect(result4).toBeNull();
    });

    it("should validate applySeq before repository call", async () => {
      const app = createTestPromotionApplication(
        12345,
        "M001",
        "Test Merchant",
        "IN_SERVICE",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );

      repository.setApplications([app]);

      // These should throw before hitting repository
      await expect(useCase.execute(0)).rejects.toThrow();
      await expect(useCase.execute(-100)).rejects.toThrow();
      await expect(useCase.execute(1.5)).rejects.toThrow();
    });
  });
});
