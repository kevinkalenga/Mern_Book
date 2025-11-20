// import express from 'express'
// import dotenv from "dotenv";
// dotenv.config();
// import connectDB from './config/db.js';
// import productRoutes from './routes/productRoutes.js'
// import userRoutes from './routes/userRoutes.js'
// import cors from 'cors'
// import cookieParser from 'cookie-parser';
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// import orderRoutes from "./routes/orderRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import path from 'path'



// const port = process.env.PORT || 8081;

// connectDB(); // Connect to MongoDB

// const app = express();

// // Middleware 
// app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({extended: true}))
// app.use(cookieParser())


// // routes 

// app.use("/api/products", productRoutes)
// app.use("/api/orders", orderRoutes);
// app.use("/api/users", userRoutes)
// app.use("/api/upload", uploadRoutes);

// // PayPal route
// app.get("/api/config/paypal", (req, res) =>
//   res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
// );

// app.get("/", (req, res) => res.send("Api is running"))


// // Uploads static folder
// const __dirname = path.resolve();
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// // Serve frontend in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
//   app.get('/*', (req, res) =>
//     res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'))
//   );
// } else {
//   app.get('/', (req, res) => res.send('API is running...'));
// }



// app.use(notFound);
// app.use(errorHandler);

// app.listen(port, () => console.log(`Server is running on port ${port}!!!`))



import express from 'express';
import dotenv from "dotenv";
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import path from 'path';

dotenv.config();

const port = process.env.PORT || 8081;

connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// PayPal config route
app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Uploads static folder
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Serve frontend in production (Vite build)
if (process.env.NODE_ENV === 'production') {
   app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Catch-all middleware pour React Router
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    } else {
      next();
    }
  });
} else {
  // Route test rapide en dev
  app.get('/', (req, res) => res.send('API is running...'));
}

// Error middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}!!!`));
