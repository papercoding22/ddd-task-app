import { describe, it, expect } from "vitest";
import { getPromotionDisplayInfo } from "../getPromotionDisplayInfo";
import type { PromotionApplication } from "../../../domain";

// Mock Promotion class
class MockPromotion {
  private type: string;
  private distribution: string;

  constructor(type: string, distribution: string) {
    this.type = type;
    this.distribution = distribution;
  }

  getPromotionType(): string {
    return this.type;
  }

  getDistributionType(): string {
    return this.distribution;
  }
}

// Mock PromotionApplication class
class MockPromotionApplication {
  private promotion: MockPromotion;

  constructor(promotion: MockPromotion) {
    this.promotion = promotion;
  }

  getPromotion(): MockPromotion {
    return this.promotion;
  }
}

describe("getPromotionDisplayInfo", () => {
  it("should return correct info for POINT_PROMOTION and NA", () => {
    const mockPromotion = new MockPromotion("POINT_PROMOTION", "NA");
    const mockApplication = new MockPromotionApplication(mockPromotion);

    const result = getPromotionDisplayInfo(
      mockApplication as unknown as PromotionApplication
    );

    expect(result).toEqual({
      type: "Point Promotion",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-400",
      badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-600",
      icon: "💎",
    });
  });

  it("should return correct info for POINT_COUPON and DOWNLOAD", () => {
    const mockPromotion = new MockPromotion("POINT_COUPON", "DOWNLOAD");
    const mockApplication = new MockPromotionApplication(mockPromotion);

    const result = getPromotionDisplayInfo(
      mockApplication as unknown as PromotionApplication
    );

    expect(result).toEqual({
      type: "Download Coupon",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      borderColor: "border-green-400",
      badgeColor: "bg-gradient-to-r from-green-500 to-emerald-600",
      icon: "🎫",
    });
  });

  it("should return correct info for POINT_COUPON and REWARD", () => {
    const mockPromotion = new MockPromotion("POINT_COUPON", "REWARD");
    const mockApplication = new MockPromotionApplication(mockPromotion);

    const result = getPromotionDisplayInfo(
      mockApplication as unknown as PromotionApplication
    );

    expect(result).toEqual({
      type: "Reward",
      bgColor: "bg-gradient-to-br from-purple-50 to-violet-50",
      borderColor: "border-purple-400",
      badgeColor: "bg-gradient-to-r from-purple-500 to-violet-600",
      icon: "🎁",
    });
  });

  it("should return default info for unknown promotion types", () => {
    const mockPromotion = new MockPromotion(
      "UNKNOWN_TYPE",
      "UNKNOWN_DISTRIBUTION"
    );
    const mockApplication = new MockPromotionApplication(mockPromotion);

    const result = getPromotionDisplayInfo(
      mockApplication as unknown as PromotionApplication
    );

    expect(result).toEqual({
      type: "Unknown",
      bgColor: "bg-gradient-to-br from-gray-50 to-slate-50",
      borderColor: "border-gray-400",
      badgeColor: "bg-gradient-to-r from-gray-500 to-slate-600",
      icon: "📋",
    });
  });
});
