import { Component, OnInit } from "@angular/core";
import { Order } from "../../models/order.model";
import { OrderService } from "../../services/order.service";

@Component({
  selector: "app-user-dashboard",
  templateUrl: "./user-dashboard.component.html",
})
export class UserDashboardComponent implements OnInit {
  orders: Order[] = [];
  loading = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  downloadBill(order: Order): void {
    const lines = [
      "DEPARTMENT STORE - BILL",
      "=======================",
      `Invoice: ${order.invoiceNumber}`,
      `Date: ${new Date(order.createdAt).toLocaleString()}`,
      `Payment: ${order.paymentMethod.toUpperCase()}`,
      "",
      "Billing Details",
      `Name: ${order.billing.fullName}`,
      `Email: ${order.billing.email}`,
      `Phone: ${order.billing.phone}`,
      `Address: ${order.billing.address}`,
      "",
      "Items",
      ...order.items.map(
        (item) =>
          `${item.name} | Qty: ${item.quantity} | Price: $${item.price.toFixed(2)} | Total: $${item.lineTotal.toFixed(2)}`
      ),
      "",
      `Grand Total: $${order.totalAmount.toFixed(2)}`,
      `Status: ${order.status.toUpperCase()}`,
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${order.invoiceNumber}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
