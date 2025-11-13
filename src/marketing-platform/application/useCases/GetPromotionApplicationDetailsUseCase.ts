import {
  IPromotionApplicationRepository,
  PromotionApplication,
} from "../../domain";

/**
 * Use case for retrieving a single promotion application by ID
 * This follows the command/query separation principle - it's a pure query operation
 */
export class GetPromotionApplicationDetailsUseCase {
  constructor(
    private readonly promotionApplicationRepository: IPromotionApplicationRepository
  ) {}

  /**
   * Executes the use case to fetch a promotion application by its application sequence number
   * @param applySeq The application sequence number (unique identifier)
   * @returns Promise resolving to the promotion application or null if not found
   * @throws Error if applySeq is invalid
   */
  async execute(applySeq: number): Promise<PromotionApplication | null> {
    this.validateApplySeq(applySeq);
    return await this.promotionApplicationRepository.findById(applySeq);
  }

  /**
   * Validates the application sequence number
   * @param applySeq The application sequence number to validate
   * @throws Error if applySeq is invalid
   */
  private validateApplySeq(applySeq: number): void {
    if (!Number.isInteger(applySeq) || applySeq <= 0) {
      throw new Error(
        "Invalid application sequence number. Must be a positive integer."
      );
    }
  }

  /**
   * Executes the use case and throws an error if not found
   * Useful when you expect the promotion application to exist
   * @param applySeq The application sequence number
   * @returns Promise resolving to the promotion application
   * @throws Error if the promotion application is not found
   */
  async executeOrThrow(applySeq: number): Promise<PromotionApplication> {
    const application = await this.execute(applySeq);

    if (!application) {
      throw new Error(
        `Promotion application with ID ${applySeq} not found`
      );
    }

    return application;
  }
}
