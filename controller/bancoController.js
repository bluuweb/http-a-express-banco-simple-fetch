const pool = require("../db");

module.exports.guardarUsuario = async (req, res) => {
    const { nombre, balance } = req.body;
    // console.log(nombre, balance);

    if (!nombre || !balance) {
        return res.status(400).json({
            ok: false,
            data: "Algo faltó o nombre o balance 😭",
        });
    }

    if (!nombre.trim() || isNaN(balance) || balance < 0) {
        return res.status(400).json({
            ok: false,
            data: "No envíaste los datos correctamente 😭",
        });
    }

    const client = await pool.connect();

    const query = {
        text: "INSERT INTO usuarios (nombre,balance) values ( $1, $2) RETURNING *",
        values: [nombre, balance],
    };

    try {
        const respuesta = (await client.query(query)).rows[0];
        res.status(201).json({
            ok: true,
            data: respuesta,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            data: "Algo falló con DB",
        });
    } finally {
        client.release();
    }
};

module.exports.leerUsuarios = async (req, res) => {
    const client = await pool.connect();
    const query = {
        text: "SELECT * FROM usuarios",
    };

    try {
        const respuesta = (await client.query(query)).rows;
        res.status(200).json({
            ok: true,
            data: respuesta,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            data: "Algo falló con DB",
        });
    } finally {
        client.release();
    }
};

module.exports.editarUsuario = async (req, res) => {
    const { nombre, balance, id } = req.body;

    if (!nombre || !balance || !id) {
        return res.status(400).json({
            ok: false,
            data: "Algo faltó o nombre o balance 😭",
        });
    }

    if (!nombre.trim() || isNaN(balance) || balance < 0) {
        return res.status(400).json({
            ok: false,
            data: "No envíaste los datos correctamente 😭",
        });
    }

    const client = await pool.connect();
    const query = {
        text: "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *",
        values: [nombre, balance, id],
    };

    try {
        const respuesta = (await client.query(query)).rows;

        if (respuesta.length === 0) {
            return res.status(404).json({
                ok: false,
                data: "No se encontró el usuario",
            });
        }

        res.status(200).json({
            ok: true,
            data: respuesta[0],
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            data: "Algo falló con DB",
        });
    } finally {
        client.release();
    }
};

module.exports.eliminarUsuario = async (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;

    const client = await pool.connect();
    const query = {
        text: "DELETE FROM usuarios WHERE id = $1 RETURNING *",
        values: [id],
    };

    try {
        const respuesta = (await client.query(query)).rows;

        if (respuesta.length === 0) {
            return res.status(404).json({
                ok: false,
                data: "No se encontró el usuario",
            });
        }

        res.status(200).json({
            ok: true,
            data: respuesta[0],
        });
    } catch (error) {
        console.log(error);
        if (error.code === "22P02") {
            return res.status(400).json({
                ok: false,
                data: "Trata de enviar un número",
            });
        }
        res.status(500).json({
            ok: false,
            data: "Algo falló con DB",
        });
    } finally {
        client.release();
    }
};
