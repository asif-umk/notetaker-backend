import express from 'express'
import dotenv from 'dotenv'
const app = express()
import authRoutes from './routes/auth.js'
import { connectDB } from './config/db.js'
import notesRoutes from './routes/notes.js'
import cors from 'cors'
dotenv.config()

const origions = ["http://localhost:5173" , "https://roaring-flan-e4eaa3.netlify.app/"]
app.use(cors({
  origin: origions, // frontend URL
  credentials: true,               // allow cookies/auth headers
}));
app.use(express.json())

app.use('/api/users' , authRoutes)
app.use('/api/notes' , notesRoutes)

connectDB() 

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`)) 