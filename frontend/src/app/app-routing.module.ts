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
  { path: "admin", component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: "**", redirectTo: "" },
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
