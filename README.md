# VELNORA — E-Commerce Website
**Quiet Luxury · Everyday Elegance**

VELNORA is a full-stack fashion e-commerce web application designed to provide a smooth and user-friendly online shopping experience. It allows users to explore fashion products, manage their shopping carts, place orders, and make payments through Cash on Delivery (COD) or Razorpay.

## Features

### User Authentication
- User registration and login.
- JWT-based authentication.
- Protected routes using authentication middleware.
- Email verification using Nodemailer.
- Forgot-password and password-reset functionality.
- Cookie-based token management.

### Product Browsing
- Dynamic product details pages.
- Browse products by category:
  - Men
  - Women
  - Unisex
  - Footwear
- Product information including images, descriptions, prices, and available sizes.

### Shopping Cart
- Add products to the cart.
- Increase or decrease product quantities.
- Remove products from the cart.
- Calculate item totals and order subtotal.
- Calculate applicable GST and order totals.

### Checkout & Order Management
- Enter shipping and delivery details.
- Place orders through the checkout process.
- Support for Cash on Delivery (COD).
- Online payments using Razorpay.
- Payment verification on the server.
- View order history and order details.

### Payment Integration
- Razorpay Checkout integration.
- Server-side order creation.
- Payment verification using Razorpay credentials.
- Order and payment status management.

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive layouts |
| JavaScript | Client-side interactions |
| EJS | Dynamic server-rendered pages |
| Node.js | JavaScript runtime |
| Express.js | Backend routing and middleware |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| JSON Web Token (JWT) | Authentication |
| bcrypt | Password hashing |
| Nodemailer | Email verification and password reset |
| Razorpay | Online payment processing |
| dotenv | Environment variable management |

## 📁 Project Structure

The project follows a MVC structure. The exact file names may vary depending on your implementation.

e-commerce/
├── config/
│   └── database.js
├── models/
│   ├── user.js
│   ├── products.js
│   ├── cart.js
│   └── order.js
├── controllers/
│   ├── app_controllers.js
│   └── auth_controllers.js
├── routes/
│   ├── authentication.js
│   └── products.js
├── middlewares/
│   └── protected_route_middleware.js
├── scripts/
│   └── seedAdmin.js
├── views/
│   ├── dashboard.ejs
│   ├── productDetails.ejs
│   ├── category.ejs
│   ├── cart.ejs
│   ├── placeOrder.ejs
│   ├── orders.ejs
│   ├── history.ejs
│   └── partials/
├── public/
│   ├── style.css
│   ├── images/
│   └── js/
|── utils/
|   |──membershipBenifits.js
├── .env
├── .gitignore
├── package.json
└── server.js

## Installation and Setup

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd e-commerce
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:

```env
PORT=2100

MONGODB_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

SENDER_EMAIL=your_email@gmail.com
PASSWORD=your_email_app_password

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Replace the placeholder values with your own credentials.

**Important:** Use a Gmail App Password where required for Nodemailer. Never publish your database credentials, JWT secret, email password, or Razorpay secret key.

### 4. Start the application

If your entry file is `server.js`, run:

```bash
node server.js
```

If you have configured a start script in `package.json`, you can use:

```bash
npm start
```

### 5. Open the website

Visit:

```text
http://localhost:2100
```

Make sure your MongoDB Atlas connection is configured correctly and your database is accessible.

## Authentication Flow
1. A user registers or signs in.
2. Passwords are securely hashed before storage.
3. Email verification is handled through Nodemailer.
4. JWT-based authentication identifies the user.
5. Authentication middleware protects restricted routes.
6. Cookie-based tokens are used to maintain authenticated access.

## Shopping and Order Flow
1. Browse products and select a product.
2. Add the product to the shopping cart.
3. Update quantities or remove items.
4. Proceed to checkout.
5. Enter shipping information.
6. Review the order total, including applicable GST.
7. Select COD or Razorpay.
8. Complete the payment process, when applicable.
9. View orders in the order history section.

## Environment Variables
| Variable | Description |
|---|---|
| `PORT` | Port on which the server runs |
| `MONGODB_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT signing and verification |
| `SENDER_EMAIL` | Email account used for sending messages |
| `PASSWORD` | Email account's app password |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |

Keep `.env` out of version control and add it to `.gitignore`.

## Project Objective
The objective of VELNORA is to build a practical full-stack application that demonstrates frontend development, backend API and route design, database integration, authentication, session-independent token handling, and secure payment workflows.

## Author

**Sanchi Bareja**
BCA (Hons) — Artificial Intelligence

Built as a full-stack web development project.

---

*VELNORA — Elegance in Every Step.*