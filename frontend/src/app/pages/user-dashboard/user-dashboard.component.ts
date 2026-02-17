import { Component, OnDestroy, OnInit } from "@angular/core";
import { Order } from "../../models/order.model";
import { OrderService } from "../../services/order.service";
import { SocketService } from "../../services/socket.service";

@Component({
  selector: "app-user-dashboard",
  templateUrl: "./user-dashboard.component.html",
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  loading = false;
  trackingMessage = "";

  constructor(private orderService: OrderService, private socketService: SocketService) {}

  ngOnInit(): void {
    this.loadOrders();

    this.socketService.on("order_status_updated", (order: Order) => {
      this.upsertOrder(order);
      this.trackingMessage = `Order ${order.invoiceNumber} status updated to ${order.status.toUpperCase()}.`;
    });

    this.socketService.on("order_created", (order: Order) => {
      this.upsertOrder(order);
      this.trackingMessage = `New order tracked: ${order.invoiceNumber}.`;
    });
  }

  ngOnDestroy(): void {
    this.socketService.off("order_status_updated");
    this.socketService.off("order_created");
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

  upsertOrder(order: Order): void {
    const index = this.orders.findIndex((entry) => entry._id === order._id);
    if (index >= 0) {
      this.orders[index] = order;
      this.orders = [...this.orders];
      return;
    }
    this.orders = [order, ...this.orders];
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
