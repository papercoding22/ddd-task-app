import {
  ApplicationRouteType,
  ApplicationStatus,
  ClientLimitType,
  CountryType,
  DistributionType,
  DownloadableCoupon,
  ExhaustionAlarmPercentages,
  FlexibleDaysType,
  ImageType,
  OrderStatusType,
  PaymentInfo,
  PaymentType,
  PointPromotion,
  ProductType,
  PromotionApplication,
  PromotionOrder,
  PromotionType,
  RewardCoupon,
  YesNo,
  PromotionSavingType,
  ReviewDetail,
  EarlyEndInfo,
} from "../../domain";

import { ApiPromotionDto } from "./ApiPromotionDto";

const mapApiToPointPromotion = (
  promotionData: ApiPromotionDto
): PromotionApplication => {
  const pointPromotionData = promotionData.pointPromotion;

  if (!pointPromotionData) {
    throw new Error("Point promotion data is missing");
  }

  const pointPromotion = new PointPromotion({
    id: promotionData.applySeq.toString(),
    title: pointPromotionData.title,
    startDate: new Date(promotionData.startDate),
    endDate: new Date(promotionData.endDate),
    promotionType: promotionData.promotionType as PromotionType,
    distributionType: promotionData.distributionType as DistributionType,
    productType: promotionData.productType as ProductType,
    imageType: pointPromotionData.imageType as ImageType,
    imageObsId: pointPromotionData.imageObsId,
    imageObsHash: pointPromotionData.imageObsHash,
    imageUrl: pointPromotionData.imageUrl,
    exhaustionAlarmYn: pointPromotionData.exhaustionAlarmYn as YesNo,
    exhaustionAlarmPercentageList:
      pointPromotionData.exhaustionAlarmPercentageList as ExhaustionAlarmPercentages[],
    promotionName: pointPromotionData.promotionName,
    promotionBudget: pointPromotionData.promotionBudget,
    promotionSavingType:
      pointPromotionData.promotionSavingType as PromotionSavingType,
    promotionSavingRate: pointPromotionData.promotionSavingRate,
    promotionSavingPoint: pointPromotionData.promotionSavingPoint,
    minimumPaymentPriceYn: pointPromotionData.minimumPaymentPriceYn as YesNo,
    minimumPaymentPrice: pointPromotionData.minimumPaymentPrice,
    maximumSavingPoint: pointPromotionData.maximumSavingPoint,
    clientLimitType: pointPromotionData.clientLimitType as ClientLimitType,
    clientLimitTerm: pointPromotionData.clientLimitTerm,
    clientLimitCount: pointPromotionData.clientLimitCount,
    clientLimitPoint: pointPromotionData.clientLimitPoint,
    usedPoint: pointPromotionData.usedPoint,
    usedPointPercentage: pointPromotionData.usedPointPercentage,
    remainingPoint: pointPromotionData.remainingPoint,
    remainingPointPercentage: pointPromotionData.remainingPointPercentage,
  });

  const promotionOrder = new PromotionOrder({
    orderStatus: promotionData.orderStatus as OrderStatusType,
    paymentType: promotionData.paymentType as PaymentType,
    paymentDate: new Date(promotionData.paymentDate),
    finalPaymentPrice: promotionData.finalPaymentPrice,
    paymentInfo: promotionData.paymentInfo as PaymentInfo,
  });

  const promotion = new PromotionApplication({
    applySeq: promotionData.applySeq,
    countryType: promotionData.countryType as CountryType,
    merchantId: promotionData.merchantId,
    merchantName: promotionData.merchantName,
    managerEmail: promotionData.managerEmail,
    applicationRouteType:
      promotionData.applicationRouteType as ApplicationRouteType,
    appliedByAdmin: promotionData.appliedByAdmin as YesNo,
    appliedAt: new Date(promotionData.appliedAt),
    applicationStatus: promotionData.applicationStatus as ApplicationStatus,
    reviewDetail: promotionData.reviewDetail as ReviewDetail,
    earlyEndInfo: promotionData.earlyEndInfo as EarlyEndInfo[],
    promotion: pointPromotion,
    promotionOrder: promotionOrder,
  });

  return promotion;
};

const mapApiToDownloadableCoupon = (
  promotionData: ApiPromotionDto
): PromotionApplication => {
  const downloadableCouponData = promotionData.pointCoupon;

  if (!downloadableCouponData) {
    throw new Error("Downloadable coupon data is missing");
  }

  const downloadableCoupon = new DownloadableCoupon({
    id: promotionData.applySeq.toString(),
    title: downloadableCouponData.title,
    startDate: new Date(promotionData.startDate),
    endDate: new Date(promotionData.endDate),
    promotionType: promotionData.promotionType as PromotionType,
    distributionType: promotionData.distributionType as DistributionType,
    productType: promotionData.productType as ProductType,
    imageType: downloadableCouponData.imageType as ImageType,
    imageObsId: downloadableCouponData.imageObsId,
    imageObsHash: downloadableCouponData.imageObsHash,
    imageUrl: downloadableCouponData.imageUrl,
    exhaustionAlarmYn: downloadableCouponData.exhaustionAlarmYn as YesNo,
    exhaustionAlarmPercentageList:
      downloadableCouponData.exhaustionAlarmPercentageList as ExhaustionAlarmPercentages[],
    couponDiscountPrice: downloadableCouponData.couponDiscountPrice,
    purchasedCouponQuantity: downloadableCouponData.purchasedCouponQuantity,
    usedCouponQuantity: downloadableCouponData.usedCouponQuantity,
    remainingCouponQuantity: downloadableCouponData.remainingCouponQuantity,
    fullPaymentYn: downloadableCouponData.fullPaymentYn as YesNo,
    fullPaymentMinPrice: downloadableCouponData.fullPaymentMinPrice,
    flexibleDaysType:
      downloadableCouponData.flexibleDaysType as FlexibleDaysType,
    flexibleDays: downloadableCouponData.flexibleDays,
    couponName: downloadableCouponData.couponName,
    couponIssuanceQuantity: downloadableCouponData.couponIssuanceQuantity,
    minimumPaymentPrice: downloadableCouponData.minimumPaymentPrice,
    downloadableCouponQuantity:
      downloadableCouponData.downloadableCouponQuantity,
    downloadedCouponQuantity: downloadableCouponData.downloadedCouponQuantity,
    generalQuantityPerDay: downloadableCouponData.generalQuantityPerDay,
    downloadableMultiply: downloadableCouponData.downloadableMultiply,
    minDownloadableQuantity: downloadableCouponData.minDownloadableQuantity,
    multipleIssuedYn: downloadableCouponData.multipleIssuedYn as YesNo,
  });

  const promotionOrder = new PromotionOrder({
    orderStatus: promotionData.orderStatus as OrderStatusType,
    paymentType: promotionData.paymentType as PaymentType,
    paymentDate: new Date(promotionData.paymentDate),
    finalPaymentPrice: promotionData.finalPaymentPrice,
    paymentInfo: promotionData.paymentInfo as PaymentInfo,
  });

  const promotion = new PromotionApplication({
    applySeq: promotionData.applySeq,
    countryType: promotionData.countryType as CountryType,
    merchantId: promotionData.merchantId,
    merchantName: promotionData.merchantName,
    managerEmail: promotionData.managerEmail,
    applicationRouteType:
      promotionData.applicationRouteType as ApplicationRouteType,
    appliedByAdmin: promotionData.appliedByAdmin as YesNo,
    appliedAt: new Date(promotionData.appliedAt),
    applicationStatus: promotionData.applicationStatus as ApplicationStatus,
    reviewDetail: promotionData.reviewDetail as ReviewDetail,
    earlyEndInfo: promotionData.earlyEndInfo as EarlyEndInfo[],
    promotion: downloadableCoupon,
    promotionOrder: promotionOrder,
  });

  return promotion;
};

const mapApiToRewardCoupon = (
  promotionData: ApiPromotionDto
): PromotionApplication => {
  const rewardCouponData = promotionData.rewardCoupon;

  if (!rewardCouponData) {
    throw new Error("Reward coupon data is missing");
  }

  const rewardCoupon = new RewardCoupon({
    id: promotionData.applySeq.toString(),
    title: rewardCouponData.title,
    startDate: new Date(promotionData.startDate),
    endDate: new Date(promotionData.endDate),
    promotionType: promotionData.promotionType as PromotionType,
    distributionType: promotionData.distributionType as DistributionType,
    productType: promotionData.productType as ProductType,
    imageType: rewardCouponData.imageType as ImageType,
    imageObsId: rewardCouponData.imageObsId,
    imageObsHash: rewardCouponData.imageObsHash,
    imageUrl: rewardCouponData.imageUrl,
    exhaustionAlarmYn: rewardCouponData.exhaustionAlarmYn as YesNo,
    exhaustionAlarmPercentageList:
      rewardCouponData.exhaustionAlarmPercentageList as ExhaustionAlarmPercentages[],
    couponDiscountPrice: rewardCouponData.couponDiscountPrice,
    purchasedCouponQuantity: rewardCouponData.purchasedCouponQuantity,
    usedCouponQuantity: rewardCouponData.usedCouponQuantity,
    remainingCouponQuantity: rewardCouponData.remainingCouponQuantity,
    fullPaymentYn: rewardCouponData.fullPaymentYn as YesNo,
    fullPaymentMinPrice: rewardCouponData.fullPaymentMinPrice,
    validityPeriodType: rewardCouponData.validityPeriodType as FlexibleDaysType,
    validityPeriodDays: rewardCouponData.validityPeriodDays,
    couponGrantYn: rewardCouponData.couponGrantYn as YesNo,
    couponGrantMinPrice: rewardCouponData.couponGrantMinPrice,
    receivedCouponQuantity: rewardCouponData.receivedCouponQuantity || 0,
  });

  const promotionOrder = new PromotionOrder({
    orderStatus: promotionData.orderStatus as OrderStatusType,
    paymentType: promotionData.paymentType as PaymentType,
    paymentDate: new Date(promotionData.paymentDate),
    finalPaymentPrice: promotionData.finalPaymentPrice,
    paymentInfo: promotionData.paymentInfo as PaymentInfo,
  });

  const promotion = new PromotionApplication({
    applySeq: promotionData.applySeq,
    countryType: promotionData.countryType as CountryType,
    merchantId: promotionData.merchantId,
    merchantName: promotionData.merchantName,
    managerEmail: promotionData.managerEmail,
    applicationRouteType:
      promotionData.applicationRouteType as ApplicationRouteType,
    appliedByAdmin: promotionData.appliedByAdmin as YesNo,
    appliedAt: new Date(promotionData.appliedAt),
    applicationStatus: promotionData.applicationStatus as ApplicationStatus,
    reviewDetail: promotionData.reviewDetail as ReviewDetail,
    earlyEndInfo: promotionData.earlyEndInfo as EarlyEndInfo[],
    promotion: rewardCoupon,
    promotionOrder: promotionOrder,
  });

  return promotion;
};

const FROM_API_DTO_MAPPER_BY_TYPE = {
  POINT_PROMOTION: mapApiToPointPromotion,
  DOWNLOADABLE_COUPON: mapApiToDownloadableCoupon,
  REWARD_COUPON: mapApiToRewardCoupon,
};

const getMapperFromApiDto = (
  promotionType: string,
  distributionType: string
) => {
  switch (promotionType) {
    case "POINT_PROMOTION":
      return FROM_API_DTO_MAPPER_BY_TYPE.POINT_PROMOTION;
    case "POINT_COUPON":
      switch (distributionType) {
        case "DOWNLOAD":
          return FROM_API_DTO_MAPPER_BY_TYPE.DOWNLOADABLE_COUPON;
        case "REWARD":
          return FROM_API_DTO_MAPPER_BY_TYPE.REWARD_COUPON;
        default:
          throw new Error(
            `No mapper found for type: ${promotionType} and distribution: ${distributionType}`
          );
      }
    default:
      throw new Error(
        `No mapper found for type: ${promotionType} and distribution: ${distributionType}`
      );
  }
};

const mapPointPromotionToApi = (
  application: PromotionApplication
): ApiPromotionDto => {
  const promotion = application.getPromotion() as unknown as PointPromotion;
  const order = application.getPromotionOrder();

  return {
    applySeq: application.getApplySeq(),
    countryType: application.getCountryType(),
    merchantId: application.getMerchantId(),
    applicationRouteType: application.getApplicationRouteType(),
    promotionType: promotion.getPromotionType(),
    distributionType: promotion.getDistributionType(),
    productType: promotion.getProductType(),
    startDate: promotion.getStartDate().toISOString(),
    endDate: promotion.getEndDate().toISOString(),
    merchantName: application.getMerchantName(),
    managerEmail: application.getManagerEmail(),
    appliedAt: application.getAppliedAt().toISOString(),
    applicationStatus: application.getApplicationStatus(),
    cancelReason: application.getCancelReason(),
    pointCoupon: null,
    rewardCoupon: null,
    pointPromotion: {
      title: promotion.getTitle(),
      imageType: promotion.getImageType(),
      imageObsId: promotion.getImageObsId(),
      imageObsHash: promotion.getImageObsHash(),
      imageUrl: promotion.getImageUrl(),
      exhaustionAlarmYn: promotion.getExhaustionAlarmYn(),
      exhaustionAlarmPercentageList:
        promotion.getExhaustionAlarmPercentageList(),
      promotionName: promotion.getPromotionName(),
      promotionBudget: promotion.getPromotionBudget(),
      promotionSavingType: promotion.getPromotionSavingType(),
      promotionSavingRate: promotion.getPromotionSavingRate(),
      promotionSavingPoint: promotion.getPromotionSavingPoint(),
      minimumPaymentPriceYn: promotion.getMinimumPaymentPriceYn(),
      minimumPaymentPrice: promotion.getMinimumPaymentPrice(),
      maximumSavingPoint: promotion.getMaximumSavingPoint(),
      clientLimitType: promotion.getClientLimitType(),
      clientLimitTerm: promotion.getClientLimitTerm(),
      clientLimitCount: promotion.getClientLimitCount(),
      clientLimitPoint: promotion.getClientLimitPoint(),
      usedPoint: promotion.getUsedPoint(),
      usedPointPercentage: promotion.getUsedPointPercentage(),
      remainingPoint: promotion.getRemainingPoint(),
      remainingPointPercentage: promotion.getRemainingPointPercentage(),
    },
    exposureProductList: promotion.getExposureProductList(),
    orderStatus: order.getOrderStatus(),
    paymentType: order.getPaymentType(),
    paymentDate: order.getPaymentDate().toISOString(),
    finalPaymentPrice: order.getFinalPaymentPrice(),
    reviewDetail: application.getReviewDetail(),
    paymentInfo: order.getPaymentInfo(),
    earlyEndInfo: application.getEarlyEndInfo(),
    earlyEndDate: application.getEarlyEndDate()?.toISOString() || null,
    appliedByAdmin: application.getAppliedByAdmin(),
  };
};

const mapDownloadableCouponToApi = (
  application: PromotionApplication
): ApiPromotionDto => {
  const promotion = application.getPromotion() as unknown as DownloadableCoupon;
  const order = application.getPromotionOrder();

  return {
    applySeq: application.getApplySeq(),
    countryType: application.getCountryType(),
    merchantId: application.getMerchantId(),
    applicationRouteType: application.getApplicationRouteType(),
    promotionType: promotion.getPromotionType(),
    distributionType: promotion.getDistributionType(),
    productType: promotion.getProductType(),
    startDate: promotion.getStartDate().toISOString(),
    endDate: promotion.getEndDate().toISOString(),
    merchantName: application.getMerchantName(),
    managerEmail: application.getManagerEmail(),
    appliedAt: application.getAppliedAt().toISOString(),
    applicationStatus: application.getApplicationStatus(),
    cancelReason: null,
    pointCoupon: {
      title: promotion.getTitle(),
      imageType: promotion.getImageType(),
      imageObsId: promotion.getImageObsId(),
      imageObsHash: promotion.getImageObsHash(),
      imageUrl: promotion.getImageUrl(),
      exhaustionAlarmYn: promotion.getExhaustionAlarmYn(),
      exhaustionAlarmPercentageList:
        promotion.getExhaustionAlarmPercentageList(),
      couponName: promotion.getCouponName(),
      couponDiscountPrice: promotion.getCouponDiscountPrice(),
      couponIssuanceQuantity: promotion.getCouponIssuanceQuantity(),
      purchasedCouponQuantity: promotion.getPurchasedCouponQuantity(),
      fullPaymentYn: promotion.getFullPaymentYn(),
      minimumPaymentPrice: promotion.getMinimumPaymentPrice(),
      fullPaymentMinPrice: promotion.getFullPaymentMinPrice(),
      flexibleDaysType: promotion.getFlexibleDaysType(),
      flexibleDays: promotion.getFlexibleDays(),
      downloadableCouponQuantity: promotion.getDownloadableCouponQuantity(),
      downloadedCouponQuantity: promotion.getDownloadedCouponQuantity(),
      usedCouponQuantity: promotion.getUsedCouponQuantity(),
      remainingCouponQuantity: promotion.getRemainingCouponQuantity(),
      generalQuantityPerDay: promotion.getGeneralQuantityPerDay(),
      downloadableMultiply: promotion.getDownloadableMultiply(),
      minDownloadableQuantity: promotion.getMinDownloadableQuantity(),
      multipleIssuedYn: promotion.getMultipleIssuedYn(),
    },
    rewardCoupon: null,
    pointPromotion: null,
    exposureProductList: promotion.getExposureProductList(),
    orderStatus: order.getOrderStatus(),
    paymentType: order.getPaymentType(),
    paymentDate: order.getPaymentDate().toISOString(),
    finalPaymentPrice: order.getFinalPaymentPrice(),
    reviewDetail: application.getReviewDetail(),
    paymentInfo: order.getPaymentInfo(),
    earlyEndInfo: application.getEarlyEndInfo(),
    earlyEndDate: application.getEarlyEndDate()?.toISOString() || null,
    appliedByAdmin: application.getAppliedByAdmin(),
  };
};

const mapRewardCouponToApi = (
  application: PromotionApplication
): ApiPromotionDto => {
  const promotion = application.getPromotion() as unknown as RewardCoupon;
  const order = application.getPromotionOrder();

  return {
    applySeq: application.getApplySeq(),
    countryType: application.getCountryType(),
    merchantId: application.getMerchantId(),
    applicationRouteType: application.getApplicationRouteType(),
    promotionType: promotion.getPromotionType(),
    distributionType: promotion.getDistributionType(),
    productType: promotion.getProductType(),
    startDate: promotion.getStartDate().toISOString(),
    endDate: promotion.getEndDate().toISOString(),
    merchantName: application.getMerchantName(),
    managerEmail: application.getManagerEmail(),
    appliedAt: application.getAppliedAt().toISOString(),
    applicationStatus: application.getApplicationStatus(),
    cancelReason: null,
    pointCoupon: null,
    rewardCoupon: {
      title: promotion.getTitle(),
      imageType: promotion.getImageType(),
      imageObsId: promotion.getImageObsId(),
      imageObsHash: promotion.getImageObsHash(),
      imageUrl: promotion.getImageUrl(),
      exhaustionAlarmYn: promotion.getExhaustionAlarmYn(),
      exhaustionAlarmPercentageList:
        promotion.getExhaustionAlarmPercentageList(),
      couponDiscountPrice: promotion.getCouponDiscountPrice(),
      purchasedCouponQuantity: promotion.getPurchasedCouponQuantity(),
      fullPaymentYn: promotion.getFullPaymentYn(),
      fullPaymentMinPrice: promotion.getFullPaymentMinPrice(),
      couponGrantYn: promotion.getCouponGrantYn(),
      couponGrantMinPrice: promotion.getCouponGrantMinPrice(),
      validityPeriodType: promotion.getValidityPeriodType(),
      validityPeriodDays: promotion.getValidityPeriodDays(),
      receivedCouponQuantity: promotion.getReceivedCouponQuantity(),
      usedCouponQuantity: promotion.getUsedCouponQuantity(),
      remainingCouponQuantity: promotion.getRemainingCouponQuantity(),
    },
    pointPromotion: null,
    exposureProductList: promotion.getExposureProductList(),
    orderStatus: order.getOrderStatus(),
    paymentType: order.getPaymentType(),
    paymentDate: order.getPaymentDate().toISOString(),
    finalPaymentPrice: order.getFinalPaymentPrice(),
    reviewDetail: application.getReviewDetail(),
    paymentInfo: order.getPaymentInfo(),
    earlyEndInfo: application.getEarlyEndInfo(),
    earlyEndDate: application.getEarlyEndDate()?.toISOString() || null,
    appliedByAdmin: application.getAppliedByAdmin(),
  };
};

const TO_API_DTO_MAPPER_BY_TYPE = {
  POINT_PROMOTION: mapPointPromotionToApi,
  DOWNLOADABLE_COUPON: mapDownloadableCouponToApi,
  REWARD_COUPON: mapRewardCouponToApi,
};

const getMapperToApiDto = (promotionType: string, distributionType: string) => {
  switch (promotionType) {
    case "POINT_PROMOTION":
      return TO_API_DTO_MAPPER_BY_TYPE.POINT_PROMOTION;
    case "POINT_COUPON":
      switch (distributionType) {
        case "DOWNLOAD":
          return TO_API_DTO_MAPPER_BY_TYPE.DOWNLOADABLE_COUPON;
        case "REWARD":
          return TO_API_DTO_MAPPER_BY_TYPE.REWARD_COUPON;
        default:
          throw new Error(
            `No mapper found for type: ${promotionType} and distribution: ${distributionType}`
          );
      }
    default:
      throw new Error(
        `No mapper found for type: ${promotionType} and distribution: ${distributionType}`
      );
  }
};

export const PromotionApplicationMapper = {
  fromApiDto: (data: ApiPromotionDto): PromotionApplication => {
    const mapper = getMapperFromApiDto(
      data.promotionType,
      data.distributionType
    );
    return mapper(data);
  },
  toApiDto: (application: PromotionApplication): ApiPromotionDto => {
    const promotion = application.getPromotion();
    const mapper = getMapperToApiDto(
      promotion.getPromotionType(),
      promotion.getDistributionType()
    );
    return mapper(application);
  },
};
