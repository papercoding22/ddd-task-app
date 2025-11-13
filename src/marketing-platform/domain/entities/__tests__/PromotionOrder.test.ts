import { describe, it, expect } from "vitest";
import { PromotionOrder } from "../PromotionOrder";
import { OrderStatusType, PaymentType, PaymentInfo } from "../../types";

const defaultPaymentInfo: PaymentInfo = {
  orderId: "order-abc",
  totalOrderAmount: 1000,
  currency: "USD",
  paymentGateway: "Stripe",
};

const defaultPromotionOrderParams = {
  orderStatus: "PAYMENT_COMPLETED" as OrderStatusType,
  paymentType: "CREDIT_CARD" as PaymentType,
  paymentDate: new Date("2023-10-26T10:00:00Z"),
  finalPaymentPrice: 950,
  paymentInfo: defaultPaymentInfo,
};

describe("PromotionOrder", () => {
  describe("Constructor Validations", () => {
    it("should create a PromotionOrder with valid parameters", () => {
      const order = new PromotionOrder(defaultPromotionOrderParams);
      expect(order).toBeInstanceOf(PromotionOrder);
      expect(order.getFinalPaymentPrice()).toBe(950);
    });

    it("should throw an error for negative finalPaymentPrice", () => {
      expect(
        () => new PromotionOrder({ ...defaultPromotionOrderParams, finalPaymentPrice: -1 })
      ).toThrow("Payment price cannot be negative");
    });
  });

  describe("isPaymentCompleted", () => {
    it("should return true if orderStatus is PAYMENT_COMPLETED", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, orderStatus: "PAYMENT_COMPLETED" });
      expect(order.isPaymentCompleted()).toBe(true);
    });

    it("should return false if orderStatus is not PAYMENT_COMPLETED", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, orderStatus: "PENDING" });
      expect(order.isPaymentCompleted()).toBe(false);
    });
  });

  describe("isRefunded", () => {
    it("should return true if orderStatus is REFUND_COMPLETED", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, orderStatus: "REFUND_COMPLETED" });
      expect(order.isRefunded()).toBe(true);
    });

    it("should return true if orderStatus is PARTIAL_REFUND_COMPLETED", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, orderStatus: "PARTIAL_REFUND_COMPLETED" });
      expect(order.isRefunded()).toBe(true);
    });

    it("should return false if orderStatus is not a refund status", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, orderStatus: "PAYMENT_COMPLETED" });
      expect(order.isRefunded()).toBe(false);
    });
  });

  describe("isPartiallyRefunded", () => {
    it("should return true if orderStatus is PARTIAL_REFUND_COMPLETED", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, orderStatus: "PARTIAL_REFUND_COMPLETED" });
      expect(order.isPartiallyRefunded()).toBe(true);
    });

    it("should return false otherwise", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, orderStatus: "REFUND_COMPLETED" });
      expect(order.isPartiallyRefunded()).toBe(false);
    });
  });

  describe("isFullyRefunded", () => {
    it("should return true if orderStatus is REFUND_COMPLETED", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, orderStatus: "REFUND_COMPLETED" });
      expect(order.isFullyRefunded()).toBe(true);
    });

    it("should return false otherwise", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, orderStatus: "PARTIAL_REFUND_COMPLETED" });
      expect(order.isFullyRefunded()).toBe(false);
    });
  });

  describe("isLinePay", () => {
    it("should return true if paymentType is LINE_PAY", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, paymentType: "LINE_PAY" });
      expect(order.isLinePay()).toBe(true);
    });

    it("should return false otherwise", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, paymentType: "CREDIT_CARD" });
      expect(order.isLinePay()).toBe(false);
    });
  });

  describe("isCreditCard", () => {
    it("should return true if paymentType is CREDIT_CARD", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, paymentType: "CREDIT_CARD" });
      expect(order.isCreditCard()).toBe(true);
    });

    it("should return false otherwise", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, paymentType: "LINE_PAY" });
      expect(order.isCreditCard()).toBe(false);
    });
  });

  describe("getDaysSincePayment", () => {
    it("should return the correct number of days since payment", () => {
      const paymentDate = new Date("2023-10-20T10:00:00Z");
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, paymentDate });
      const currentDate = new Date("2023-10-25T10:00:00Z"); // 5 days later
      expect(order.getDaysSincePayment(currentDate)).toBe(5);
    });

    it("should return 0 if payment date is today", () => {
      const paymentDate = new Date("2023-10-25T10:00:00Z");
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, paymentDate });
      const currentDate = new Date("2023-10-25T15:00:00Z");
      expect(order.getDaysSincePayment(currentDate)).toBe(0);
    });

    it("should return negative days if current date is before payment date", () => {
      const paymentDate = new Date("2023-10-25T10:00:00Z");
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, paymentDate });
      const currentDate = new Date("2023-10-20T10:00:00Z");
      expect(order.getDaysSincePayment(currentDate)).toBe(-5);
    });
  });

  describe("validatePaymentAmount", () => {
    it("should return true if amounts match exactly", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, finalPaymentPrice: 100 });
      expect(order.validatePaymentAmount(100)).toBe(true);
    });

    it("should return true if amounts are very close (floating point precision)", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, finalPaymentPrice: 99.99999999999999 });
      expect(order.validatePaymentAmount(100)).toBe(true);
    });

    it("should return false if amounts differ significantly", () => {
      const order = new PromotionOrder({ ...defaultPromotionOrderParams, finalPaymentPrice: 100 });
      expect(order.validatePaymentAmount(100.02)).toBe(false);
    });
  });

  describe("Getters", () => {
    it("should return correct values for all getters", () => {
      const order = new PromotionOrder(defaultPromotionOrderParams);
      expect(order.getOrderStatus()).toBe(defaultPromotionOrderParams.orderStatus);
      expect(order.getPaymentType()).toBe(defaultPromotionOrderParams.paymentType);
      expect(order.getPaymentDate()).toEqual(defaultPromotionOrderParams.paymentDate);
      expect(order.getFinalPaymentPrice()).toBe(defaultPromotionOrderParams.finalPaymentPrice);
      expect(order.getPaymentInfo()).toEqual(defaultPromotionOrderParams.paymentInfo);
      expect(order.getOrderId()).toBe(defaultPaymentInfo.orderId);
      expect(order.getTotalOrderAmount()).toBe(defaultPaymentInfo.totalOrderAmount);
    });
  });
});
