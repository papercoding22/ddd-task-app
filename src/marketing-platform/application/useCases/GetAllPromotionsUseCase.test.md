# GetAllPromotionsUseCase Test Documentation

## Test Coverage Summary

✅ **18 tests passed** - All test scenarios are working correctly.

## Test Structure

### 1. **execute() method tests**
- Returns empty array when no promotions exist
- Returns all promotion applications
- Returns promotions with different statuses (APPLYING, IN_SERVICE, COMPLETED, CANCELLED)

### 2. **getActivePromotions() method tests**
- Filters only active promotions (IN_SERVICE status AND within date range)
- Excludes promotions with wrong status (APPLYING, COMPLETED, CANCELLED)
- Excludes promotions not yet started (future date)
- Excludes promotions that have ended (past date)
- Uses current date by default when no date provided
- Returns empty array when no active promotions exist
- Returns multiple active promotions correctly

### 3. **getByStatus() method tests**
- Filters by APPLYING status
- Filters by IN_SERVICE status
- Filters by COMPLETED status
- Filters by CANCELLED status
- Returns empty array when no promotions match the status

### 4. **getByMerchant() method tests**
- Returns all promotions for a specific merchant
- Returns promotions for different merchants
- Returns empty array for non-existent merchant
- Returns merchant promotions with various statuses

### 5. **Integration scenarios**
- Handles complex query combinations
- Returns consistent results across multiple calls

## Mock Implementation

The tests use a `MockPromotionApplicationRepository` that:
- Implements `IPromotionApplicationRepository` interface
- Stores applications in memory
- Provides test helper methods to set up test data
- Allows clearing data between tests

## Test Data Factory

`createTestPromotionApplication()` helper function creates fully valid test data including:
- PromotionApplication with all required fields
- PromotionOrder with payment information
- PointPromotion with all necessary configurations
- Configurable parameters for testing different scenarios

## Running the Tests

```bash
# Run all tests
npm test

# Run only GetAllPromotionsUseCase tests
npm test -- marketing-platform/application/useCases/GetAllPromotionsUseCase.test.ts

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Results

- **Test Files**: 1 passed
- **Tests**: 18 passed
- **Duration**: ~500ms
- **Framework**: Vitest

## Key Testing Patterns

1. **Arrange-Act-Assert**: All tests follow the AAA pattern
2. **beforeEach**: Sets up clean state for each test
3. **Mock Repository**: Isolates use case logic from infrastructure
4. **Test Data Factories**: Reusable functions for creating test data
5. **Edge Cases**: Tests cover empty arrays, non-existent data, and multiple results
