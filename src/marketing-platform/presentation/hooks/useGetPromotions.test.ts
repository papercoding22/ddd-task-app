import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useGetPromotions } from "./useGetPromotions";
import {
  PromotionApplication,
  PromotionOrder,
  PointPromotion,
} from "../../domain";
import type { IPromotionApplicationRepository } from "../../domain";
import type {
  PaymentInfo,
  PromotionSavingType,
  ClientLimitType,
} from "../../domain/types";
import { ServiceContainer } from "../../infrastructure";

// Mock the ServiceContainer
vi.mock("../../infrastructure", () => ({
  ServiceContainer: {
    getInstance: vi.fn(),
  },
}));

// Helper function to create test promotion application
function createTestPromotionApplication(
  applySeq: number,
  merchantId: string,
  merchantName: string,
  status: "APPLYING" | "IN_SERVICE" | "COMPLETED" | "CANCELLED",
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

describe("useGetPromotions", () => {
  let mockRepository: IPromotionApplicationRepository;
  let mockGetAllPromotionsUseCase: any;
  let mockContainer: any;
  let testPromotions: PromotionApplication[];

  beforeEach(() => {
    // Create test data
    testPromotions = [
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
        new Date("2025-01-01"),
        new Date("2025-12-31")
      ),
      createTestPromotionApplication(
        1003,
        "M003",
        "Merchant C",
        "COMPLETED",
        new Date("2025-01-01"),
        new Date("2025-12-31")
      ),
    ];

    // Mock use case
    mockGetAllPromotionsUseCase = {
      execute: vi.fn().mockResolvedValue(testPromotions),
      getActivePromotions: vi.fn().mockResolvedValue([testPromotions[0]]),
      getByStatus: vi.fn().mockImplementation((status) => {
        return Promise.resolve(
          testPromotions.filter((p) => p.getApplicationStatus() === status)
        );
      }),
      getByMerchant: vi.fn().mockImplementation((merchantId) => {
        return Promise.resolve(
          testPromotions.filter((p) => p.getMerchantId() === merchantId)
        );
      }),
    };

    // Mock container
    mockContainer = {
      getGetAllPromotionsUseCase: vi
        .fn()
        .mockReturnValue(mockGetAllPromotionsUseCase),
    };

    // Setup ServiceContainer mock
    (ServiceContainer.getInstance as any).mockReturnValue(mockContainer);
  });

  describe("Initialization and auto-load", () => {
    it("should auto-load promotions on mount by default", async () => {
      const { result } = renderHook(() => useGetPromotions());

      // Initially loading
      expect(result.current.loading).toBe(true);

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should have loaded promotions
      expect(result.current.promotions).toHaveLength(3);
      expect(result.current.error).toBeNull();
      expect(mockGetAllPromotionsUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it("should not auto-load when autoLoad is false", async () => {
      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      // Should not be loading
      expect(result.current.loading).toBe(false);
      expect(result.current.promotions).toHaveLength(0);
      expect(mockGetAllPromotionsUseCase.execute).not.toHaveBeenCalled();
    });

    it("should initialize with empty state", () => {
      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      expect(result.current.promotions).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("fetchAllPromotions", () => {
    it("should fetch all promotions successfully", async () => {
      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      let fetchedPromotions: PromotionApplication[] = [];

      await act(async () => {
        fetchedPromotions = await result.current.fetchAllPromotions();
      });

      expect(result.current.promotions).toHaveLength(3);
      expect(fetchedPromotions).toHaveLength(3);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockGetAllPromotionsUseCase.execute).toHaveBeenCalled();
    });

    it("should set loading state during fetch", async () => {
      // Make the use case return a promise that resolves after a delay
      let resolvePromise: (value: PromotionApplication[]) => void;
      const delayedPromise = new Promise<PromotionApplication[]>((resolve) => {
        resolvePromise = resolve;
      });
      mockGetAllPromotionsUseCase.execute.mockReturnValueOnce(delayedPromise);

      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      // Start the fetch
      act(() => {
        result.current.fetchAllPromotions();
      });

      // Loading should be true immediately after starting
      expect(result.current.loading).toBe(true);

      // Resolve the promise
      act(() => {
        resolvePromise!(testPromotions);
      });

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should handle fetch errors", async () => {
      const errorMessage = "Network error";
      mockGetAllPromotionsUseCase.execute.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      await act(async () => {
        try {
          await result.current.fetchAllPromotions();
        } catch (err) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
      expect(result.current.promotions).toHaveLength(0);
    });
  });

  describe("fetchActivePromotions", () => {
    it("should fetch only active promotions", async () => {
      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      let activePromotions: PromotionApplication[] = [];

      await act(async () => {
        activePromotions = await result.current.fetchActivePromotions();
      });

      expect(result.current.promotions).toHaveLength(1);
      expect(activePromotions).toHaveLength(1);
      expect(result.current.promotions[0].getApplySeq()).toBe(1001);
      expect(result.current.error).toBeNull();
      expect(mockGetAllPromotionsUseCase.getActivePromotions).toHaveBeenCalled();
    });

    it("should pass custom date to getActivePromotions", async () => {
      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      const customDate = new Date("2025-06-15");

      await act(async () => {
        await result.current.fetchActivePromotions(customDate);
      });

      expect(
        mockGetAllPromotionsUseCase.getActivePromotions
      ).toHaveBeenCalledWith(customDate);
    });

    it("should handle errors when fetching active promotions", async () => {
      const errorMessage = "Failed to fetch active";
      mockGetAllPromotionsUseCase.getActivePromotions.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      await act(async () => {
        try {
          await result.current.fetchActivePromotions();
        } catch (err) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe("fetchByStatus", () => {
    it("should fetch promotions by APPLYING status", async () => {
      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      await act(async () => {
        await result.current.fetchByStatus("APPLYING");
      });

      expect(result.current.promotions).toHaveLength(1);
      expect(result.current.promotions[0].getApplicationStatus()).toBe(
        "APPLYING"
      );
      expect(mockGetAllPromotionsUseCase.getByStatus).toHaveBeenCalledWith(
        "APPLYING"
      );
    });

    it("should fetch promotions by IN_SERVICE status", async () => {
      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      await act(async () => {
        await result.current.fetchByStatus("IN_SERVICE");
      });

      expect(result.current.promotions).toHaveLength(1);
      expect(result.current.promotions[0].getApplicationStatus()).toBe(
        "IN_SERVICE"
      );
    });

    it("should fetch promotions by COMPLETED status", async () => {
      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      await act(async () => {
        await result.current.fetchByStatus("COMPLETED");
      });

      expect(result.current.promotions).toHaveLength(1);
      expect(result.current.promotions[0].getApplicationStatus()).toBe(
        "COMPLETED"
      );
    });

    it("should handle errors when fetching by status", async () => {
      const errorMessage = "Status fetch failed";
      mockGetAllPromotionsUseCase.getByStatus.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      await act(async () => {
        try {
          await result.current.fetchByStatus("IN_SERVICE");
        } catch (err) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe("fetchByMerchant", () => {
    it("should fetch promotions for specific merchant", async () => {
      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      await act(async () => {
        await result.current.fetchByMerchant("M001");
      });

      expect(result.current.promotions).toHaveLength(1);
      expect(result.current.promotions[0].getMerchantId()).toBe("M001");
      expect(mockGetAllPromotionsUseCase.getByMerchant).toHaveBeenCalledWith(
        "M001"
      );
    });

    it("should return empty array for non-existent merchant", async () => {
      mockGetAllPromotionsUseCase.getByMerchant.mockResolvedValueOnce([]);

      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      await act(async () => {
        await result.current.fetchByMerchant("M999");
      });

      expect(result.current.promotions).toHaveLength(0);
    });

    it("should handle errors when fetching by merchant", async () => {
      const errorMessage = "Merchant fetch failed";
      mockGetAllPromotionsUseCase.getByMerchant.mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      await act(async () => {
        try {
          await result.current.fetchByMerchant("M001");
        } catch (err) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe("Utility methods", () => {
    it("should refresh promotions", async () => {
      const { result } = renderHook(() => useGetPromotions());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear the mock call count
      mockGetAllPromotionsUseCase.execute.mockClear();

      await act(async () => {
        await result.current.refresh();
      });

      expect(mockGetAllPromotionsUseCase.execute).toHaveBeenCalledTimes(1);
      expect(result.current.promotions).toHaveLength(3);
    });

    it("should clear error", async () => {
      mockGetAllPromotionsUseCase.execute.mockRejectedValueOnce(
        new Error("Test error")
      );

      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      // Trigger an error
      await act(async () => {
        try {
          await result.current.fetchAllPromotions();
        } catch (err) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBeTruthy();

      // Clear the error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it("should reset hook state", async () => {
      const { result } = renderHook(() => useGetPromotions());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.promotions).toHaveLength(3);

      // Reset the state
      act(() => {
        result.current.reset();
      });

      expect(result.current.promotions).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  describe("Multiple sequential operations", () => {
    it("should handle multiple fetch operations in sequence", async () => {
      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      // Fetch all
      await act(async () => {
        await result.current.fetchAllPromotions();
      });
      expect(result.current.promotions).toHaveLength(3);

      // Fetch by status
      await act(async () => {
        await result.current.fetchByStatus("IN_SERVICE");
      });
      expect(result.current.promotions).toHaveLength(1);

      // Fetch by merchant
      await act(async () => {
        await result.current.fetchByMerchant("M001");
      });
      expect(result.current.promotions).toHaveLength(1);
    });

    it("should clear error on successful fetch after error", async () => {
      const { result } = renderHook(() =>
        useGetPromotions({ autoLoad: false })
      );

      // First call fails
      mockGetAllPromotionsUseCase.execute.mockRejectedValueOnce(
        new Error("Network error")
      );

      await act(async () => {
        try {
          await result.current.fetchAllPromotions();
        } catch (err) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBeTruthy();

      // Second call succeeds
      mockGetAllPromotionsUseCase.execute.mockResolvedValueOnce(
        testPromotions
      );

      await act(async () => {
        await result.current.fetchAllPromotions();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.promotions).toHaveLength(3);
    });
  });
});
