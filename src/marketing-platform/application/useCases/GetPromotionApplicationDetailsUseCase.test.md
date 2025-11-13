# GetPromotionApplicationDetailsUseCase

## Overview
Use case for retrieving detailed information about a single promotion application by its unique application sequence number (applySeq).

## Purpose
This use case follows the Command/Query Separation (CQS) principle and is designed for:
- Fetching detailed promotion application data for display pages
- Retrieving promotion information for editing workflows
- Loading specific promotion details by ID

## Usage

### Basic Usage - Execute

```typescript
import { GetPromotionApplicationDetailsUseCase } from "./useCases";
import { MockJsonServer } from "../../infrastructure/repositories";

// Initialize repository
const repository = new MockJsonServer();

// Create use case instance
const useCase = new GetPromotionApplicationDetailsUseCase(repository);

// Fetch promotion application
const application = await useCase.execute(12345);

if (application) {
  console.log(`Found: ${application.getMerchantName()}`);
  console.log(`Status: ${application.getApplicationStatus()}`);
} else {
  console.log("Promotion application not found");
}
```

### Execute or Throw - When You Expect It to Exist

```typescript
try {
  // Use executeOrThrow when you expect the promotion to exist
  const application = await useCase.executeOrThrow(12345);

  // No need to check for null - will throw if not found
  console.log(`Merchant: ${application.getMerchantName()}`);

  const promotion = application.getPromotion();
  console.log(`Title: ${promotion.getTitle()}`);

} catch (error) {
  if (error.message.includes("not found")) {
    // Handle not found case
    console.error("Promotion application does not exist");
  } else if (error.message.includes("Invalid application sequence number")) {
    // Handle validation error
    console.error("Invalid ID provided");
  }
}
```

### Example in React Component

```typescript
import { useEffect, useState } from "react";
import { GetPromotionApplicationDetailsUseCase } from "../application/useCases";
import { PromotionApplication } from "../domain";

function PromotionDetailView({ applySeq }: { applySeq: number }) {
  const [application, setApplication] = useState<PromotionApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPromotionDetails = async () => {
      try {
        setLoading(true);
        const useCase = new GetPromotionApplicationDetailsUseCase(repository);
        const result = await useCase.executeOrThrow(applySeq);
        setApplication(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPromotionDetails();
  }, [applySeq]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!application) return <div>Not found</div>;

  return (
    <div>
      <h1>{application.getPromotion().getTitle()}</h1>
      <p>Merchant: {application.getMerchantName()}</p>
      <p>Status: {application.getApplicationStatus()}</p>
    </div>
  );
}
```

## Methods

### `execute(applySeq: number): Promise<PromotionApplication | null>`

Retrieves a promotion application by its ID.

**Parameters:**
- `applySeq` (number): The application sequence number (must be a positive integer)

**Returns:**
- `Promise<PromotionApplication | null>`: The promotion application if found, null otherwise

**Throws:**
- `Error`: If applySeq is invalid (not a positive integer, zero, negative, decimal, or NaN)

**Example:**
```typescript
const app = await useCase.execute(12345);
if (app) {
  // Handle found case
} else {
  // Handle not found case
}
```

### `executeOrThrow(applySeq: number): Promise<PromotionApplication>`

Retrieves a promotion application by its ID and throws an error if not found.

**Parameters:**
- `applySeq` (number): The application sequence number (must be a positive integer)

**Returns:**
- `Promise<PromotionApplication>`: The promotion application (guaranteed to exist)

**Throws:**
- `Error`: If applySeq is invalid
- `Error`: If promotion application is not found

**Example:**
```typescript
try {
  const app = await useCase.executeOrThrow(12345);
  // No null check needed - guaranteed to exist
  console.log(app.getMerchantName());
} catch (error) {
  console.error("Failed to load promotion:", error.message);
}
```

## Validation Rules

The use case validates the `applySeq` parameter and will throw an error if:
- The value is zero or negative
- The value is not an integer (e.g., 123.45)
- The value is NaN or Infinity

**Valid Examples:**
```typescript
await useCase.execute(1);      // ✅ Valid
await useCase.execute(12345);  // ✅ Valid
await useCase.execute(999999); // ✅ Valid
```

**Invalid Examples:**
```typescript
await useCase.execute(0);      // ❌ Throws error
await useCase.execute(-1);     // ❌ Throws error
await useCase.execute(123.45); // ❌ Throws error
await useCase.execute(NaN);    // ❌ Throws error
```

## Integration with Repository

This use case depends on the `IPromotionApplicationRepository` interface and calls the `findById` method:

```typescript
interface IPromotionApplicationRepository {
  findById(applySeq: number): Promise<PromotionApplication | null>;
  // ... other methods
}
```

Current implementation uses `MockJsonServer` which reads from JSON mock data files located at:
- `src/marketing-platform/infrastructure/repositories/mock/`

## Testing

The use case has comprehensive test coverage including:
- ✅ Finding existing promotion applications
- ✅ Returning null for non-existent applications
- ✅ Validation of applySeq parameter
- ✅ executeOrThrow behavior
- ✅ Different promotion types (PointPromotion, DownloadableCoupon, RewardCoupon)
- ✅ Integration scenarios

Run tests with:
```bash
npm test -- GetPromotionApplicationDetailsUseCase
```

## Related Use Cases

- **GetAllPromotionsUseCase**: For retrieving all promotion applications or filtering by status/merchant
- Future use cases for updating/deleting promotion applications will also use this repository

## See Also

- [GetAllPromotionsUseCase](./GetAllPromotionsUseCase.ts) - For listing and filtering promotions
- [IPromotionApplicationRepository](../../domain/repositories/IPromotionApplicationRepository.ts) - Repository interface
- [PromotionApplication](../../domain/entities/PromotionApplication.ts) - Domain entity
