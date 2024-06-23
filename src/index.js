const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;

try {
    mongoose.connect(mongoUri);
    console.log("conectado a MonogoDB");
}    catch (error){
    console.error("Error de conecion", error);
}

  const libroSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
  })

  const Libro = mongoose.model("Libro", libroSchema);

//Rutas

app.get("/api", (req, res) =>{
    res.send("Bienvenido a la tienda de libros");
});

app.use((req, res, next) => {
   const authToken = req.headers["authorization"];
   
   if (authToken === "miTokenSecreto123") {
    next();

   } else {
    res.status(401).send("Aceso no autorizado")
   }
})

//Crear un nuevo libro
app.post("/libros", async (req, res) => {
    const libro = new Libro({
        titulo: req.body.titulo,
        autor: req.body.autor,
    })

    try {
      await libro.save();
      res.json(libro);
    } catch(error){
        res.status(500).send("Error al guardar libro");
    }
});
//obtener libro por id
app.get("/libros/:id", async (req, res) => {
    try{
        //const id = req.params.id;
        //const libro = await Libro.findById(id);
        const libro = await Libro.findById(req.params.id);

      if(libro) {
        res.json(libro)
      } else{
        res.status(404).send("libro no encontrado")
      }
    } catch (error){
      res.status(500).send("Error al buscar el libro");
    }
})

//obtener libro por titulo
app.get("/librotitulo", async (req, res) => {
  try {
    const tituloLibro = req.query.titulo;
    const libro = await Libro.findOne({ titulo: tituloLibro});
    if(libro) {
      res.json(libro);

    } else {
      res.status(404).send("libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al buscar el libro");
    
  }  
});


// Traer todos los libros
app.get("/libros", async (req, res) => {
    try{
        const libros = await Libro.find();
        res.json(libros);
    } catch (Error){
        res.status(500).send("Error al obtener libros")

    }
})

// Actualizar libro por id

app.put("/libros/:id", async (req, res) => {
  try {
    const libro = await Libro.findByIdAndUpdate(
      req.params.id,
      {
        titulo: req.body.titulo,
        autor: req.body.autor,
      },
      { new: true } // Esta opción hará que se devuelva el documento actualizado
    );

    if (libro) {
      res.json(libro);
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al actualizar el libro");
  }
 });

 // Ruta para eliminar un libro por id
 
 app.delete("/libros/:id", async (req, res) => {
  try {
    const libro = await Libro.findByIdAndRemove(req.params.id);
    if (libro) {
      res.status(204).send();
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al eliminar el libro");
  }
});

module.exports = app;




