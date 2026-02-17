import { Component } from "@angular/core";
import { Product } from "../../../../models/product.model";
import { ProductService } from "../../../../services/product.service";

@Component({
  selector: "app-admin-add-product",
  templateUrl: "./add-product.component.html",
})
export class AddProductComponent {
  selectedImageName = "";
  fileError = "";
  submitted = false;
  successMessage = "";
  productForm: Product = { name: "", description: "", image: "", price: 0, stock: 0 };

  constructor(private productService: ProductService) {}

  reset(): void {
    this.selectedImageName = "";
    this.fileError = "";
    this.submitted = false;
    this.successMessage = "";
    this.productForm = { name: "", description: "", image: "", price: 0, stock: 0 };
  }

  onFileSelected(event: Event): void {
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

  save(): void {
    this.submitted = true;
    this.successMessage = "";
    const name = (this.productForm.name || "").trim();
    const description = (this.productForm.description || "").trim();
    const image = (this.productForm.image || "").trim();
    const price = Number(this.productForm.price);
    const stock = Number(this.productForm.stock);

    if (!name || !description || !image) return;
    if (!Number.isFinite(price) || price <= 0) return;
    if (!Number.isFinite(stock) || stock < 0) return;

    const payload: Product = { ...this.productForm, name, description, image, price, stock };
    this.productService.createProduct(payload).subscribe(() => {
      this.successMessage = "Product added successfully.";
      this.reset();
      this.successMessage = "Product added successfully.";
    });
  }
}
