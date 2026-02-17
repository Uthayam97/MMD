import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
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
import { AuthInterceptor } from "./interceptors/auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    ProductsComponent,
    AuthComponent,
    CartComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    AddProductComponent,
    AllProductsComponent,
    OrderTrackingComponent,
    RegisteredUsersComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
