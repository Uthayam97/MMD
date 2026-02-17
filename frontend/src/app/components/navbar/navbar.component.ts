import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { CartService } from "../../services/cart.service";

@Component({ selector: "app-navbar", templateUrl: "./navbar.component.html", styleUrls: ["./navbar.component.css"] })
export class NavbarComponent implements OnInit, OnDestroy {
  cartCount = 0;
  isLoggedIn = false;
  isAdmin = false;
  private sub = new Subscription();

  constructor(private authService: AuthService, private cartService: CartService) {}

  ngOnInit(): void {
    this.sub.add(this.cartService.cartCount$.subscribe((count) => (this.cartCount = count)));
    this.sub.add(this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === "admin";
      if (user) this.cartService.loadCart().subscribe({ error: () => undefined });
      else this.cartService.clearState();
    }));
  }

  logout(): void { this.authService.logout(); this.cartService.clearState(); }
  ngOnDestroy(): void { this.sub.unsubscribe(); }
}
