import { DistributionType } from "../../types";

/**
 * A.I Recommended Budget Settings Value Object
 * Base class for different budget settings
 */
export abstract class AIBudgetSettings {
  private readonly distributionType: DistributionType;

  constructor(params: { distributionType: DistributionType }) {
    this.distributionType = params.distributionType;
  }

  public getDistributionType(): DistributionType {
    return this.distributionType;
  }

  public isPointPromotionBudget(): boolean {
    return this.distributionType === "NA";
  }

  public isCouponPromotionBudget(): boolean {
    return (
      this.distributionType === "DOWNLOAD" || this.distributionType === "REWARD"
    );
  }

  public isDownloadableCouponPromotionBudget(): boolean {
    return this.distributionType === "DOWNLOAD";
  }

  public isRewardCouponPromotionBudget(): boolean {
    return this.distributionType === "REWARD";
  }
}
