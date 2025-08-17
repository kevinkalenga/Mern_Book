import express from 'express'
import dotenv from "dotenv";
dotenv.config();
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';



const port = process.env.PORT || 8081;

connectDB(); // Connect to MongoDB

const app = express();

// Middleware 
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


// routes 

app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)

app.get("/", (req, res) => res.send("Api is running"))

app.listen(port, () => console.log(`Server is running on port ${port}!!!`))