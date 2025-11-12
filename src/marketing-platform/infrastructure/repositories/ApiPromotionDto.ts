export interface PointCouponDto {
  title: string;
  imageType: string;
  imageObsId: string;
  imageObsHash: string;
  imageUrl: string;
  exhaustionAlarmYn: string;
  exhaustionAlarmPercentageList: number[];
  couponName: string;
  couponDiscountPrice: number;
  couponIssuanceQuantity: number;
  purchasedCouponQuantity: number;
  fullPaymentYn: string;
  minimumPaymentPrice: number;
  fullPaymentMinPrice: number;
  flexibleDaysType: string;
  flexibleDays: number;
  downloadableCouponQuantity: number;
  downloadedCouponQuantity: number;
  usedCouponQuantity: number;
  remainingCouponQuantity: number;
  generalQuantityPerDay: number;
  downloadableMultiply: number;
  minDownloadableQuantity: number;
  multipleIssuedYn: string;
}

export interface RewardCouponDto {
  title: string;
  imageType: string;
  imageObsId: string;
  imageObsHash: string;
  imageUrl: string;
  exhaustionAlarmYn: string;
  exhaustionAlarmPercentageList: number[];
  couponDiscountPrice: number;
  purchasedCouponQuantity: number;
  fullPaymentYn: string;
  fullPaymentMinPrice: number;
  couponGrantYn: string;
  couponGrantMinPrice: number | null;
  validityPeriodType: string;
  validityPeriodDays: number;
  receivedCouponQuantity: number | null;
  usedCouponQuantity: number;
  remainingCouponQuantity: number;
}

export interface PointPromotionDto {
  title: string;
  imageType: string;
  imageObsId: string;
  imageObsHash: string;
  imageUrl: string;
  exhaustionAlarmYn: string;
  exhaustionAlarmPercentageList: number[];
  promotionName: string;
  promotionBudget: number;
  promotionSavingType: string;
  promotionSavingRate: number | null;
  promotionSavingPoint: number | null;
  minimumPaymentPriceYn: string;
  minimumPaymentPrice: number;
  maximumSavingPoint: number;
  clientLimitType: string;
  clientLimitTerm: number | null;
  clientLimitCount: number | null;
  clientLimitPoint: number | null;
  usedPoint: number;
  usedPointPercentage: number;
  remainingPoint: number;
  remainingPointPercentage: number;
}

export interface ExposureProductDto {
  exposureProductApplySeq: number;
  exposureProductSeq: number;
  exposureType: string;
  exposureAreaType: string;
  startDate: string;
  endDate: string;
  imageType: string | null;
  imageObsId: string | null;
  imageObsHash: string | null;
  imageUrl: string | null;
  bannerText: string;
  bannerText2: string;
  merchantName: string | null;
  exposureStatus: string;
  exposureTypeDescription: string;
  serviceChannelType: string;
  serviceChannelTypeDesc: string;
  servicePositionDescription: string;
  exposureAreaTypeDescription: string;
  exposureAreaTypeDesc: string;
  sampleTemplateObsUrl: string;
  unitPrice: number;
}

export interface PaymentInfoDto {
  orderId: string;
  paymentDate: string;
  promotionType: string;
  distributionType: string;
  totalOrderAmount: number;
}

export interface ReviewDetailDto {
  [key: string]: any;
}

export interface EarlyEndInfoDto {
  [key: string]: any;
}

export interface ApiPromotionDto {
  applySeq: number;
  countryType: string;
  merchantId: string;
  applicationRouteType: string;
  promotionType: string;
  distributionType: string;
  productType: string;
  startDate: string;
  endDate: string;
  merchantName: string;
  managerEmail: string;
  appliedAt: string;
  applicationStatus: string;
  cancelReason: string | null;
  pointCoupon: PointCouponDto | null;
  rewardCoupon: RewardCouponDto | null;
  pointPromotion: PointPromotionDto | null;
  exposureProductList: ExposureProductDto[];
  orderStatus: string;
  paymentType: string;
  paymentDate: string;
  finalPaymentPrice: number;
  reviewDetail: ReviewDetailDto | null;
  paymentInfo: PaymentInfoDto;
  earlyEndInfo: EarlyEndInfoDto[];
  earlyEndDate: string | null;
  appliedByAdmin: string;
}
