/**
 * Re-export all promotion types from the main promotion-types.ts file
 */

export type PromotionType = "POINT_COUPON" | "POINT_PROMOTION";
export type ProductType = "STANDARD" | "ADVANCED";
export type DistributionType = "DOWNLOAD" | "REWARD" | "NA";

export type PaidExposureType = "CAROUSEL" | "BANNER" | "LIST";
export type ExposureType = PaidExposureType | "FILTER" | "REWARD_INFO";

export type ExposureAreaType =
  | "MAP_NEARBY_HOT_PLACE"
  | "PROMOTION_HOT"
  | "DETAIL_AD_BANNER"
  | "SEARCH_AD_BANNER"
  | "PROMOTION_TOP_BANNER"
  | "PROMOTION_NEARBY"
  | "SEARCH_NEARBY_HOT_PLACE"
  | "MAP_REWORD_KEYWORD"
  | "MAP_REWORD_FILTER"
  | "ONLINE_LIST_REWARD_FILTER"
  | "PROMOTION_VIEW_MAP"
  | "MAP_REWARD_INFO"
  | "LIST_REWARD_INFO"
  | "DETAIL_PAYMENT_REWARD"
  | "PROMOTION_PROMOTION_LIST"
  | "LINE_PAY_APP_RECOMMENDED_COUPONS"
  | "MAP_MARKETING_PLATFORM_PIN"
  | "BOTTOM_SHEET_LIST";

export type ServiceChannelType =
  | "LINE_WALLET"
  | "LINE_PAY_APP"
  | "LINE_WALLET_LINE_PAY_APP"
  | "LINE_APP_LINE_PAY_APP";

export type FlexibleDaysType = "FLEXIBLE_DATE" | "FIXED_DATE";

export type ExhaustionAlarmPercentages = 50 | 75 | 95;

export type ImageType = "DEFAULT_TEMPLATE" | "DIRECT_UPLOAD";

export type ApplicationRouteType = "MERCHANT_CENTER" | "GOOD_PARTNER" | "ADMIN";

export type PaymentType = "LINE_PAY" | "CREDIT_CARD";

export type OrderStatusType =
  | "PAYMENT_COMPLETED"
  | "REFUND_COMPLETED"
  | "PARTIAL_REFUND_COMPLETED";

export type ApplicationStatus =
  | "APPLYING"
  | "IN_SERVICE"
  | "CANCELLED"
  | "COMPLETED";

export type YesNo = "Y" | "N";

export type ExposureStatus = "ON" | "OFF";

export type CountryType = "TW" | "JP" | "TH" | "ID";

export type ReviewDetailCategoryType = "DESIGN" | "TEXT" | "OTHER";

export type EarlyEndRequestStatusType =
  | "PROCESSING_REQUIRED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELED"
  | "WITHDRAWN"
  | "INVALID_REQUEST";

export type EarlyEndRequestRouteType = "MERCHANT_CENTER" | "GOOD_PARTNER";
export type EarlyEndRequestType =
  | "AD_CONTENT"
  | "EARLY_END"
  | "OA_PUSH_CONTENT";

/**
 * Payment Info interface
 * Contains payment and order details for a promotion application
 */
export interface PaymentInfo {
  orderId: string;
  paymentDate: string;
  promotionType: PromotionType;
  distributionType: DistributionType;
  totalOrderAmount: number;
}

/**
 * Early End Info interface
 * Contains information about early termination of a promotion
 */
export interface EarlyEndInfo {
  marketingEditRequestSeq: number;
  applySeq: number;
  merchantId: string;
  requestStatus: EarlyEndRequestStatusType;
  requestRouteType: EarlyEndRequestRouteType;
  requestType: EarlyEndRequestType;
  rejectReason: string | null;
  completedAt: string | null;
  createdAt: string | null;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}

/**
 * Review Detail interface
 * Contains review information for promotion applications
 */
export interface ReviewDetail {
  exposureType: ExposureType;
  exposureAreaType: ExposureAreaType;
  exposureAreaTypeDesc: string;
  category: ReviewDetailCategoryType;
  title: string | null;
  description: string | null;
  referenceFiles?: {
    name: string | null;
    url: string | null;
  }[];
}

/**
 * Exposure Product interface
 * Represents promotional exposure products for marketing campaigns
 */
export interface ExposureProduct {
  exposureProductApplySeq: number;
  exposureProductSeq: number;
  exposureType: ExposureType;
  exposureAreaType: ExposureAreaType;
  startDate: string;
  endDate: string;
  imageType: ImageType | null;
  imageObsId: string | null;
  imageObsHash: string | null;
  imageUrl: string | null;
  bannerText: string;
  bannerText2: string;
  merchantName: string | null;
  exposureStatus: ExposureStatus;
  exposureTypeDescription: string;
  serviceChannelType: ServiceChannelType;
  serviceChannelTypeDesc: string;
  servicePositionDescription: string;
  exposureAreaTypeDescription: string;
  exposureAreaTypeDesc: string;
  sampleTemplateObsUrl: string;
  unitPrice: number;
}

export type PromotionSavingType = "FIXED_RATE" | "FIXED_POINT";
export type ClientLimitType = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";
