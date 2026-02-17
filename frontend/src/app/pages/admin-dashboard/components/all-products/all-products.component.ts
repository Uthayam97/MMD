import { Component, OnInit } from "@angular/core";
import { Product } from "../../../../models/product.model";
import { ProductService } from "../../../../services/product.service";

@Component({
  selector: "app-admin-all-products",
  templateUrl: "./all-products.component.html",
})
export class AllProductsComponent implements OnInit {
  products: Product[] = [];
  editingId: string | null = null;
  draft: Product = { name: "", description: "", image: "", price: 0, stock: 0 };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((products) => (this.products = products));
  }

  beginEdit(product: Product): void {
    this.editingId = product._id || null;
    this.draft = { ...product };
  }

  cancelEdit(): void {
    this.editingId = null;
    this.draft = { name: "", description: "", image: "", price: 0, stock: 0 };
  }

  saveEdit(): void {
    if (!this.editingId) return;
    this.productService.updateProduct(this.editingId, this.draft).subscribe(() => {
      this.cancelEdit();
      this.loadProducts();
    });
  }

  deleteProduct(id: string | undefined): void {
    if (!id) return;
    this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
  }
}
