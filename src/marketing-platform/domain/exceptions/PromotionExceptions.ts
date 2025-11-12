/**
 * Base class for all promotion-related domain exceptions
 */
export abstract class PromotionDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when promotion dates are invalid
 */
export class InvalidPromotionDateException extends PromotionDomainException {
  constructor(message: string = 'Invalid promotion date: start date must be before end date') {
    super(message);
  }
}

/**
 * Thrown when a promotion is not active
 */
export class PromotionNotActiveException extends PromotionDomainException {
  constructor(message: string = 'Promotion is not currently active') {
    super(message);
  }
}

/**
 * Thrown when budget or quantity constraints are violated
 */
export class InsufficientBudgetException extends PromotionDomainException {
  constructor(message: string = 'Insufficient budget or quantity remaining') {
    super(message);
  }
}

/**
 * Thrown when payment amount doesn't meet minimum requirements
 */
export class MinimumPaymentNotMetException extends PromotionDomainException {
  constructor(minimumRequired: number, actualAmount: number) {
    super(`Payment amount ${actualAmount} does not meet minimum requirement of ${minimumRequired}`);
  }
}

/**
 * Thrown when percentage values are out of valid range
 */
export class InvalidPercentageException extends PromotionDomainException {
  constructor(value: number) {
    super(`Invalid percentage value: ${value}. Must be between 0 and 100.`);
  }
}

/**
 * Thrown when coupon quantity is invalid
 */
export class InvalidCouponQuantityException extends PromotionDomainException {
  constructor(message: string = 'Invalid coupon quantity') {
    super(message);
  }
}

/**
 * Thrown when attempting to use an expired coupon
 */
export class CouponExpiredException extends PromotionDomainException {
  constructor(message: string = 'Coupon has expired') {
    super(message);
  }
}

/**
 * Thrown when download limit is exceeded
 */
export class DownloadLimitExceededException extends PromotionDomainException {
  constructor(message: string = 'Download limit has been exceeded') {
    super(message);
  }
}

/**
 * Thrown when point calculation is invalid
 */
export class InvalidPointCalculationException extends PromotionDomainException {
  constructor(message: string = 'Invalid point calculation') {
    super(message);
  }
}
