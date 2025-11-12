import { IPromotionApplicationRepository } from "../../domain";
import { MockJsonServer } from "../repositories/MockJsonServer";
import { GetAllPromotionsUseCase } from "../../application";

/**
 * ServiceContainer acts as a Dependency Injection container
 * to manage the lifecycle and initialization of repositories and services.
 */
export class ServiceContainer {
  private static instance: ServiceContainer;
  private promotionApplicationRepository: IPromotionApplicationRepository;
  private getAllPromotionsUseCase: GetAllPromotionsUseCase;

  private constructor() {
    // Initialize repositories
    this.promotionApplicationRepository = new MockJsonServer();

    // Initialize use cases with dependencies
    this.getAllPromotionsUseCase = new GetAllPromotionsUseCase(
      this.promotionApplicationRepository
    );
  }

  /**
   * Get the singleton instance of ServiceContainer
   */
  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  /**
   * Get the PromotionApplicationRepository instance
   */
  public getPromotionApplicationRepository(): IPromotionApplicationRepository {
    return this.promotionApplicationRepository;
  }

  /**
   * Get the GetAllPromotionsUseCase instance
   */
  public getGetAllPromotionsUseCase(): GetAllPromotionsUseCase {
    return this.getAllPromotionsUseCase;
  }

  /**
   * Reset the container (useful for testing)
   */
  public static reset(): void {
    ServiceContainer.instance = null as any;
  }
}
