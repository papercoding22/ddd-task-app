# useGetPromotions Hook Documentation

## Overview

`useGetPromotions` is a custom React hook that provides a comprehensive interface for fetching and managing promotion applications in the marketing platform. It integrates with the DI container and uses the `GetAllPromotionsUseCase` to fetch data.

## Features

✅ **Auto-load on mount** (configurable)
✅ **Multiple fetch strategies** (all, active, by status, by merchant)
✅ **Loading state management**
✅ **Error handling with clear error**
✅ **Refresh capability**
✅ **Reset functionality**
✅ **TypeScript type safety**
✅ **Comprehensive unit tests** (21 tests, all passing)

## Installation & Usage

### Basic Usage - Auto-load all promotions

```typescript
import { useGetPromotions } from "./marketing-platform/presentation";

function PromotionsList() {
  const { promotions, loading, error } = useGetPromotions();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {promotions.map((promo) => (
        <li key={promo.getApplySeq()}>
          {promo.getMerchantName()} - {promo.getApplicationStatus()}
        </li>
      ))}
    </ul>
  );
}
```

### Manual Loading

```typescript
function ManualPromotionsList() {
  const { promotions, loading, fetchAllPromotions } = useGetPromotions({
    autoLoad: false,
  });

  return (
    <div>
      <button onClick={fetchAllPromotions} disabled={loading}>
        Load Promotions
      </button>
      <ul>
        {promotions.map((promo) => (
          <li key={promo.getApplySeq()}>{promo.getMerchantName()}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Fetch Active Promotions Only

```typescript
function ActivePromotions() {
  const { promotions, loading, fetchActivePromotions } = useGetPromotions({
    autoLoad: false,
  });

  useEffect(() => {
    fetchActivePromotions(); // Fetches only IN_SERVICE + within date range
  }, [fetchActivePromotions]);

  return <div>{promotions.length} active promotions</div>;
}
```

### Filter by Status

```typescript
function PromotionsByStatus() {
  const { promotions, fetchByStatus } = useGetPromotions({ autoLoad: false });

  const loadInService = () => fetchByStatus("IN_SERVICE");
  const loadApplying = () => fetchByStatus("APPLYING");
  const loadCompleted = () => fetchByStatus("COMPLETED");
  const loadCancelled = () => fetchByStatus("CANCELLED");

  return (
    <div>
      <button onClick={loadInService}>In Service</button>
      <button onClick={loadApplying}>Applying</button>
      <button onClick={loadCompleted}>Completed</button>
      <button onClick={loadCancelled}>Cancelled</button>
      <div>{promotions.length} promotions</div>
    </div>
  );
}
```

### Filter by Merchant

```typescript
function MerchantPromotions({ merchantId }: { merchantId: string }) {
  const { promotions, loading, fetchByMerchant } = useGetPromotions({
    autoLoad: false,
  });

  useEffect(() => {
    fetchByMerchant(merchantId);
  }, [merchantId, fetchByMerchant]);

  return <div>{promotions.length} promotions for merchant {merchantId}</div>;
}
```

## API Reference

### Hook Signature

```typescript
function useGetPromotions(options?: {
  autoLoad?: boolean;
}): UseGetPromotionsReturn;
```

### Options

| Option     | Type      | Default | Description                                |
| ---------- | --------- | ------- | ------------------------------------------ |
| `autoLoad` | `boolean` | `true`  | Automatically fetch promotions on mount    |

### Return Value

```typescript
type UseGetPromotionsReturn = {
  // State
  promotions: PromotionApplication[];
  loading: boolean;
  error: string | null;

  // Fetch methods
  fetchAllPromotions: () => Promise<PromotionApplication[]>;
  fetchActivePromotions: (currentDate?: Date) => Promise<PromotionApplication[]>;
  fetchByStatus: (status: ApplicationStatus) => Promise<PromotionApplication[]>;
  fetchByMerchant: (merchantId: string) => Promise<PromotionApplication[]>;

  // Utility methods
  refresh: () => Promise<PromotionApplication[]>;
  clearError: () => void;
  reset: () => void;
};
```

### State Properties

#### `promotions`
- **Type**: `PromotionApplication[]`
- **Description**: Array of promotion applications returned by the last fetch operation

#### `loading`
- **Type**: `boolean`
- **Description**: `true` when a fetch operation is in progress, `false` otherwise

#### `error`
- **Type**: `string | null`
- **Description**: Error message from the last failed operation, or `null` if no error

### Fetch Methods

#### `fetchAllPromotions()`
Fetches all promotion applications regardless of status or date.

```typescript
const allPromotions = await fetchAllPromotions();
```

#### `fetchActivePromotions(currentDate?)`
Fetches only active promotions (IN_SERVICE status + within promotion date range).

```typescript
// Use current date
const activeNow = await fetchActivePromotions();

// Use specific date
const activeOn = await fetchActivePromotions(new Date("2025-06-15"));
```

#### `fetchByStatus(status)`
Fetches promotions filtered by application status.

```typescript
const inService = await fetchByStatus("IN_SERVICE");
const applying = await fetchByStatus("APPLYING");
const completed = await fetchByStatus("COMPLETED");
const cancelled = await fetchByStatus("CANCELLED");
```

#### `fetchByMerchant(merchantId)`
Fetches all promotions for a specific merchant.

```typescript
const merchantPromos = await fetchByMerchant("M001");
```

### Utility Methods

#### `refresh()`
Re-fetches all promotions (same as calling `fetchAllPromotions()`).

```typescript
await refresh();
```

#### `clearError()`
Clears the current error state.

```typescript
clearError();
```

#### `reset()`
Resets all state to initial values (empty promotions, no error, not loading).

```typescript
reset();
```

## Test Coverage

✅ **21 tests, all passing**

### Test Categories

1. **Initialization and auto-load** (3 tests)
   - Auto-load on mount
   - Disable auto-load
   - Initial state

2. **fetchAllPromotions** (3 tests)
   - Successful fetch
   - Loading state management
   - Error handling

3. **fetchActivePromotions** (3 tests)
   - Filter active promotions
   - Custom date parameter
   - Error handling

4. **fetchByStatus** (4 tests)
   - Filter by each status type
   - Error handling

5. **fetchByMerchant** (3 tests)
   - Merchant filtering
   - Non-existent merchant
   - Error handling

6. **Utility methods** (3 tests)
   - Refresh functionality
   - Clear error
   - Reset state

7. **Integration scenarios** (2 tests)
   - Sequential operations
   - Error recovery

### Running Tests

```bash
# Run hook tests
npm test -- marketing-platform/presentation/hooks/useGetPromotions.test.ts

# Run with coverage
npm run test:coverage -- marketing-platform/presentation/hooks/useGetPromotions.test.ts
```

## Error Handling

The hook provides built-in error handling:

```typescript
const { error, clearError, fetchAllPromotions } = useGetPromotions({
  autoLoad: false,
});

const handleFetch = async () => {
  try {
    await fetchAllPromotions();
  } catch (err) {
    // Error is automatically set in state
    console.error("Fetch failed:", err);
  }
};

// Display error to user
{error && (
  <div className="error">
    {error}
    <button onClick={clearError}>Dismiss</button>
  </div>
)}
```

## Best Practices

### 1. Use `autoLoad: false` for conditional loading

```typescript
const { fetchByMerchant } = useGetPromotions({ autoLoad: false });

useEffect(() => {
  if (selectedMerchantId) {
    fetchByMerchant(selectedMerchantId);
  }
}, [selectedMerchantId, fetchByMerchant]);
```

### 2. Memoize filter parameters

```typescript
const filterDate = useMemo(() => new Date("2025-06-15"), []);
const { fetchActivePromotions } = useGetPromotions({ autoLoad: false });

useEffect(() => {
  fetchActivePromotions(filterDate);
}, [filterDate, fetchActivePromotions]);
```

### 3. Handle loading states

```typescript
const { loading, promotions } = useGetPromotions();

if (loading) {
  return <Spinner />;
}

return <PromotionList promotions={promotions} />;
```

### 4. Provide user feedback on errors

```typescript
const { error, clearError } = useGetPromotions();

return (
  <>
    {error && (
      <Alert onClose={clearError}>
        Failed to load promotions: {error}
      </Alert>
    )}
    {/* Rest of component */}
  </>
);
```

## Architecture

```
useGetPromotions Hook
  ↓
ServiceContainer (DI)
  ↓
GetAllPromotionsUseCase
  ↓
IPromotionApplicationRepository
  ↓
MockJsonServer / API Implementation
```

## Files

- `useGetPromotions.ts` - Main hook implementation
- `useGetPromotions.test.ts` - Unit tests (21 tests)
- `useGetPromotions.example.tsx` - Usage examples
- `index.ts` - Export file
- `useGetPromotions.md` - This documentation

## Dependencies

- React (useState, useEffect, useCallback)
- ServiceContainer from `../../infrastructure`
- Domain types from `../../domain`

## Related Documentation

- [GetAllPromotionsUseCase](../../application/useCases/GetAllPromotionsUseCase.ts)
- [ServiceContainer](../../infrastructure/di/ServiceContainer.ts)
- [PromotionApplication Entity](../../domain/entities/PromotionApplication.ts)
