# React Router Setup

## Overview
React Router (v6) has been successfully configured for this application.

## Current Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | PromotionListView | Home page showing promotions list |
| `/promotions` | PromotionListView | Promotions list page |
| `/promotions/:id` | *To be implemented* | Promotion detail page (placeholder) |
| `/tasks` | *Commented out* | Task management page |
| `*` | NotFound | 404 page for unmatched routes |

## Usage Examples

### Navigating Between Pages

```tsx
import { Link } from "react-router-dom";

// Using Link component (preferred for internal navigation)
<Link to="/promotions">View Promotions</Link>

// Using programmatic navigation
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/promotions");
  };

  return <button onClick={handleClick}>Go to Promotions</button>;
}
```

### Dynamic Routes (for detail pages)

```tsx
// In your promotion card:
import { useNavigate } from "react-router-dom";

function PromotionCard({ applySeq }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/promotions/${applySeq}`);
  };

  return (
    <ViewDetailsButton onClick={handleViewDetails} />
  );
}

// In the detail page component:
import { useParams } from "react-router-dom";

function PromotionDetailView() {
  const { id } = useParams();

  // Use id to fetch promotion details
  return <div>Promotion ID: {id}</div>;
}
```

### Getting Current Location

```tsx
import { useLocation } from "react-router-dom";

function MyComponent() {
  const location = useLocation();

  console.log(location.pathname); // e.g., "/promotions"
  console.log(location.search);   // e.g., "?filter=active"

  return <div>Current path: {location.pathname}</div>;
}
```

## Next Steps

1. **Create Promotion Detail Page**: Uncomment and implement the `/promotions/:id` route
2. **Update ViewDetailsButton**: Replace `console.log` with actual navigation
3. **Add Navigation Menu**: Create a navigation component with links to different sections

## Example: Updating ViewDetailsButton to Use Router

```tsx
// In RewardCouponCard.tsx (or other card components)
import { useNavigate } from "react-router-dom";

export const RewardCouponCard: React.FC<RewardCouponCardProps> = ({
  application,
  // ...
}) => {
  const navigate = useNavigate();

  return (
    <PromotionCardWrapper>
      {/* ... other content ... */}

      <ViewDetailsButton
        variant="purple"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/promotions/${application.getApplySeq()}`);
        }}
      />
    </PromotionCardWrapper>
  );
};
```

## Files Modified

- `src/main.tsx` - Wrapped App with BrowserRouter
- `src/App.tsx` - Added Routes configuration
- `src/pages/NotFound.tsx` - Created 404 page
- `package.json` - Added react-router-dom dependency

## Installed Packages

- `react-router-dom@latest`
- `@types/react-router-dom@latest` (dev dependency)
