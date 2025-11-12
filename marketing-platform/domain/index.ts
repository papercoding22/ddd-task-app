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
export { IPromotionApplicationRepository } from "./repositories/IPromotionApplicationRepository";

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
