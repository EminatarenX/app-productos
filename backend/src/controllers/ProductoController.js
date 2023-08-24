import { PrismaClient } from "@prisma/client";
import {v2 as cloudinary} from 'cloudinary'


const prisma = new PrismaClient();

const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body
  const imagenes = req.files
  // console.log(req.files)
  // console.log(req.body)
  // return
  try {
    // subir datos del producto a la base de datos
    const producto = await prisma.producto.create({
      data: {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        stock: parseInt(stock),
      }
    })
    // subir url de imagenes a la base de datos
    const imagenesSubidas = []

    for await (const img of imagenes) {

      const resultado = await cloudinary.uploader.upload(img.path)
      const cloudinaryUrl = resultado.secure_url

      await prisma.imagen.create({
        data: {
          url: cloudinaryUrl,
          producto: {
            connect: {
              id: producto.id
            }
          }
        }
      })

        imagenesSubidas.push(cloudinaryUrl)

    }

    return res.status(201).json({msg: 'Producto creado', producto, imagenesSubidas})

    
  } catch (error) {
    console.log(error)
  }



}

const obtenerProductos = async (req, res) => {
  const productos = await prisma.producto.findMany({include: {imagenes: true}})

  if(productos.length === 0){
    const error = new Error('No hay productos')
    return res.status(404).json({msg: error.message})
  }

  prisma.$disconnect()

  return res.status(200).json(productos)
}

const obtenerProducto = async(req, res) => {
  const { id } = req.params

  const producto = await prisma.producto.findFirst({
    where: {
      id: parseInt(id)
    }
  })

  if(!producto){
    const error = new Error("No existe el producto")
    return res.status(404).json({msg: error.message})
  }

  prisma.$disconnect()

  return res.status(200).json(producto)
}

const actualizarProducto = async(req, res) => {
  res.json('actualizarProducto')
}

const eliminarProducto = async(req, res) => {
  res.json('eliminando...')
}

export default {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto
}