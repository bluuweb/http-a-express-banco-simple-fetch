const express = require("express");
const router = express.Router();

const {
    guardarUsuario,
    leerUsuarios,
    editarUsuario,
    eliminarUsuario,
    leerUsuario,
} = require("../controller/bancoController");

router.post("/api/usuario", guardarUsuario);
router.get("/api/usuario", leerUsuarios);
router.put("/api/usuario", editarUsuario);
router.get("/api/usuario/:id", leerUsuario);
router.delete("/api/usuario/:id", eliminarUsuario);

module.exports = router;
