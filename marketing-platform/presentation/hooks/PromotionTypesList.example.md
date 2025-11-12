# PromotionTypesList Example Component

## Overview

The `PromotionTypesList` component demonstrates how to render different types of promotions with their type-specific details using the `useGetPromotions` hook.

## Supported Promotion Types

### 1. **PointPromotion** 🟢
   - **Color Theme**: Green (#4CAF50)
   - **Type Identifier**: `promotionType: "POINT_PROMOTION"` + `distributionType: "NA"`
   - **Key Features Displayed**:
     - Budget and remaining points
     - Used/remaining percentage
     - Saving type (Fixed Rate vs Fixed Point)
     - Minimum payment requirements
     - Maximum saving points

### 2. **DownloadableCoupon** 🟠
   - **Color Theme**: Orange (#FF9800)
   - **Type Identifier**: `promotionType: "POINT_COUPON"` + `distributionType: "DOWNLOAD"`
   - **Key Features Displayed**:
     - Coupon name and discount amount
     - Download statistics (downloaded/available)
     - Daily download limit
     - Validity period (flexible days)
     - Multiple issuance capability
     - Minimum payment requirements

### 3. **RewardCoupon** 🟣
   - **Color Theme**: Purple (#9C27B0)
   - **Type Identifier**: `promotionType: "POINT_COUPON"` + `distributionType: "REWARD"`
   - **Key Features Displayed**:
     - Automatic grant settings
     - Grant minimum price
     - Received coupon quantity
     - Validity period
     - Full payment requirements
     - Auto-grant eligibility status

## Component Architecture

### Type Detection Strategy

```typescript
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
```

### Rendering Pipeline

1. **Fetch Data**: Uses `useGetPromotions()` hook to load all promotions
2. **Type Detection**: Identifies promotion type using `promotionType` + `distributionType`
3. **Type-Specific Rendering**: Calls appropriate render function
4. **Grouping**: Optionally groups promotions by type for organized display

## Key Features

### 🎨 Visual Design

- **Color-coded cards** for each promotion type
- **Status badges** showing application status (APPLYING, IN_SERVICE, etc.)
- **Grid layout** for organized data presentation
- **Responsive 2-column grid** for promotion details
- **Emoji icons** for visual indicators

### 📊 Data Display

#### PointPromotion Shows:
- 📅 Promotion period
- 🎯 Promotion name
- 💰 Total budget
- 📊 Usage statistics (points used/remaining)
- 🎁 Saving type and rate
- 💵 Minimum payment requirement
- 🔝 Maximum saving limit

#### DownloadableCoupon Shows:
- 📅 Promotion period
- 🎫 Coupon name
- 💵 Discount amount
- 💳 Minimum payment requirement
- 📦 Purchased quantity
- 📊 Usage percentage
- 📥 Download statistics
- 🔢 Daily limit
- ⏱ Validity period
- 🔁 Multiple issuance capability

#### RewardCoupon Shows:
- 📅 Promotion period
- 💵 Discount amount
- 📦 Purchased quantity
- 📊 Usage percentage
- 🎁 Received coupons
- 🤖 Auto-grant settings
- 💳 Grant minimum price
- ⏱ Validity period

### 🏷️ Status Indicators

Each promotion card displays:
- **Active Status**: ✅ Active / ⏸ Not Active
- **Availability**: 💚 Available / ❌ Not Available
- **Special Conditions**: Type-specific status indicators

## Usage Example

```tsx
import { PromotionTypesList } from "./marketing-platform/presentation/hooks/useGetPromotions.example";

function App() {
  return (
    <div>
      <PromotionTypesList />
    </div>
  );
}
```

## Component Sections

### 1. Summary Header
Displays total counts:
```
Total Promotions: 5
Point Promotion: 2
Downloadable Coupon: 2
Reward Coupon: 1
```

### 2. All Promotions Section
Shows all promotions in order, each with type-specific formatting.

### 3. Promotions by Type Section (Collapsible)
Groups promotions by type in expandable sections:
- Click to expand/collapse each promotion type
- Shows count in the header
- Filtered view of each type

## Render Functions

### `renderPointPromotion(application, promotion)`
Renders green-themed card with point-specific details including:
- Budget tracking
- Point usage percentages
- Saving rate information
- Payment requirements

### `renderDownloadableCoupon(application, coupon)`
Renders orange-themed card with download-specific details including:
- Download statistics
- Daily limits
- Validity periods
- Issuance configurations

### `renderRewardCoupon(application, coupon)`
Renders purple-themed card with reward-specific details including:
- Auto-grant settings
- Grant conditions
- Received quantities
- Validity information

## Type Guards

The component uses runtime type checks based on promotion properties:

```typescript
// Type guard: Check if it's a PointPromotion
if (promotionType === "POINT_PROMOTION" && distributionType === "NA") {
  return renderPointPromotion(application, promotion as unknown as PointPromotion);
}

// Type guard: Check if it's a DownloadableCoupon
if (promotionType === "POINT_COUPON" && distributionType === "DOWNLOAD") {
  return renderDownloadableCoupon(application, promotion as unknown as DownloadableCoupon);
}

// Type guard: Check if it's a RewardCoupon
if (promotionType === "POINT_COUPON" && distributionType === "REWARD") {
  return renderRewardCoupon(application, promotion as unknown as RewardCoupon);
}
```

## Data Flow

```
useGetPromotions Hook
  ↓
Fetch All Promotions
  ↓
For Each PromotionApplication
  ↓
Get Promotion Type & Distribution Type
  ↓
Match Against Type Guards
  ↓
Render Type-Specific Component
  ↓
Display in Card Layout
```

## Responsive Design

- **Grid Layout**: 2-column grid for data fields
- **Flexible Containers**: Cards adapt to content
- **Mobile-Friendly**: Inline styles for consistent rendering
- **Color Contrast**: High contrast colors for accessibility

## Best Practices Demonstrated

1. **Type Safety**: Uses TypeScript types from domain layer
2. **Type Guards**: Runtime checks for promotion types
3. **Separation of Concerns**: Separate render functions for each type
4. **DRY Principle**: Reusable helper functions
5. **Clean Architecture**: Uses domain entities and value objects
6. **Loading States**: Handles loading and error states
7. **Visual Hierarchy**: Clear visual distinction between types
8. **Data Formatting**: Proper number formatting and date display

## Extending the Component

### Adding a New Promotion Type

1. Add type identifier in `getPromotionTypeName()`
2. Create new render function (e.g., `renderNewPromotionType()`)
3. Add type guard in `renderPromotion()`
4. Define color theme and layout
5. Map type-specific properties to display fields

### Customizing Display

To customize the display for a specific promotion type:

```typescript
const renderPointPromotion = (application, promotion) => {
  return (
    <div style={{ /* your custom styles */ }}>
      {/* Add/remove fields as needed */}
      <div>
        <strong>Custom Field:</strong> {promotion.getCustomField()}
      </div>
    </div>
  );
};
```

## Integration with Real Data

This component works seamlessly with:
- MockJsonServer (for development/testing)
- Real API implementation (production)
- Any implementation of `IPromotionApplicationRepository`

The component is **data-source agnostic** thanks to the DI container pattern.

## Visual Preview

### PointPromotion Card
```
╔═══════════════════════════════════════════╗
║ [POINT PROMOTION] [IN_SERVICE]            ║
║                                           ║
║ Test Promotion 1001                       ║
║ Apply Seq: 1001 | Merchant: Merchant A   ║
║                                           ║
║ 📅 Period          🎯 Promotion Name      ║
║ 01/01/25 - 12/31/25   Point Promo 1001   ║
║                                           ║
║ 💰 Budget          📊 Usage               ║
║ 100,000 points     5,000 points (5.0%)   ║
║                                           ║
║ Status: ✅ Active | 💚 Points Available    ║
╚═══════════════════════════════════════════╝
```

## File Location

`marketing-platform/presentation/hooks/useGetPromotions.example.tsx`

Component export: `PromotionTypesList`

## Related Documentation

- [useGetPromotions Hook](./useGetPromotions.md)
- [PointPromotion Entity](../../domain/entities/PointPromotion.ts)
- [DownloadableCoupon Entity](../../domain/entities/DownloadableCoupon.ts)
- [RewardCoupon Entity](../../domain/entities/RewardCoupon.ts)
