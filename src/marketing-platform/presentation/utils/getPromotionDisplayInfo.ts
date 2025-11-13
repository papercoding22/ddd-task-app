import type { PromotionApplication } from "../../domain";
import type { PromotionTypeInfo } from "../components";

export const getPromotionDisplayInfo = (
  application: PromotionApplication
): PromotionTypeInfo => {
  const promotion = application.getPromotion();
  const promotionType = promotion.getPromotionType();
  const distributionType = promotion.getDistributionType();

  if (promotionType === "POINT_PROMOTION" && distributionType === "NA") {
    return {
      type: "Point Promotion",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-400",
      badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-600",
      icon: "💎",
    };
  }

  if (promotionType === "POINT_COUPON" && distributionType === "DOWNLOAD") {
    return {
      type: "Download Coupon",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      borderColor: "border-green-400",
      badgeColor: "bg-gradient-to-r from-green-500 to-emerald-600",
      icon: "🎫",
    };
  }

  if (promotionType === "POINT_COUPON" && distributionType === "REWARD") {
    return {
      type: "Reward",
      bgColor: "bg-gradient-to-br from-purple-50 to-violet-50",
      borderColor: "border-purple-400",
      badgeColor: "bg-gradient-to-r from-purple-500 to-violet-600",
      icon: "🎁",
    };
  }

  return {
    type: "Unknown",
    bgColor: "bg-gradient-to-br from-gray-50 to-slate-50",
    borderColor: "border-gray-400",
    badgeColor: "bg-gradient-to-r from-gray-500 to-slate-600",
    icon: "📋",
  };
};
