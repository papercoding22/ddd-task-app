import {
  OrderStatusType,
  PaymentType,
  PromotionType,
  DistributionType,
  PaymentInfo,
} from '../types';

/**
 * PromotionOrder entity
 * Represents the order and payment information for a promotion application
 */
export class PromotionOrder {
  private readonly orderStatus: OrderStatusType;
  private readonly paymentType: PaymentType;
  private readonly paymentDate: Date;
  private readonly finalPaymentPrice: number;
  private readonly paymentInfo: PaymentInfo;

  constructor(params: {
    orderStatus: OrderStatusType;
    paymentType: PaymentType;
    paymentDate: Date;
    finalPaymentPrice: number;
    paymentInfo: PaymentInfo;
  }) {
    this.validatePaymentPrice(params.finalPaymentPrice);

    this.orderStatus = params.orderStatus;
    this.paymentType = params.paymentType;
    this.paymentDate = params.paymentDate;
    this.finalPaymentPrice = params.finalPaymentPrice;
    this.paymentInfo = params.paymentInfo;
  }

  /**
   * Validates that payment price is non-negative
   */
  private validatePaymentPrice(price: number): void {
    if (price < 0) {
      throw new Error('Payment price cannot be negative');
    }
  }

  /**
   * Checks if the order payment is completed
   */
  public isPaymentCompleted(): boolean {
    return this.orderStatus === 'PAYMENT_COMPLETED';
  }

  /**
   * Checks if the order has been refunded (fully or partially)
   */
  public isRefunded(): boolean {
    return (
      this.orderStatus === 'REFUND_COMPLETED' ||
      this.orderStatus === 'PARTIAL_REFUND_COMPLETED'
    );
  }

  /**
   * Checks if the order has been partially refunded
   */
  public isPartiallyRefunded(): boolean {
    return this.orderStatus === 'PARTIAL_REFUND_COMPLETED';
  }

  /**
   * Checks if the order has been fully refunded
   */
  public isFullyRefunded(): boolean {
    return this.orderStatus === 'REFUND_COMPLETED';
  }

  /**
   * Checks if payment was made via LINE Pay
   */
  public isLinePay(): boolean {
    return this.paymentType === 'LINE_PAY';
  }

  /**
   * Checks if payment was made via Credit Card
   */
  public isCreditCard(): boolean {
    return this.paymentType === 'CREDIT_CARD';
  }

  /**
   * Gets the number of days since payment
   */
  public getDaysSincePayment(currentDate: Date = new Date()): number {
    const diffTime = currentDate.getTime() - this.paymentDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Validates that the payment amount matches the order amount
   */
  public validatePaymentAmount(expectedAmount: number): boolean {
    return Math.abs(this.finalPaymentPrice - expectedAmount) < 0.01; // Allow for floating point precision
  }

  // Getters
  public getOrderStatus(): OrderStatusType {
    return this.orderStatus;
  }

  public getPaymentType(): PaymentType {
    return this.paymentType;
  }

  public getPaymentDate(): Date {
    return new Date(this.paymentDate);
  }

  public getFinalPaymentPrice(): number {
    return this.finalPaymentPrice;
  }

  public getPaymentInfo(): PaymentInfo {
    return { ...this.paymentInfo };
  }

  public getOrderId(): string {
    return this.paymentInfo.orderId;
  }

  public getTotalOrderAmount(): number {
    return this.paymentInfo.totalOrderAmount;
  }
}
