import { Component, OnInit } from "@angular/core";
import { Order } from "../../../../models/order.model";
import { OrderService } from "../../../../services/order.service";

@Component({
  selector: "app-admin-order-tracking",
  templateUrl: "./order-tracking.component.html",
})
export class OrderTrackingComponent implements OnInit {
  orders: Order[] = [];
  orderStatuses = ["placed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe((orders) => (this.orders = orders));
  }

  updateStatus(orderId: string, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe((updated) => {
      const index = this.orders.findIndex((order) => order._id === updated._id);
      if (index >= 0) {
        this.orders[index] = updated;
        this.orders = [...this.orders];
      }
    });
  }

  getOrderUserLabel(order: Order): string {
    if (!order.user) return "N/A";
    if (typeof order.user === "string") return order.user;
    return order.user.name || order.user.email || "N/A";
  }
}
