import { PromotionApplication } from "../entities/PromotionApplication";

export interface IPromotionApplicationRepository {
  save(application: PromotionApplication): Promise<void>;
  findById(applySeq: number): Promise<PromotionApplication | null>;
  findAll(): Promise<PromotionApplication[]>;
  delete(applySeq: number): Promise<void>;
}
