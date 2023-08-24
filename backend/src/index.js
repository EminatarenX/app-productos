import { config } from "dotenv";
import express from "express"
import ProductosRoutes from './routes/productos.js'
import cors from 'cors'

config();

const app = express();
app.use(cors())

app.use(express.json());


app.use('/api/productos', ProductosRoutes)


const puerto = process.env.PORT || 4000;

app.listen(puerto, () => {
    console.log(`Server running on port ${puerto}`)
})