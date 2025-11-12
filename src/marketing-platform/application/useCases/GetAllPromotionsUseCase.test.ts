import { describe, it, expect, beforeEach } from "vitest";
import { GetAllPromotionsUseCase } from "./GetAllPromotionsUseCase";
import {
  IPromotionApplicationRepository,
  PromotionApplication,
  PromotionOrder,
  PointPromotion,
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

describe("GetAllPromotionsUseCase", () => {
  let useCase: GetAllPromotionsUseCase;
  let repository: MockPromotionApplicationRepository;

  beforeEach(() => {
    repository = new MockPromotionApplicationRepository();
    useCase = new GetAllPromotionsUseCase(repository);
  });

  describe("execute", () => {
    it("should return empty array when no promotions exist", async () => {
      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return all promotion applications", async () => {
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

      const result = await useCase.execute();

      expect(result).toHaveLength(3);
      expect(result[0].getApplySeq()).toBe(1001);
      expect(result[1].getApplySeq()).toBe(1002);
      expect(result[2].getApplySeq()).toBe(1003);
    });

    it("should return all promotions with different statuses", async () => {
      const apps = [
        createTestPromotionApplication(
          1,
          "M001",
          "Merchant 1",
          "APPLYING",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
        createTestPromotionApplication(
          2,
          "M002",
          "Merchant 2",
          "IN_SERVICE",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
        createTestPromotionApplication(
          3,
          "M003",
          "Merchant 3",
          "COMPLETED",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
        createTestPromotionApplication(
          4,
          "M004",
          "Merchant 4",
          "CANCELLED",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
      ];

      repository.setApplications(apps);

      const result = await useCase.execute();

      expect(result).toHaveLength(4);
      expect(result.map((app) => app.getApplicationStatus())).toEqual([
        "APPLYING",
        "IN_SERVICE",
        "COMPLETED",
        "CANCELLED",
      ]);
    });
  });

  describe("getActivePromotions", () => {
    it("should return only active promotions", async () => {
      const currentDate = new Date("2025-06-15");

      // Active: IN_SERVICE and within date range
      const activeApp = createTestPromotionApplication(
        1001,
        "M001",
        "Active Merchant",
        "IN_SERVICE",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );

      // Not active: Wrong status
      const applyingApp = createTestPromotionApplication(
        1002,
        "M002",
        "Applying Merchant",
        "APPLYING",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );

      // Not active: Completed
      const completedApp = createTestPromotionApplication(
        1003,
        "M003",
        "Completed Merchant",
        "COMPLETED",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );

      // Not active: Not started yet
      const futureApp = createTestPromotionApplication(
        1004,
        "M004",
        "Future Merchant",
        "IN_SERVICE",
        new Date("2025-07-01"),
        new Date("2025-12-31")
      );

      // Not active: Already ended
      const pastApp = createTestPromotionApplication(
        1005,
        "M005",
        "Past Merchant",
        "IN_SERVICE",
        new Date("2025-01-01"),
        new Date("2025-05-31")
      );

      repository.setApplications([
        activeApp,
        applyingApp,
        completedApp,
        futureApp,
        pastApp,
      ]);

      const result = await useCase.getActivePromotions(currentDate);

      expect(result).toHaveLength(1);
      expect(result[0].getApplySeq()).toBe(1001);
      expect(result[0].isActive(currentDate)).toBe(true);
    });

    it("should use current date by default", async () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // 1 year ago
      const futureDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year ahead

      const activeApp = createTestPromotionApplication(
        1001,
        "M001",
        "Active Now",
        "IN_SERVICE",
        pastDate,
        futureDate
      );

      repository.setApplications([activeApp]);

      const result = await useCase.getActivePromotions();

      expect(result).toHaveLength(1);
    });

    it("should return empty array when no active promotions exist", async () => {
      const currentDate = new Date("2025-06-15");

      const app1 = createTestPromotionApplication(
        1001,
        "M001",
        "Applying",
        "APPLYING",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );

      repository.setApplications([app1]);

      const result = await useCase.getActivePromotions(currentDate);

      expect(result).toEqual([]);
    });

    it("should return multiple active promotions", async () => {
      const currentDate = new Date("2025-06-15");

      const app1 = createTestPromotionApplication(
        1001,
        "M001",
        "Active 1",
        "IN_SERVICE",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      );
      const app2 = createTestPromotionApplication(
        1002,
        "M002",
        "Active 2",
        "IN_SERVICE",
        new Date("2025-03-01"),
        new Date("2025-09-30")
      );
      const app3 = createTestPromotionApplication(
        1003,
        "M003",
        "Active 3",
        "IN_SERVICE",
        new Date("2025-06-01"),
        new Date("2025-08-31")
      );

      repository.setApplications([app1, app2, app3]);

      const result = await useCase.getActivePromotions(currentDate);

      expect(result).toHaveLength(3);
      expect(result.every((app) => app.isActive(currentDate))).toBe(true);
    });
  });

  describe("getByStatus", () => {
    beforeEach(() => {
      const apps = [
        createTestPromotionApplication(
          1001,
          "M001",
          "Merchant 1",
          "APPLYING",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
        createTestPromotionApplication(
          1002,
          "M002",
          "Merchant 2",
          "IN_SERVICE",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
        createTestPromotionApplication(
          1003,
          "M003",
          "Merchant 3",
          "IN_SERVICE",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
        createTestPromotionApplication(
          1004,
          "M004",
          "Merchant 4",
          "COMPLETED",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
        createTestPromotionApplication(
          1005,
          "M005",
          "Merchant 5",
          "CANCELLED",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
      ];
      repository.setApplications(apps);
    });

    it("should return only APPLYING promotions", async () => {
      const result = await useCase.getByStatus("APPLYING");

      expect(result).toHaveLength(1);
      expect(result[0].getApplySeq()).toBe(1001);
      expect(result[0].getApplicationStatus()).toBe("APPLYING");
    });

    it("should return only IN_SERVICE promotions", async () => {
      const result = await useCase.getByStatus("IN_SERVICE");

      expect(result).toHaveLength(2);
      expect(result[0].getApplySeq()).toBe(1002);
      expect(result[1].getApplySeq()).toBe(1003);
      expect(result.every((app) => app.getApplicationStatus() === "IN_SERVICE")).toBe(
        true
      );
    });

    it("should return only COMPLETED promotions", async () => {
      const result = await useCase.getByStatus("COMPLETED");

      expect(result).toHaveLength(1);
      expect(result[0].getApplySeq()).toBe(1004);
      expect(result[0].getApplicationStatus()).toBe("COMPLETED");
    });

    it("should return only CANCELLED promotions", async () => {
      const result = await useCase.getByStatus("CANCELLED");

      expect(result).toHaveLength(1);
      expect(result[0].getApplySeq()).toBe(1005);
      expect(result[0].getApplicationStatus()).toBe("CANCELLED");
    });

    it("should return empty array when no promotions match status", async () => {
      repository.clear();

      const result = await useCase.getByStatus("APPLYING");

      expect(result).toEqual([]);
    });
  });

  describe("getByMerchant", () => {
    beforeEach(() => {
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
          "M001",
          "Merchant A",
          "APPLYING",
          new Date("2025-02-01"),
          new Date("2025-11-30")
        ),
        createTestPromotionApplication(
          1003,
          "M002",
          "Merchant B",
          "IN_SERVICE",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
        createTestPromotionApplication(
          1004,
          "M001",
          "Merchant A",
          "COMPLETED",
          new Date("2024-01-01"),
          new Date("2024-12-31")
        ),
      ];
      repository.setApplications(apps);
    });

    it("should return all promotions for a specific merchant", async () => {
      const result = await useCase.getByMerchant("M001");

      expect(result).toHaveLength(3);
      expect(result.every((app) => app.getMerchantId() === "M001")).toBe(true);
      expect(result.map((app) => app.getApplySeq())).toEqual([1001, 1002, 1004]);
    });

    it("should return promotions for different merchant", async () => {
      const result = await useCase.getByMerchant("M002");

      expect(result).toHaveLength(1);
      expect(result[0].getApplySeq()).toBe(1003);
      expect(result[0].getMerchantId()).toBe("M002");
    });

    it("should return empty array for non-existent merchant", async () => {
      const result = await useCase.getByMerchant("M999");

      expect(result).toEqual([]);
    });

    it("should return merchant promotions with various statuses", async () => {
      const result = await useCase.getByMerchant("M001");

      expect(result).toHaveLength(3);
      expect(result.map((app) => app.getApplicationStatus())).toEqual([
        "IN_SERVICE",
        "APPLYING",
        "COMPLETED",
      ]);
    });
  });

  describe("integration scenarios", () => {
    it("should handle complex query combinations", async () => {
      const currentDate = new Date("2025-06-15");

      const apps = [
        // M001 - Active
        createTestPromotionApplication(
          1001,
          "M001",
          "Merchant A",
          "IN_SERVICE",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
        // M001 - Applying
        createTestPromotionApplication(
          1002,
          "M001",
          "Merchant A",
          "APPLYING",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
        // M002 - Active
        createTestPromotionApplication(
          1003,
          "M002",
          "Merchant B",
          "IN_SERVICE",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
        // M002 - Completed
        createTestPromotionApplication(
          1004,
          "M002",
          "Merchant B",
          "COMPLETED",
          new Date("2024-01-01"),
          new Date("2024-12-31")
        ),
      ];

      repository.setApplications(apps);

      // Get all promotions
      const all = await useCase.execute();
      expect(all).toHaveLength(4);

      // Get active promotions
      const active = await useCase.getActivePromotions(currentDate);
      expect(active).toHaveLength(2);
      expect(active.map((app) => app.getApplySeq())).toEqual([1001, 1003]);

      // Get IN_SERVICE promotions
      const inService = await useCase.getByStatus("IN_SERVICE");
      expect(inService).toHaveLength(2);

      // Get M001 promotions
      const merchantPromotions = await useCase.getByMerchant("M001");
      expect(merchantPromotions).toHaveLength(2);
    });

    it("should return consistent results across multiple calls", async () => {
      const apps = [
        createTestPromotionApplication(
          1001,
          "M001",
          "Merchant A",
          "IN_SERVICE",
          new Date("2025-01-01"),
          new Date("2025-12-31")
        ),
      ];

      repository.setApplications(apps);

      const result1 = await useCase.execute();
      const result2 = await useCase.execute();

      expect(result1).toHaveLength(result2.length);
      expect(result1[0].getApplySeq()).toBe(result2[0].getApplySeq());
    });
  });
});
