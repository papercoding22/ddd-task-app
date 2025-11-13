import {
  IPromotionApplicationRepository,
  PromotionApplication,
} from "../../domain";
import downloadableCouponDetails from "./mock/downloadable-coupon-details.json";
import pointPromotionDetails from "./mock/point-promotion-details.json";
import rewardCouponDetails from "./mock/reward-coupon-details.json";
import { ApiPromotionDto } from "./ApiPromotionDto";
import { PromotionApplicationMapper } from "./PromotionApplicationMapper";

const MOCK_DATA_BY_ID: {
  [applySeq: number]: ApiPromotionDto;
} = {
  12345: pointPromotionDetails,
  23456: downloadableCouponDetails,
  34567: rewardCouponDetails,
} as const;



const IN_MEMORY_DB: { [applySeq: number]: ApiPromotionDto } = {
  ...MOCK_DATA_BY_ID,
};

const fakeNetworkDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const fakeDBQuery = async (applySeq: number) => {
  await fakeNetworkDelay(500); // Simulate network delay
  return IN_MEMORY_DB[applySeq] || null;
};

const fakeDBQueryAll = async () => {
  await fakeNetworkDelay(700); // Simulate network delay
  return Object.values(IN_MEMORY_DB);
};

const fakeDBSave = async (data: ApiPromotionDto) => {
  await fakeNetworkDelay(300); // Simulate network delay
  IN_MEMORY_DB[data.applySeq] = data;
};

export class MockJsonServer implements IPromotionApplicationRepository {
  save(application: PromotionApplication): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(applySeq: number): Promise<PromotionApplication | null> {
    const data = await fakeDBQuery(applySeq);
    if (!data) {
      return Promise.resolve(null);
    }
    const promotionApplication = PromotionApplicationMapper.fromApiDto(
      data as ApiPromotionDto
    );
    return Promise.resolve(promotionApplication);
  }

  async findAll(): Promise<PromotionApplication[]> {
    const data = await fakeDBQueryAll();
    const promotionApplications = data.map((apiDto) =>
      PromotionApplicationMapper.fromApiDto(apiDto as ApiPromotionDto)
    );
    return Promise.resolve(promotionApplications);
  }

  delete(applySeq: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default MockJsonServer;
