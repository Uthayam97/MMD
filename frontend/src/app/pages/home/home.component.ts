import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // 👇 ADD THIS
  categories = [
    {
      name: 'Electronics',
      image: 'assets/categories/electronics.png'
    },
    {
      name: 'Fashion',
      image: 'assets/categories/fashion.png'
    },
    {
      name: 'Home Essentials',
      image: 'assets/categories/home.png'
    },
    {
      name: 'Groceries',
      image: 'assets/categories/grocery.png'
    }
  ];

  slides = [
    {
      title: 'Premium Collection',
      subtitle: 'Discover the latest trends',
      image: 'assets/slides/slide1.jpg'
    },
    {
      title: 'Mega Sale',
      subtitle: 'Up to 50% off',
      image: 'assets/slides/slide2.jpg'
    }
  ];

}
