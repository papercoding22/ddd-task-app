import {
  IPromotionApplicationRepository,
  PromotionApplication,
} from "../../domain";

/**
 * Use case for retrieving all promotion applications
 * This follows the command/query separation principle - it's a pure query operation
 */
export class GetAllPromotionsUseCase {
  constructor(
    private readonly promotionApplicationRepository: IPromotionApplicationRepository
  ) {}

  /**
   * Executes the use case to fetch all promotion applications
   * @returns Promise resolving to an array of all promotion applications
   */
  async execute(): Promise<PromotionApplication[]> {
    return await this.promotionApplicationRepository.findAll();
  }

  /**
   * Gets only active promotion applications
   * @param currentDate Optional date to check against (defaults to now)
   * @returns Promise resolving to an array of active promotion applications
   */
  async getActivePromotions(
    currentDate: Date = new Date()
  ): Promise<PromotionApplication[]> {
    const allPromotions = await this.promotionApplicationRepository.findAll();
    return allPromotions.filter((promotion) =>
      promotion.isActive(currentDate)
    );
  }

  /**
   * Gets promotion applications by status
   * @param status The application status to filter by
   * @returns Promise resolving to an array of promotion applications with the specified status
   */
  async getByStatus(
    status: "APPLYING" | "IN_SERVICE" | "COMPLETED" | "CANCELLED"
  ): Promise<PromotionApplication[]> {
    const allPromotions = await this.promotionApplicationRepository.findAll();
    return allPromotions.filter(
      (promotion) => promotion.getApplicationStatus() === status
    );
  }

  /**
   * Gets promotion applications for a specific merchant
   * @param merchantId The merchant ID to filter by
   * @returns Promise resolving to an array of promotion applications for the merchant
   */
  async getByMerchant(merchantId: string): Promise<PromotionApplication[]> {
    const allPromotions = await this.promotionApplicationRepository.findAll();
    return allPromotions.filter(
      (promotion) => promotion.getMerchantId() === merchantId
    );
  }
}
