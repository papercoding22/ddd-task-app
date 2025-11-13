import React from "react";
import type { PromotionApplication, PointPromotion } from "../../domain";
import {
  PromotionCardWrapper,
  SelectionCheckbox,
  CardHeader,
  MerchantInfo,
  StatItem,
  DateRange,
  StatusIndicators,
  type PromotionTypeInfo,
} from "./";

interface PointPromotionCardProps {
  application: PromotionApplication;
  isSelected: boolean;
  onToggle: (applySeq: number) => void;
  typeInfo: PromotionTypeInfo;
}

export const PointPromotionCard: React.FC<PointPromotionCardProps> = ({
  application,
  isSelected,
  onToggle,
  typeInfo,
}) => {
  const promotion = application.getPromotion() as unknown as PointPromotion;

  return (
    <PromotionCardWrapper
      isSelected={isSelected}
      onClick={() => onToggle(application.getApplySeq())}
      typeInfo={typeInfo}
    >
      <SelectionCheckbox isSelected={isSelected} />

      <CardHeader
        icon={typeInfo.icon}
        title={promotion.getTitle()}
        typeInfo={typeInfo}
        status={application.getApplicationStatus()}
      />

      <MerchantInfo merchantName={application.getMerchantName()} />

      <div className="grid grid-cols-2 gap-3">
        <StatItem
          label="Budget"
          value={`${promotion.getPromotionBudget().toLocaleString()} pts`}
        />
        <StatItem
          label="Remaining"
          value={`${promotion.getRemainingPoint().toLocaleString()} pts`}
        />
        <StatItem
          label="Usage"
          value={
            <span className="flex items-baseline gap-1">
              {promotion.getUsedPointPercentage().toFixed(1)}%
              <span className="text-xs text-gray-500">used</span>
            </span>
          }
        />
        <StatItem
          label="Saving Type"
          value={
            promotion.getPromotionSavingType() === "FIXED_RATE"
              ? `${promotion.getPromotionSavingRate()}%`
              : "Fixed"
          }
        />
      </div>

      <DateRange
        startDate={promotion.getStartDate()}
        endDate={promotion.getEndDate()}
      />

      <StatusIndicators
        isActive={application.isActive()}
        secondaryStatus={{
          isPositive: promotion.hasSufficientPoints(100),
          label: promotion.hasSufficientPoints(100)
            ? "Points Available"
            : "Low Points",
        }}
      />
    </PromotionCardWrapper>
  );
};
