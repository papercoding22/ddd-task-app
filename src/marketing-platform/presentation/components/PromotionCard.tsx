import React from "react";
import type { PromotionApplication } from "../../domain";
import {
  PointPromotionCard,
  DownloadableCouponCard,
  RewardCouponCard,
  type PromotionTypeInfo,
} from "./";

interface PromotionCardProps {
  application: PromotionApplication;
  isSelected: boolean;
  onToggle: (applySeq: number) => void;
  typeInfo: PromotionTypeInfo;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({
  application,
  isSelected,
  onToggle,
  typeInfo,
}) => {
  const promotion = application.getPromotion();
  const promotionType = promotion.getPromotionType();
  const distributionType = promotion.getDistributionType();

  const cardProps = {
    application,
    isSelected,
    onToggle,
    typeInfo,
  };

  if (promotionType === "POINT_PROMOTION" && distributionType === "NA") {
    return <PointPromotionCard {...cardProps} />;
  }

  if (promotionType === "POINT_COUPON" && distributionType === "DOWNLOAD") {
    return <DownloadableCouponCard {...cardProps} />;
  }

  if (promotionType === "POINT_COUPON" && distributionType === "REWARD") {
    return <RewardCouponCard {...cardProps} />;
  }

  return (
    <div className="border-2 border-gray-300 rounded-xl p-5 bg-gray-50">
      <h3 className="font-bold text-gray-900">{promotion.getTitle()}</h3>
      <p className="text-sm text-gray-500 mt-1">Unknown promotion type</p>
    </div>
  );
};
