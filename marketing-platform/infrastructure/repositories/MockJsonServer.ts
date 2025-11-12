import {
  IPromotionApplicationRepository,
  PromotionApplication,
} from "../../domain";
import downloadableCouponDetails from "../../tmp/downloadable-coupon-details.json";
import pointPromotionDetails from "../../tmp/point-promotion-details.json";
import rewardCouponDetails from "../../tmp/reward-coupon-details.json";
import { ApiPromotionDto } from "./ApiPromotionDto";
import { PromotionApplicationMapper } from "./PromotionApplicationMapper";

const MOCK_DATA_BY_ID: {
  [applySeq: number]: ApiPromotionDto;
} = {
  1001: pointPromotionDetails,
  1002: downloadableCouponDetails,
  1003: rewardCouponDetails,
} as const;

type ServerData = unknown;

export class MockJsonServer implements IPromotionApplicationRepository {
  save(application: PromotionApplication): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findById(applySeq: number): Promise<PromotionApplication | null> {
    const promotionApplication = PromotionApplicationMapper.fromApiDto(
      MOCK_DATA_BY_ID[applySeq] as ApiPromotionDto
    );
    return Promise.resolve(promotionApplication);
  }

  findAll(): Promise<PromotionApplication[]> {
    throw new Error("Method not implemented.");
  }

  delete(applySeq: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default MockJsonServer;
