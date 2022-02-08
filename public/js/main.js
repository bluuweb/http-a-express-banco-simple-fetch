const formulario = document.querySelector("#formulario");
const formularioEditar = document.querySelector("#formularioEditar");
const usuarios = document.querySelector("#usuarios");

var myModal = new bootstrap.Modal(document.querySelector("#modalEditar"));

let usuariosDB = [];

const pintarUsuarios = () => {
    usuarios.innerHTML = "";
    usuariosDB.forEach((user) => {
        usuarios.innerHTML += `
        <article class="alert alert-primary d-flex justify-content-between align-items-center">
            <div>
                <p class="m-0">${user.nombre} - $${user.balance}</p>
            </div>
            <div>
                <button class="btn btn-warning" data-id="${user.id}">Editar</button>
                <button class="btn btn-danger" data-id="${user.id}">Eliminar</button>
            </div>
        </article>
        `;
    });
};

const pintarFormularioEditar = (data) => {
    myModal.show();
    formularioEditar.innerHTML = `
    <input placeholder="Nombre Usuario" type="text" class="form-control mb-2" name="nombre"
        value="${data.nombre}">
    <input placeholder="Nombre Usuario" type="text" class="form-control mb-2" name="balance"
        value="${data.balance}">
    <input type="text" class="form-control mb-2 d-none"
        value="${data.id}" name="usuarioID">
    <button class="btn btn-warning" type="submit" data-bs-dismiss="modal">Editar</button>
    `;
};

usuarios.addEventListener("click", async (e) => {
    if (e.target.matches(".btn-warning")) {
        console.log(e.target.dataset.id);
        try {
            const res = await fetch(
                "http://localhost:5000/api/usuario/" + e.target.dataset.id
            );
            const { data } = await res.json();
            pintarFormularioEditar(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    if (e.target.matches(".btn-danger")) {
        console.log(e.target.dataset.id);
        try {
            const res = await fetch(
                "http://localhost:5000/api/usuario/" + e.target.dataset.id,
                {
                    method: "DELETE",
                }
            );
            const { data } = await res.json();
            usuariosDB = usuariosDB.filter((item) => item.id !== data.id);
            pintarUsuarios();
        } catch (error) {
            console.log(error);
        }
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("http://localhost:5000/api/usuario");
        const { data } = await res.json();

        usuariosDB = data;
        pintarUsuarios();
    } catch (error) {
        console.log(error);
    }
});

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = new FormData(formulario);
    const [nombre, balance] = [...datos.values()];
    // console.log(JSON.stringify({ nombre, balance }));

    try {
        const res = await fetch("http://localhost:5000/api/usuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nombre, balance }),
        });
        // console.log(res);
        const { data } = await res.json();
        // console.log(data);
        usuariosDB.push(data);
        pintarUsuarios();
    } catch (error) {
        console.log(error);
    }
});

formularioEditar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = new FormData(formularioEditar);
    const [nombre, balance, id] = [...datos.values()];
    console.log([...datos.values()]);
    // console.log(JSON.stringify({ nombre, balance, id }));

    try {
        const res = await fetch("http://localhost:5000/api/usuario", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nombre, balance, id }),
        });
        const { data } = await res.json();
        // console.log(data);
        usuariosDB = usuariosDB.map((item) =>
            item.id === data.id ? { ...data } : item
        );
        console.log(usuariosDB);
        pintarUsuarios();
    } catch (error) {
        console.log(error);
    }
});
