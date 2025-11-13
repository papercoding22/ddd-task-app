/**
 * Example usage of useGetPromotions hook
 * This file demonstrates various ways to use the hook in React components
 */

import React from "react";
import { useGetPromotions } from "./useGetPromotions";
import type {
  PromotionApplication,
  PointPromotion,
  DownloadableCoupon,
  RewardCoupon,
} from "../../domain";

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

/**
 * Example 7: Render different promotion types with type-specific details
 * Demonstrates how to differentiate and display PointPromotion, DownloadableCoupon, and RewardCoupon
 */
export const PromotionTypesList: React.FC = () => {
  const { promotions, loading, error } = useGetPromotions();

  if (loading) {
    return <div>Loading promotions...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  /**
   * Helper function to determine promotion type
   */
  const getPromotionTypeName = (application: PromotionApplication): string => {
    const promotion = application.getPromotion();
    const promotionType = promotion.getPromotionType();
    const distributionType = promotion.getDistributionType();

    if (promotionType === "POINT_PROMOTION" && distributionType === "NA") {
      return "Point Promotion";
    } else if (
      promotionType === "POINT_COUPON" &&
      distributionType === "DOWNLOAD"
    ) {
      return "Downloadable Coupon";
    } else if (
      promotionType === "POINT_COUPON" &&
      distributionType === "REWARD"
    ) {
      return "Reward Coupon";
    }
    return "Unknown";
  };

  /**
   * Render PointPromotion details
   */
  const renderPointPromotion = (
    application: PromotionApplication,
    promotion: PointPromotion
  ) => {
    return (
      <div
        style={{
          border: "2px solid #4CAF50",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
          backgroundColor: "#f1f8f4",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            POINT PROMOTION
          </span>
          <span
            style={{
              backgroundColor: "#2196F3",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "11px",
            }}
          >
            {application.getApplicationStatus()}
          </span>
        </div>

        <h3 style={{ margin: "12px 0 8px 0" }}>{promotion.getTitle()}</h3>

        <div style={{ marginBottom: "8px" }}>
          <strong>Apply Seq:</strong> {application.getApplySeq()} |{" "}
          <strong>Merchant:</strong> {application.getMerchantName()}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginTop: "12px",
          }}
        >
          <div>
            <strong>📅 Period</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {promotion.getStartDate().toLocaleDateString()} -{" "}
              {promotion.getEndDate().toLocaleDateString()}
            </div>
          </div>

          <div>
            <strong>🎯 Promotion Name</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {promotion.getPromotionName()}
            </div>
          </div>

          <div>
            <strong>💰 Budget</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {promotion.getPromotionBudget().toLocaleString()} points
            </div>
          </div>

          <div>
            <strong>📊 Usage</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              Used: {promotion.getUsedPoint().toLocaleString()} points (
              {promotion.getUsedPointPercentage().toFixed(1)}%)
            </div>
          </div>

          <div>
            <strong>💎 Remaining Points</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {promotion.getRemainingPoint().toLocaleString()} points (
              {promotion.getRemainingPointPercentage().toFixed(1)}%)
            </div>
          </div>

          <div>
            <strong>🎁 Saving Type</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {promotion.getPromotionSavingType() === "FIXED_RATE"
                ? `${promotion.getPromotionSavingRate()}% Rate`
                : `Fixed Point`}
            </div>
          </div>

          <div>
            <strong>💵 Min Payment</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              ${promotion.getMinimumPaymentPrice().toLocaleString()}
            </div>
          </div>

          <div>
            <strong>🔝 Max Saving</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {promotion.getMaximumSavingPoint().toLocaleString()} points
            </div>
          </div>
        </div>

        <div style={{ marginTop: "12px", fontSize: "13px", color: "#666" }}>
          <strong>Status:</strong>{" "}
          {application.isActive() ? "✅ Active" : "⏸ Not Active"} |{" "}
          {promotion.hasSufficientPoints(100) ? "💚 Points Available" : "❌ Low Points"}
        </div>
      </div>
    );
  };

  /**
   * Render DownloadableCoupon details
   */
  const renderDownloadableCoupon = (
    application: PromotionApplication,
    coupon: DownloadableCoupon
  ) => {
    return (
      <div
        style={{
          border: "2px solid #FF9800",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
          backgroundColor: "#fff8f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              backgroundColor: "#FF9800",
              color: "white",
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            DOWNLOADABLE COUPON
          </span>
          <span
            style={{
              backgroundColor: "#2196F3",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "11px",
            }}
          >
            {application.getApplicationStatus()}
          </span>
        </div>

        <h3 style={{ margin: "12px 0 8px 0" }}>{coupon.getTitle()}</h3>

        <div style={{ marginBottom: "8px" }}>
          <strong>Apply Seq:</strong> {application.getApplySeq()} |{" "}
          <strong>Merchant:</strong> {application.getMerchantName()}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginTop: "12px",
          }}
        >
          <div>
            <strong>📅 Period</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {coupon.getStartDate().toLocaleDateString()} -{" "}
              {coupon.getEndDate().toLocaleDateString()}
            </div>
          </div>

          <div>
            <strong>🎫 Coupon Name</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {coupon.getCouponName()}
            </div>
          </div>

          <div>
            <strong>💵 Discount</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              ${coupon.getCouponDiscountPrice().toLocaleString()}
            </div>
          </div>

          <div>
            <strong>💳 Min Payment</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              ${coupon.getMinimumPaymentPrice().toLocaleString()}
            </div>
          </div>

          <div>
            <strong>📦 Total Quantity</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              Purchased: {coupon.getPurchasedCouponQuantity().toLocaleString()}
            </div>
          </div>

          <div>
            <strong>📊 Usage</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              Used: {coupon.getUsedCouponQuantity()} (
              {coupon.calculateUsagePercentage().toFixed(1)}%)
            </div>
          </div>

          <div>
            <strong>📥 Downloads</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              Downloaded: {coupon.getDownloadedCouponQuantity()} /{" "}
              {coupon.getDownloadableCouponQuantity()}
            </div>
          </div>

          <div>
            <strong>🔢 Daily Limit</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {coupon.getGeneralQuantityPerDay().toLocaleString()} per day
            </div>
          </div>

          <div>
            <strong>⏱ Validity</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {coupon.getValidityPeriodDays()} days (
              {coupon.getValidityPeriodType()})
            </div>
          </div>

          <div>
            <strong>💎 Remaining</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {coupon.getRemainingCouponQuantity().toLocaleString()} coupons
            </div>
          </div>

          <div>
            <strong>🔁 Multiple Issue</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {coupon.getMultipleIssuedYn() === "Y" ? "✅ Yes" : "❌ No"}
            </div>
          </div>

          <div>
            <strong>📤 Issuance Qty</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {coupon.getCouponIssuanceQuantity().toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "12px", fontSize: "13px", color: "#666" }}>
          <strong>Status:</strong>{" "}
          {application.isActive() ? "✅ Active" : "⏸ Not Active"} |{" "}
          {coupon.hasAvailableCoupons()
            ? "💚 Coupons Available"
            : "❌ No Coupons"}
        </div>
      </div>
    );
  };

  /**
   * Render RewardCoupon details
   */
  const renderRewardCoupon = (
    application: PromotionApplication,
    coupon: RewardCoupon
  ) => {
    return (
      <div
        style={{
          border: "2px solid #9C27B0",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
          backgroundColor: "#f8f0ff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              backgroundColor: "#9C27B0",
              color: "white",
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            REWARD COUPON
          </span>
          <span
            style={{
              backgroundColor: "#2196F3",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "11px",
            }}
          >
            {application.getApplicationStatus()}
          </span>
        </div>

        <h3 style={{ margin: "12px 0 8px 0" }}>{coupon.getTitle()}</h3>

        <div style={{ marginBottom: "8px" }}>
          <strong>Apply Seq:</strong> {application.getApplySeq()} |{" "}
          <strong>Merchant:</strong> {application.getMerchantName()}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginTop: "12px",
          }}
        >
          <div>
            <strong>📅 Period</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {coupon.getStartDate().toLocaleDateString()} -{" "}
              {coupon.getEndDate().toLocaleDateString()}
            </div>
          </div>

          <div>
            <strong>💵 Discount</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              ${coupon.getCouponDiscountPrice().toLocaleString()}
            </div>
          </div>

          <div>
            <strong>📦 Total Quantity</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              Purchased: {coupon.getPurchasedCouponQuantity().toLocaleString()}
            </div>
          </div>

          <div>
            <strong>📊 Usage</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              Used: {coupon.getUsedCouponQuantity()} (
              {coupon.calculateUsagePercentage().toFixed(1)}%)
            </div>
          </div>

          <div>
            <strong>🎁 Received</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {coupon.getReceivedCouponQuantity().toLocaleString()} coupons
            </div>
          </div>

          <div>
            <strong>💎 Remaining</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {coupon.getRemainingCouponQuantity().toLocaleString()} coupons
            </div>
          </div>

          <div>
            <strong>🤖 Auto Grant</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {coupon.isAutomaticGrantEnabled() ? "✅ Enabled" : "❌ Disabled"}
            </div>
          </div>

          <div>
            <strong>💳 Grant Min Price</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {coupon.getCouponGrantMinPrice() !== null
                ? `$${coupon.getCouponGrantMinPrice()?.toLocaleString()}`
                : "No minimum"}
            </div>
          </div>

          <div>
            <strong>💰 Full Payment Required</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {coupon.getFullPaymentYn() === "Y"
                ? `✅ Yes ($${coupon.getFullPaymentMinPrice().toLocaleString()})`
                : "❌ No"}
            </div>
          </div>

          <div>
            <strong>⏱ Validity Period</strong>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {coupon.getValidityPeriodDays()} days (
              {coupon.getValidityPeriodType()})
            </div>
          </div>
        </div>

        <div style={{ marginTop: "12px", fontSize: "13px", color: "#666" }}>
          <strong>Status:</strong>{" "}
          {application.isActive() ? "✅ Active" : "⏸ Not Active"} |{" "}
          {coupon.hasAvailableCoupons()
            ? "💚 Coupons Available"
            : "❌ No Coupons"}{" "}
          |{" "}
          {coupon.qualifiesForAutoGrant(10000)
            ? "🎁 Auto-grant eligible"
            : "⏳ Manual grant"}
        </div>
      </div>
    );
  };

  /**
   * Main render logic - determine type and render accordingly
   */
  const renderPromotion = (application: PromotionApplication) => {
    const promotion = application.getPromotion();
    const promotionType = promotion.getPromotionType();
    const distributionType = promotion.getDistributionType();

    // Type guard: Check if it's a PointPromotion
    if (promotionType === "POINT_PROMOTION" && distributionType === "NA") {
      return renderPointPromotion(
        application,
        promotion as unknown as PointPromotion
      );
    }

    // Type guard: Check if it's a DownloadableCoupon
    if (promotionType === "POINT_COUPON" && distributionType === "DOWNLOAD") {
      return renderDownloadableCoupon(
        application,
        promotion as unknown as DownloadableCoupon
      );
    }

    // Type guard: Check if it's a RewardCoupon
    if (promotionType === "POINT_COUPON" && distributionType === "REWARD") {
      return renderRewardCoupon(
        application,
        promotion as unknown as RewardCoupon
      );
    }

    // Fallback for unknown types
    return (
      <div
        style={{
          border: "2px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <h3>{promotion.getTitle()}</h3>
        <p>Unknown promotion type</p>
      </div>
    );
  };

  // Group promotions by type
  const groupedPromotions = promotions.reduce(
    (acc, app) => {
      const typeName = getPromotionTypeName(app);
      if (!acc[typeName]) {
        acc[typeName] = [];
      }
      acc[typeName].push(app);
      return acc;
    },
    {} as Record<string, PromotionApplication[]>
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🎯 Marketing Platform - All Promotion Types</h1>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "24px",
          padding: "16px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <div>
          <strong>Total Promotions:</strong> {promotions.length}
        </div>
        {Object.entries(groupedPromotions).map(([type, apps]) => (
          <div key={type}>
            <strong>{type}:</strong> {apps.length}
          </div>
        ))}
      </div>

      <div>
        <h2>📋 All Promotions</h2>
        {promotions.length === 0 ? (
          <p style={{ color: "#888", fontStyle: "italic" }}>
            No promotions found
          </p>
        ) : (
          promotions.map((application) => (
            <div key={application.getApplySeq()}>
              {renderPromotion(application)}
            </div>
          ))
        )}
      </div>

      {/* Optional: Show promotions grouped by type */}
      <div style={{ marginTop: "40px" }}>
        <h2>📊 Promotions by Type</h2>
        {Object.entries(groupedPromotions).map(([type, apps]) => (
          <details key={type} style={{ marginBottom: "16px" }}>
            <summary style={{ cursor: "pointer", fontSize: "18px", fontWeight: "bold" }}>
              {type} ({apps.length})
            </summary>
            <div style={{ marginTop: "12px" }}>
              {apps.map((app) => (
                <div key={app.getApplySeq()}>{renderPromotion(app)}</div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};
