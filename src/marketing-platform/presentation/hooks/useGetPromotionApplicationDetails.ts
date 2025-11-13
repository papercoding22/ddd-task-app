import { useState, useEffect, useCallback } from "react";
import { PromotionApplication } from "../../domain";
import { ServiceContainer } from "../../infrastructure";

interface UseGetPromotionApplicationDetailsOptions {
  /** Whether to automatically fetch on mount. Defaults to true */
  autoLoad?: boolean;
  /** If true, throws error when promotion not found. Defaults to false */
  throwOnNotFound?: boolean;
}

/**
 * Custom React hook for fetching a single promotion application by ID
 * Provides loading, error states, and refetch capabilities
 *
 * @param applySeq - The application sequence number (unique ID)
 * @param options - Configuration options for the hook
 *
 * @example
 * ```tsx
 * function PromotionDetailView({ applySeq }: { applySeq: number }) {
 *   const { application, loading, error, refetch } = useGetPromotionApplicationDetails(applySeq);
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   if (!application) return <div>Not found</div>;
 *
 *   return <div>{application.getMerchantName()}</div>;
 * }
 * ```
 */
export const useGetPromotionApplicationDetails = (
  applySeq: number | null | undefined,
  options?: UseGetPromotionApplicationDetailsOptions
) => {
  const [application, setApplication] = useState<PromotionApplication | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const container = ServiceContainer.getInstance();
  const useCase = container.getGetPromotionApplicationDetailsUseCase();

  /**
   * Fetches the promotion application by ID
   * Returns null if not found (unless throwOnNotFound is true)
   */
  const fetchPromotionDetails = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);

        const throwOnNotFound = options?.throwOnNotFound ?? false;

        let result: PromotionApplication | null;
        if (throwOnNotFound) {
          result = await useCase.executeOrThrow(id);
        } else {
          result = await useCase.execute(id);
        }

        setApplication(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : `Failed to fetch promotion application ${id}`;
        setError(errorMessage);
        setApplication(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [useCase, options?.throwOnNotFound]
  );

  /**
   * Refetches the promotion application
   * Only works if applySeq is provided
   */
  const refetch = useCallback(() => {
    if (applySeq != null) {
      return fetchPromotionDetails(applySeq);
    }
    return Promise.resolve(null);
  }, [applySeq, fetchPromotionDetails]);

  /**
   * Clears the error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Resets the hook state to initial values
   */
  const reset = useCallback(() => {
    setApplication(null);
    setError(null);
    setLoading(false);
  }, []);

  // Auto-load promotion details on mount or when applySeq changes
  useEffect(() => {
    const shouldAutoLoad = options?.autoLoad !== false;

    if (shouldAutoLoad && applySeq != null) {
      fetchPromotionDetails(applySeq);
    } else if (applySeq == null) {
      // Reset state if applySeq becomes null/undefined
      reset();
    }
  }, [applySeq, fetchPromotionDetails, options?.autoLoad, reset]);

  return {
    // State
    application,
    loading,
    error,

    // Computed state
    isFound: application !== null,
    isNotFound: !loading && application === null && applySeq != null,

    // Methods
    fetchPromotionDetails,
    refetch,
    clearError,
    reset,
  };
};

/**
 * Type definition for the return value of useGetPromotionApplicationDetails
 */
export type UseGetPromotionApplicationDetailsReturn = ReturnType<
  typeof useGetPromotionApplicationDetails
>;
