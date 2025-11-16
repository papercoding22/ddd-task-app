/**
 * Main entry point for the Marketing Platform domain model
 * Exports all entities, exceptions, and types
 */

// Entities
export { Promotion } from "./entities/Promotion";
export { Coupon } from "./entities/Coupon";
export { PointPromotion } from "./entities/PointPromotion";
export { DownloadableCoupon } from "./entities/DownloadableCoupon";
export { RewardCoupon } from "./entities/RewardCoupon";
export { PromotionOrder } from "./entities/PromotionOrder";
export { PromotionApplication } from "./entities/PromotionApplication";

// AI Entities and Value Objects
export { AIBudgetSettings } from "./entities/AI/AIBudgetSettings";
export { AICouponBudgetSettings } from "./entities/AI/AICouponBudgetSettings";
export { AIDownloadableCouponBudgetSettings } from "./entities/AI/AIDownloadableCouponBudgetSettings";
export { AIPointBudgetSettings } from "./entities/AI/AIPointBudgetSettings";
export { AIRewardCouponBudgetSettings } from "./entities/AI/AIRewardCouponBudgetSettings";
export { AIBudgetOptions } from "./entities/AI/AIBudgetOptions";
export { AIPromotionPreset } from "./entities/AI/AIPromotionPreset";

// Exceptions
export {
  PromotionDomainException,
  InvalidPromotionDateException,
  PromotionNotActiveException,
  InsufficientBudgetException,
  MinimumPaymentNotMetException,
  InvalidPercentageException,
  InvalidCouponQuantityException,
  CouponExpiredException,
  DownloadLimitExceededException,
  InvalidPointCalculationException,
} from "./exceptions/PromotionExceptions";

// Repositories
export type { IPromotionApplicationRepository } from "./repositories/IPromotionApplicationRepository";

// Types
export type {
  PromotionType,
  ProductType,
  DistributionType,
  PaidExposureType,
  ExposureType,
  ExposureAreaType,
  ServiceChannelType,
  FlexibleDaysType,
  ExhaustionAlarmPercentages,
  ImageType,
  ApplicationRouteType,
  PaymentType,
  OrderStatusType,
  ApplicationStatus,
  YesNo,
  ExposureStatus,
  ExposureProduct,
  CountryType,
  PaymentInfo,
  EarlyEndInfo,
  ReviewDetail,
  PromotionSavingType,
  ClientLimitType,
} from "./types";
