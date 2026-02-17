import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Cart } from "../../models/cart.model";
import { BillingDetails, Order, PaymentMethod } from "../../models/order.model";
import { CartService } from "../../services/cart.service";
import { OrderService } from "../../services/order.service";

@Component({ selector: "app-cart", templateUrl: "./cart.component.html" })
export class CartComponent implements OnInit {
  cart$: Observable<Cart | null>;
  total$ = this.cartService.totalAmount$();
  currentCart: Cart | null = null;
  placingOrder = false;
  submitted = false;
  successMessage = "";
  errorMessage = "";
  latestOrder: Order | null = null;
  paymentMethod: PaymentMethod = "card";
  billing: BillingDetails = {
    fullName: "",
    email: "",
    phone: "",
    address: "",
  };

  constructor(private cartService: CartService, private orderService: OrderService) {
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {
    this.cart$.subscribe((cart) => (this.currentCart = cart));
    this.cartService.loadCart().subscribe();
  }

  updateQty(productId: string | undefined, event: Event): void {
    if (!productId) return;
    const value = Number((event.target as HTMLInputElement).value);
    if (!value || value < 1) return;
    this.cartService.updateQuantity(productId, value).subscribe();
  }

  remove(productId: string | undefined): void {
    if (!productId) return;
    this.cartService.removeFromCart(productId).subscribe();
  }

  placeOrder(): void {
    this.submitted = true;
    this.successMessage = "";
    this.errorMessage = "";

    if (!this.currentCart?.items?.length) return;
    if (this.hasOutOfStockItems()) {
      this.errorMessage = "One or more items in cart are out of stock. Remove them to continue.";
      return;
    }
    if (!this.billing.fullName.trim()) return;
    if (!this.billing.email.trim() || !this.isEmailValid()) return;
    if (!this.billing.phone.trim() || !this.isPhoneValid()) return;
    if (!this.billing.address.trim()) return;

    this.placingOrder = true;
    this.orderService.checkout(this.paymentMethod, this.billing).subscribe({
      next: (order) => {
        this.latestOrder = order;
        this.successMessage = "Order placed successfully.";
        this.placingOrder = false;
        this.cartService.loadCart().subscribe();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || "Checkout failed.";
        this.placingOrder = false;
      },
    });
  }

  downloadBill(): void {
    if (!this.latestOrder) return;

    const lines = [
      "DEPARTMENT STORE - BILL",
      "=======================",
      `Invoice: ${this.latestOrder.invoiceNumber}`,
      `Date: ${new Date(this.latestOrder.createdAt).toLocaleString()}`,
      `Payment: ${this.latestOrder.paymentMethod.toUpperCase()}`,
      "",
      "Billing Details",
      `Name: ${this.latestOrder.billing.fullName}`,
      `Email: ${this.latestOrder.billing.email}`,
      `Phone: ${this.latestOrder.billing.phone}`,
      `Address: ${this.latestOrder.billing.address}`,
      "",
      "Items",
      ...this.latestOrder.items.map(
        (item) =>
          `${item.name} | Qty: ${item.quantity} | Price: $${item.price.toFixed(2)} | Total: $${item.lineTotal.toFixed(2)}`
      ),
      "",
      `Grand Total: $${this.latestOrder.totalAmount.toFixed(2)}`,
      "Status: PLACED",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${this.latestOrder.invoiceNumber}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  isEmailValid(): boolean {
    return /^\S+@\S+\.\S+$/.test(this.billing.email);
  }

  isPhoneValid(): boolean {
    return /^[0-9+\-\s]{7,15}$/.test(this.billing.phone);
  }

  hasOutOfStockItems(): boolean {
    return !!this.currentCart?.items?.some((item) => Number(item.product?.stock || 0) <= 0);
  }
}
