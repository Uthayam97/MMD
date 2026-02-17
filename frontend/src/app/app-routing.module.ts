import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { AboutComponent } from "./pages/about/about.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { ProductsComponent } from "./pages/products/products.component";
import { AuthComponent } from "./pages/auth/auth.component";
import { CartComponent } from "./pages/cart/cart.component";
import { AdminDashboardComponent } from "./pages/admin-dashboard/admin-dashboard.component";
import { UserDashboardComponent } from "./pages/user-dashboard/user-dashboard.component";
import { AddProductComponent } from "./pages/admin-dashboard/components/add-product/add-product.component";
import { AllProductsComponent } from "./pages/admin-dashboard/components/all-products/all-products.component";
import { OrderTrackingComponent } from "./pages/admin-dashboard/components/order-tracking/order-tracking.component";
import { RegisteredUsersComponent } from "./pages/admin-dashboard/components/registered-users/registered-users.component";
import { AuthGuard } from "./guards/auth.guard";
import { AdminGuard } from "./guards/admin.guard";
import { UserGuard } from "./guards/user.guard";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "contact", component: ContactComponent },
  { path: "products", component: ProductsComponent },
  { path: "auth", component: AuthComponent },
  { path: "cart", component: CartComponent, canActivate: [AuthGuard] },
  { path: "user-dashboard", component: UserDashboardComponent, canActivate: [UserGuard] },
  {
    path: "admin",
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: "", redirectTo: "add-product", pathMatch: "full" },
      { path: "add-product", component: AddProductComponent },
      { path: "all-products", component: AllProductsComponent },
      { path: "order-tracking", component: OrderTrackingComponent },
      { path: "registered-users", component: RegisteredUsersComponent },
    ],
  },
  { path: "**", redirectTo: "" },
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
