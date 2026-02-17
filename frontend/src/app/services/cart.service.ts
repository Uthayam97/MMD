import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, map, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { Cart } from "../models/cart.model";

@Injectable({ providedIn: "root" })
export class CartService {
  private readonly apiUrl = `${environment.apiUrl}/cart`;
  private readonly cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();
  private readonly cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadCart(): Observable<Cart> { return this.http.get<Cart>(this.apiUrl).pipe(tap((c) => this.setCartState(c))); }
  addToCart(productId: string, quantity = 1): Observable<Cart> { return this.http.post<Cart>(this.apiUrl, { productId, quantity }).pipe(tap((c) => this.setCartState(c))); }
  updateQuantity(productId: string, quantity: number): Observable<Cart> { return this.http.put<Cart>(this.apiUrl, { productId, quantity }).pipe(tap((c) => this.setCartState(c))); }
  removeFromCart(productId: string): Observable<Cart> { return this.http.delete<Cart>(`${this.apiUrl}/${productId}`).pipe(tap((c) => this.setCartState(c))); }
  clearState(): void { this.cartSubject.next(null); this.cartCountSubject.next(0); }
  totalAmount$(): Observable<number> { return this.cart$.pipe(map((cart) => cart?.items?.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0) || 0)); }

  private setCartState(cart: Cart): void {
    this.cartSubject.next(cart);
    this.cartCountSubject.next(cart.items?.reduce((s, i) => s + i.quantity, 0) || 0);
  }
}
