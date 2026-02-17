import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({ selector: "app-auth", templateUrl: "./auth.component.html" })
export class AuthComponent {
  mode: "login" | "signup" = "login";
  loading = false;
  error = "";
  loginForm = { email: "", password: "" };
  signupForm = { name: "", email: "", password: "", role: "user" };

  constructor(private authService: AuthService, private router: Router) {}

  setMode(mode: "login" | "signup"): void { this.mode = mode; this.error = ""; }

  login(): void {
    this.loading = true; this.error = "";
    this.authService.login(this.loginForm).subscribe({
      next: ({ user }) => { this.loading = false; this.router.navigate([user.role === "admin" ? "/admin" : "/products"]); },
      error: (err) => { this.loading = false; this.error = err?.error?.message || "Login failed"; },
    });
  }

  signup(): void {
    this.loading = true; this.error = "";
    this.authService.register(this.signupForm).subscribe({
      next: ({ user }) => { this.loading = false; this.router.navigate([user.role === "admin" ? "/admin" : "/products"]); },
      error: (err) => { this.loading = false; this.error = err?.error?.message || "Signup failed"; },
    });
  }
}
