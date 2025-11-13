# ServiceContainer Usage Guide

## Overview
The ServiceContainer is a Dependency Injection (DI) container that manages the lifecycle and initialization of repositories and use cases in the marketing platform.

## Benefits
- **Single Source of Truth**: Centralized management of all dependencies
- **Singleton Pattern**: Ensures only one instance of each service exists
- **Easy Testing**: Can be reset for test isolation
- **Clean Architecture**: Separates infrastructure concerns from business logic

## Available Services

### Use Cases
1. **GetAllPromotionsUseCase** - Retrieves all promotion applications with filtering options
2. **GetPromotionApplicationDetailsUseCase** - Retrieves a single promotion application by ID

### Repositories
- **IPromotionApplicationRepository** - Repository interface for promotion data (currently backed by MockJsonServer)

## Usage Examples

### Basic Usage - Getting a Use Case

```typescript
import { ServiceContainer } from "./infrastructure/di/ServiceContainer";

// Get the singleton instance
const container = ServiceContainer.getInstance();

// Get the use case
const getAllPromotionsUseCase = container.getGetAllPromotionsUseCase();
const getDetailsUseCase = container.getGetPromotionApplicationDetailsUseCase();

// Use it
const allPromotions = await getAllPromotionsUseCase.execute();
const promotionDetail = await getDetailsUseCase.execute(12345);
```

### In a React Component

```typescript
import { useEffect, useState } from "react";
import { ServiceContainer } from "../infrastructure/di/ServiceContainer";
import { PromotionApplication } from "../domain";

function PromotionDetailView({ applySeq }: { applySeq: number }) {
  const [application, setApplication] = useState<PromotionApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const container = ServiceContainer.getInstance();
        const useCase = container.getGetPromotionApplicationDetailsUseCase();

        const result = await useCase.executeOrThrow(applySeq);
        setApplication(result);
      } catch (error) {
        console.error("Failed to load promotion:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [applySeq]);

  if (loading) return <div>Loading...</div>;
  if (!application) return <div>Not found</div>;

  return (
    <div>
      <h1>{application.getPromotion().getTitle()}</h1>
      <p>Merchant: {application.getMerchantName()}</p>
    </div>
  );
}
```

### Custom Hook Pattern

```typescript
import { useEffect, useState } from "react";
import { ServiceContainer } from "../infrastructure/di/ServiceContainer";
import { PromotionApplication } from "../domain";

export function usePromotionDetails(applySeq: number) {
  const [data, setData] = useState<PromotionApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const container = ServiceContainer.getInstance();
        const useCase = container.getGetPromotionApplicationDetailsUseCase();

        const result = await useCase.execute(applySeq);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [applySeq]);

  return { data, loading, error };
}

// Usage in component
function MyComponent({ id }: { id: number }) {
  const { data, loading, error } = usePromotionDetails(id);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Not found</div>;

  return <div>{data.getMerchantName()}</div>;
}
```

### Getting All Services

```typescript
const container = ServiceContainer.getInstance();

// Get all available services
const repository = container.getPromotionApplicationRepository();
const getAllUseCase = container.getGetAllPromotionsUseCase();
const getDetailsUseCase = container.getGetPromotionApplicationDetailsUseCase();

// Example: Get all promotions for a merchant
const allPromotions = await getAllUseCase.getByMerchant("M001");

// Example: Get detailed info for first promotion
if (allPromotions.length > 0) {
  const firstId = allPromotions[0].getApplySeq();
  const details = await getDetailsUseCase.executeOrThrow(firstId);
  console.log("Details:", details);
}
```

### Testing - Reset Container

```typescript
import { describe, it, beforeEach, afterEach } from "vitest";
import { ServiceContainer } from "./ServiceContainer";

describe("MyComponent", () => {
  beforeEach(() => {
    // Reset container before each test for isolation
    ServiceContainer.reset();
  });

  afterEach(() => {
    // Clean up after each test
    ServiceContainer.reset();
  });

  it("should load promotion details", async () => {
    const container = ServiceContainer.getInstance();
    const useCase = container.getGetPromotionApplicationDetailsUseCase();

    // Your test code here
    const result = await useCase.execute(12345);
    // assertions...
  });
});
```

### React Router Integration

```typescript
import { useParams } from "react-router-dom";
import { ServiceContainer } from "../infrastructure/di/ServiceContainer";

function PromotionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [promotion, setPromotion] = useState(null);

  useEffect(() => {
    const loadPromotion = async () => {
      const container = ServiceContainer.getInstance();
      const useCase = container.getGetPromotionApplicationDetailsUseCase();

      const applySeq = parseInt(id!, 10);
      const result = await useCase.execute(applySeq);
      setPromotion(result);
    };

    if (id) {
      loadPromotion();
    }
  }, [id]);

  // Render component...
}
```

## ServiceContainer Methods

### Static Methods

#### `getInstance(): ServiceContainer`
Returns the singleton instance of the ServiceContainer. Creates it if it doesn't exist.

```typescript
const container = ServiceContainer.getInstance();
```

#### `reset(): void`
Resets the container instance. Useful for testing to ensure test isolation.

```typescript
ServiceContainer.reset();
```

### Instance Methods

#### `getPromotionApplicationRepository(): IPromotionApplicationRepository`
Returns the promotion application repository instance.

```typescript
const repo = container.getPromotionApplicationRepository();
```

#### `getGetAllPromotionsUseCase(): GetAllPromotionsUseCase`
Returns the use case for retrieving all promotions.

```typescript
const useCase = container.getGetAllPromotionsUseCase();
```

#### `getGetPromotionApplicationDetailsUseCase(): GetPromotionApplicationDetailsUseCase`
Returns the use case for retrieving a single promotion by ID.

```typescript
const useCase = container.getGetPromotionApplicationDetailsUseCase();
```

## Best Practices

1. **Use Singleton Instance**: Always use `getInstance()` instead of trying to create new instances
2. **Reset in Tests**: Call `reset()` in beforeEach/afterEach hooks for test isolation
3. **Don't Store Container**: Get what you need from the container and use it directly
4. **Separation of Concerns**: Keep container usage in infrastructure/presentation layers

## Anti-Patterns to Avoid

❌ **Don't create multiple instances:**
```typescript
// BAD
const container1 = ServiceContainer.getInstance();
const container2 = ServiceContainer.getInstance(); // Same as container1
```

❌ **Don't access container in domain layer:**
```typescript
// BAD - Domain entities should not know about the container
class PromotionApplication {
  someMethod() {
    const container = ServiceContainer.getInstance(); // ❌ NO!
  }
}
```

✅ **Do inject dependencies:**
```typescript
// GOOD - Use dependency injection
class PromotionService {
  constructor(
    private getAllUseCase: GetAllPromotionsUseCase,
    private getDetailsUseCase: GetPromotionApplicationDetailsUseCase
  ) {}
}

// In your app initialization
const container = ServiceContainer.getInstance();
const service = new PromotionService(
  container.getGetAllPromotionsUseCase(),
  container.getGetPromotionApplicationDetailsUseCase()
);
```

## File Location

**Path:** `src/marketing-platform/infrastructure/di/ServiceContainer.ts`

## See Also

- [GetAllPromotionsUseCase](../application/useCases/GetAllPromotionsUseCase.ts)
- [GetPromotionApplicationDetailsUseCase](../application/useCases/GetPromotionApplicationDetailsUseCase.ts)
- [MockJsonServer](../infrastructure/repositories/MockJsonServer.ts)
