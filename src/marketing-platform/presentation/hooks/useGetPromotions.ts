import { useState, useEffect, useCallback } from "react";
import { PromotionApplication, ApplicationStatus } from "../../domain";
import { ServiceContainer } from "../../infrastructure";

/**
 * Custom React hook for managing promotion applications
 * Provides methods to fetch and filter promotions with loading and error states
 */
export const useGetPromotions = (options?: { autoLoad?: boolean }) => {
  const [promotions, setPromotions] = useState<PromotionApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const container = ServiceContainer.getInstance();
  const getAllPromotionsUseCase = container.getGetAllPromotionsUseCase();

  /**
   * Fetches all promotion applications
   */
  const fetchAllPromotions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allPromotions = await getAllPromotionsUseCase.execute();
      setPromotions(allPromotions);
      return allPromotions;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch promotions";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllPromotionsUseCase]);

  /**
   * Fetches only active promotion applications
   * Active = IN_SERVICE status and within promotion date range
   */
  const fetchActivePromotions = useCallback(
    async (currentDate?: Date) => {
      try {
        setLoading(true);
        setError(null);
        const activePromotions = await getAllPromotionsUseCase.getActivePromotions(
          currentDate
        );
        setPromotions(activePromotions);
        return activePromotions;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch active promotions";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAllPromotionsUseCase]
  );

  /**
   * Fetches promotions filtered by application status
   */
  const fetchByStatus = useCallback(
    async (status: ApplicationStatus) => {
      try {
        setLoading(true);
        setError(null);
        const filteredPromotions = await getAllPromotionsUseCase.getByStatus(
          status
        );
        setPromotions(filteredPromotions);
        return filteredPromotions;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : `Failed to fetch promotions with status ${status}`;
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAllPromotionsUseCase]
  );

  /**
   * Fetches promotions for a specific merchant
   */
  const fetchByMerchant = useCallback(
    async (merchantId: string) => {
      try {
        setLoading(true);
        setError(null);
        const merchantPromotions = await getAllPromotionsUseCase.getByMerchant(
          merchantId
        );
        setPromotions(merchantPromotions);
        return merchantPromotions;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : `Failed to fetch promotions for merchant ${merchantId}`;
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAllPromotionsUseCase]
  );

  /**
   * Refreshes the current promotions list
   */
  const refresh = useCallback(() => {
    return fetchAllPromotions();
  }, [fetchAllPromotions]);

  /**
   * Clears error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Resets hook state to initial values
   */
  const reset = useCallback(() => {
    setPromotions([]);
    setError(null);
    setLoading(false);
  }, []);

  // Auto-load promotions on mount if enabled (default: true)
  useEffect(() => {
    const shouldAutoLoad = options?.autoLoad !== false;
    if (shouldAutoLoad) {
      fetchAllPromotions();
    }
  }, [fetchAllPromotions, options?.autoLoad]);

  return {
    // State
    promotions,
    loading,
    error,

    // Fetch methods
    fetchAllPromotions,
    fetchActivePromotions,
    fetchByStatus,
    fetchByMerchant,

    // Utility methods
    refresh,
    clearError,
    reset,
  };
};

/**
 * Type definition for the return value of useGetPromotions
 */
export type UseGetPromotionsReturn = ReturnType<typeof useGetPromotions>;
