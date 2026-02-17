import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CarouselSlide } from "../models/carousel.model";

@Injectable({ providedIn: "root" })
export class CarouselService {
  private readonly apiUrl = `${environment.apiUrl}/carousel`;
  constructor(private http: HttpClient) {}
  getSlides(): Observable<CarouselSlide[]> { return this.http.get<CarouselSlide[]>(this.apiUrl); }
}
