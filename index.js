const express = require("express");
const app = express();
// variables de entorno
require("dotenv").config();

// Archivos estáticos
app.use(express.static(__dirname + "/public"));

// recibir body en JSON
app.use(express.json());

app.use(require("./router/usuario.js"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🎉🎉🎉 " + PORT));
