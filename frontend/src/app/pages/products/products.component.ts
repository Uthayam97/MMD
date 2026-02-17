import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "../../models/product.model";
import { AuthService } from "../../services/auth.service";
import { CartService } from "../../services/cart.service";
import { ProductService } from "../../services/product.service";

@Component({ selector: "app-products", templateUrl: "./products.component.html", styleUrls: ["./products.component.css"] })
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  searchTerm = "";
  loading = false;
  errorMessage = "";

  constructor(private productService: ProductService, private cartService: CartService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void { this.fetchProducts(); }
  fetchProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({ next: (products) => { this.products = products; this.loading = false; }, error: () => { this.loading = false; } });
  }

  addToCart(product: Product): void {
    this.errorMessage = "";
    if (!this.authService.isLoggedIn()) { this.router.navigate(["/auth"]); return; }
    if (!this.canBuy(product)) return;
    if (!product._id) return;
    this.cartService.addToCart(product._id, 1).subscribe({
      error: (error) => {
        this.errorMessage = error?.error?.message || "Unable to add product to cart.";
      },
    });
  }

  canBuy(product: Product): boolean {
    return Number(product.stock || 0) > 0;
  }

  get filteredProducts(): Product[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.products;
    return this.products.filter((p) => `${p.name} ${p.description || ""}`.toLowerCase().includes(term));
  }
}
