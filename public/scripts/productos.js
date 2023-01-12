const items = document.getElementById("items");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();
let idCart;

document.addEventListener("DOMContentLoaded", (e) => {
  fetchUsuario();
  fetchData();
});

//Traer el ID del Usuario
const fetchUsuario = async () => {
  try {
    const res = await fetch("/idUsuario");
    const data = await res.json();
    fetchCarrito(data);
  } catch (error) {
    console.log(error);
  }
};

//Agregar Carrito Nuevo
const fetchAgregarCarrito = async (usuario) => {
  try {
    const res = await fetch(`/api/carrito/${usuario}`, { method: "POST" });
    const data = await res.json();
    idCart = data.newId;
    console.log(idCart);
  } catch (error) {
    console.log(error);
  }
};

//Traer el ID del Carrito
const fetchCarrito = async (usuario) => {
  try {
    const res = await fetch(`api/carrito/idCarrito/${usuario}`);
    data = await res.json();
    if (data) {
      idCart = data;
      console.log(idCart);
    } else {
      fetchAgregarCarrito(usuario);
    }
  } catch (error) {
    console.log(error);
  }
};

//Traer Productos de la BD de productos
const fetchData = async () => {
  try {
    const res = await fetch("/api/productos");
    const data = await res.json();
    pintarCards(data);
  } catch (error) {
    console.log(error);
  }
};

// Pintar productos
const pintarCards = (data) => {
  data.forEach((item) => {
    templateCard.querySelector("img").setAttribute("src", item.thumbnail);
    templateCard.querySelector("h5").textContent = item.title;
    templateCard.querySelector(".description").textContent = item.description;
    templateCard.querySelector(".code span").textContent = item.code;
    templateCard.querySelector(".time span").textContent = item.timestamp;
    templateCard.querySelector(".price span").textContent = item.price;
    templateCard.querySelector(".stock span").textContent = item.stock;
    templateCard.querySelector(".btn-dark").dataset.id = item.id_prod;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);
};

document.addEventListener("click", (e) => {
  if (e.target.matches(".card .btn-dark")) {
    fetchAgregarProductos(e.target.parentElement);
  }
  e.stopPropagation();
});

//Agregar Productos al Carrito
const fetchAgregarProductos = async (objeto) => {
  console.log("Cargar Producto");
   try {
    let carritoSelect = document.getElementById("cartSelect").value;
    const url = `/api/carrito/${carritoSelect}/productos`;
    const producto = {
      id: idCart,
      id_prod: objeto.querySelector(".btn-dark").dataset.id,
      timestamp: objeto.querySelector(".time").textContent,
      title: objeto.querySelector("h5").textContent,
      description: objeto.querySelector(".description").textContent,
      code: objeto.querySelector(".code").textContent,
      thumbnail: objeto.querySelector(".time").textContent,
      price: objeto.querySelector(".price span").textContent,
      stock: objeto.querySelector(".stock").textContent,
    };

    await fetch(url, {
      method: "POST",
      body: JSON.stringify(producto),
      headers: {
        "Content-Type": "application/json",
      },
    });
    
  } catch (error) {
    console.log(error);
  }
};
