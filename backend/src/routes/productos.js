import { Router } from "express";
import Producto from '../controllers/ProductoController.js'
import {v2 as cloudinary} from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tienda',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
})

const upload = multer({storage})

const router = Router();

router.route('/')
.get(Producto.obtenerProductos)
.post(upload.array('producto', 3), Producto.crearProducto)

router.route('/:id')
.get(Producto.obtenerProducto)
.put(Producto.actualizarProducto)
.delete(Producto.eliminarProducto)


export default router;