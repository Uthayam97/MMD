# Department Store Web Application

Full-stack Department Store application using Angular 16 + Bootstrap 5 (frontend) and Node.js + Express + MongoDB (backend).

## Tech Stack
- Frontend: Angular 16, HTML5, CSS3, Bootstrap 5
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Security: JWT auth, bcrypt password hashing, route guards, HTTP interceptor, CORS

## Project Structure
```text
New folder (2)/
  frontend/
    src/
      app/
        components/
          navbar/
        pages/
          home/
          about/
          contact/
          products/
          auth/
          cart/
          admin-dashboard/
        services/
        guards/
        interceptors/
        models/
        app.module.ts
        app-routing.module.ts
      environments/
      styles.css
    angular.json
    package.json
  backend/
    src/
      config/
        db.js
      middleware/
        auth.middleware.js
      models/
        User.js
        Product.js
        Cart.js
        Contact.js
        Carousel.js
      controllers/
        auth.controller.js
        product.controller.js
        cart.controller.js
        contact.controller.js
        user.controller.js
        carousel.controller.js
      routes/
        auth.routes.js
        product.routes.js
        cart.routes.js
        contact.routes.js
        user.routes.js
        carousel.routes.js
      app.js
      server.js
    .env.example
    package.json
```

## Installation

### 1) Backend setup
```bash
cd backend
npm install
```

Create `.env` from `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/department_store_db
JWT_SECRET=replace_with_secure_secret
```

Run backend:
```bash
npm run dev
```

### 2) Frontend setup
```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:4200`
Backend runs at `http://localhost:5000`

## Implemented Features
- Common navbar component on all pages
- Angular routing for all pages
- Home page carousel (data from backend API)
- About page with professional content
- Contact page using reactive form (stored in MongoDB)
- Products page with API fetch, search, and buy/add-to-cart
- Signup/Login with JWT auth and role-based redirection
- Cart add/remove/update quantity (MongoDB persistent)
- Admin dashboard: product CRUD and users list
- Admin guard and auth guard
- HTTP interceptor adding JWT token

## API Documentation
Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register`
  - Body:
    ```json
    {
      "name": "Admin User",
      "email": "admin@example.com",
      "password": "123456",
      "role": "admin"
    }
    ```
- `POST /auth/login`
  - Body:
    ```json
    {
      "email": "admin@example.com",
      "password": "123456"
    }
    ```

### Products
- `GET /products` (public)
- `POST /products` (admin)
- `PUT /products/:id` (admin)
- `DELETE /products/:id` (admin)

Example product body:
```json
{
  "name": "Premium Backpack",
  "description": "Durable and stylish",
  "image": "https://example.com/bag.jpg",
  "price": 89.99,
  "stock": 50
}
```

### Cart (requires JWT)
- `GET /cart`
- `POST /cart`
  - Body:
    ```json
    { "productId": "<productId>", "quantity": 2 }
    ```
- `PUT /cart`
  - Body:
    ```json
    { "productId": "<productId>", "quantity": 3 }
    ```
- `DELETE /cart/:productId`

### Contact
- `POST /contact`

Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555 123 4567",
  "subject": "Support",
  "message": "Need help with my order"
}
```

### Users (admin only)
- `GET /users`

### Carousel
- `GET /carousel`

### Health
- `GET /health`

## NPM Scripts
### Backend
- `npm run dev` - start backend with nodemon
- `npm start` - start backend with node

### Frontend
- `npm start` - run Angular dev server
- `npm run build` - production build

## Notes
- Signup form currently allows selecting `user` or `admin` role for development/testing.
- Protect production registration flow by restricting admin creation to backend-only logic.
