/**
 * Example usage of useGetPromotions hook
 * This file demonstrates various ways to use the hook in React components
 */

import React from "react";
import { useGetPromotions } from "./useGetPromotions";

/**
 * Example 1: Basic usage - Auto-load all promotions on mount
 */
export const PromotionsListBasic: React.FC = () => {
  const { promotions, loading, error } = useGetPromotions();

  if (loading) {
    return <div>Loading promotions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>All Promotions ({promotions.length})</h2>
      <ul>
        {promotions.map((promotion) => (
          <li key={promotion.getApplySeq()}>
            <strong>{promotion.getMerchantName()}</strong> -{" "}
            {promotion.getApplicationStatus()}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Example 2: Manual loading - Disable auto-load and fetch on button click
 */
export const PromotionsListManual: React.FC = () => {
  const { promotions, loading, error, fetchAllPromotions } = useGetPromotions({
    autoLoad: false,
  });

  const handleLoadPromotions = async () => {
    try {
      await fetchAllPromotions();
    } catch (err) {
      console.error("Failed to load promotions:", err);
    }
  };

  return (
    <div>
      <h2>Manual Load Promotions</h2>
      <button onClick={handleLoadPromotions} disabled={loading}>
        {loading ? "Loading..." : "Load Promotions"}
      </button>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <ul>
        {promotions.map((promotion) => (
          <li key={promotion.getApplySeq()}>
            {promotion.getMerchantName()} - {promotion.getApplicationStatus()}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Example 3: Filter by status with tabs
 */
export const PromotionsByStatus: React.FC = () => {
  const {
    promotions,
    loading,
    error,
    fetchByStatus,
    fetchAllPromotions,
  } = useGetPromotions({ autoLoad: false });

  const [activeTab, setActiveTab] = React.useState<string>("all");

  const handleTabChange = async (status: string) => {
    setActiveTab(status);
    try {
      if (status === "all") {
        await fetchAllPromotions();
      } else {
        await fetchByStatus(status as any);
      }
    } catch (err) {
      console.error("Failed to filter promotions:", err);
    }
  };

  React.useEffect(() => {
    fetchAllPromotions();
  }, []);

  return (
    <div>
      <h2>Promotions by Status</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => handleTabChange("all")}
          disabled={loading}
          style={{ fontWeight: activeTab === "all" ? "bold" : "normal" }}
        >
          All
        </button>
        <button
          onClick={() => handleTabChange("APPLYING")}
          disabled={loading}
          style={{ fontWeight: activeTab === "APPLYING" ? "bold" : "normal" }}
        >
          Applying
        </button>
        <button
          onClick={() => handleTabChange("IN_SERVICE")}
          disabled={loading}
          style={{ fontWeight: activeTab === "IN_SERVICE" ? "bold" : "normal" }}
        >
          In Service
        </button>
        <button
          onClick={() => handleTabChange("COMPLETED")}
          disabled={loading}
          style={{ fontWeight: activeTab === "COMPLETED" ? "bold" : "normal" }}
        >
          Completed
        </button>
        <button
          onClick={() => handleTabChange("CANCELLED")}
          disabled={loading}
          style={{ fontWeight: activeTab === "CANCELLED" ? "bold" : "normal" }}
        >
          Cancelled
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <div>
        <p>Found {promotions.length} promotions</p>
        <ul>
          {promotions.map((promotion) => (
            <li key={promotion.getApplySeq()}>
              <strong>{promotion.getMerchantName()}</strong>
              <br />
              Status: {promotion.getApplicationStatus()}
              <br />
              Apply Seq: {promotion.getApplySeq()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/**
 * Example 4: Active promotions only
 */
export const ActivePromotionsList: React.FC = () => {
  const { promotions, loading, error, fetchActivePromotions } =
    useGetPromotions({ autoLoad: false });

  React.useEffect(() => {
    fetchActivePromotions();
  }, [fetchActivePromotions]);

  return (
    <div>
      <h2>Active Promotions</h2>

      {loading && <div>Loading active promotions...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <div>
        <p>{promotions.length} active promotions found</p>
        <ul>
          {promotions.map((promotion) => (
            <li key={promotion.getApplySeq()}>
              <strong>{promotion.getMerchantName()}</strong>
              <br />
              Promotion: {promotion.getPromotion().getTitle()}
              <br />
              Period: {promotion.getPromotion().getStartDate().toLocaleDateString()}{" "}
              - {promotion.getPromotion().getEndDate().toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/**
 * Example 5: Merchant-specific promotions with search
 */
export const MerchantPromotions: React.FC = () => {
  const { promotions, loading, error, fetchByMerchant } = useGetPromotions({
    autoLoad: false,
  });

  const [merchantId, setMerchantId] = React.useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId.trim()) return;

    try {
      await fetchByMerchant(merchantId);
    } catch (err) {
      console.error("Failed to fetch merchant promotions:", err);
    }
  };

  return (
    <div>
      <h2>Search Promotions by Merchant</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={merchantId}
          onChange={(e) => setMerchantId(e.target.value)}
          placeholder="Enter Merchant ID (e.g., M001)"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !merchantId.trim()}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {promotions.length > 0 && (
        <div>
          <p>{promotions.length} promotions found for merchant {merchantId}</p>
          <ul>
            {promotions.map((promotion) => (
              <li key={promotion.getApplySeq()}>
                Apply Seq: {promotion.getApplySeq()}
                <br />
                Status: {promotion.getApplicationStatus()}
                <br />
                Applied At: {promotion.getAppliedAt().toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && promotions.length === 0 && merchantId && (
        <div>No promotions found for merchant {merchantId}</div>
      )}
    </div>
  );
};

/**
 * Example 6: With refresh and error handling
 */
export const PromotionsWithRefresh: React.FC = () => {
  const { promotions, loading, error, refresh, clearError } =
    useGetPromotions();

  const handleRefresh = async () => {
    try {
      await refresh();
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  };

  return (
    <div>
      <h2>Promotions with Refresh</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
        {error && (
          <button onClick={clearError} style={{ marginLeft: "10px" }}>
            Clear Error
          </button>
        )}
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>Error: {error}</div>
      )}

      <div>
        <p>Total: {promotions.length} promotions</p>
        <ul>
          {promotions.map((promotion) => (
            <li key={promotion.getApplySeq()}>
              {promotion.getMerchantName()} - {promotion.getApplicationStatus()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
