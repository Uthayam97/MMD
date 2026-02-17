import { Component, OnInit } from "@angular/core";
import { Product } from "../../models/product.model";
import { User } from "../../models/user.model";
import { ProductService } from "../../services/product.service";
import { UserService } from "../../services/user.service";

@Component({ selector: "app-admin-dashboard", templateUrl: "./admin-dashboard.component.html" })
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  users: User[] = [];
  editingId: string | null = null;
  selectedImageName = "";
  fileError = "";
  submitted = false;
  productForm: Product = { name: "", description: "", image: "", price: 0, stock: 0 };
  constructor(private productService: ProductService, private userService: UserService) {}

  ngOnInit(): void { this.loadProducts(); this.loadUsers(); }
  loadProducts(): void { this.productService.getProducts().subscribe((p) => (this.products = p)); }
  loadUsers(): void { this.userService.getUsers().subscribe((u) => (this.users = u)); }
  editProduct(product: Product): void { this.editingId = product._id || null; this.productForm = { ...product }; }
  resetForm(): void {
    this.editingId = null;
    this.selectedImageName = "";
    this.fileError = "";
    this.submitted = false;
    this.productForm = { name: "", description: "", image: "", price: 0, stock: 0 };
  }
  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      this.fileError = "Please choose a valid image file.";
      input.value = "";
      return;
    }

    this.fileError = "";
    this.selectedImageName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      this.productForm.image = (reader.result as string) || "";
    };
    reader.readAsDataURL(file);
  }
  saveProduct(): void {
    this.submitted = true;
    const name = (this.productForm.name || "").trim();
    const description = (this.productForm.description || "").trim();
    const image = (this.productForm.image || "").trim();
    const price = Number(this.productForm.price);
    const stock = Number(this.productForm.stock);

    if (!name || !description || !image) return;
    if (!Number.isFinite(price) || price <= 0) return;
    if (!Number.isFinite(stock) || stock < 0) return;

    const payload: Product = {
      ...this.productForm,
      name,
      description,
      image,
      price,
      stock,
    };

    if (this.editingId) {
      this.productService.updateProduct(this.editingId, payload).subscribe(() => { this.loadProducts(); this.resetForm(); });
      return;
    }
    this.productService.createProduct(payload).subscribe(() => { this.loadProducts(); this.resetForm(); });
  }
  deleteProduct(id: string | undefined): void { if (id) this.productService.deleteProduct(id).subscribe(() => this.loadProducts()); }
}
