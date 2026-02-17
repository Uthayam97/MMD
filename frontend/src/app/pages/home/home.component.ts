import { Component, OnInit } from "@angular/core";
import { CarouselSlide } from "../../models/carousel.model";
import { CarouselService } from "../../services/carousel.service";

@Component({ selector: "app-home", templateUrl: "./home.component.html", styleUrls: ["./home.component.css"] })
export class HomeComponent implements OnInit {
  slides: CarouselSlide[] = [];
  constructor(private carouselService: CarouselService) {}
  ngOnInit(): void {
    this.carouselService.getSlides().subscribe({ next: (slides) => (this.slides = slides), error: () => (this.slides = []) });
  }
}
