const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor de sockets 😀");
});

const addProduct = document.getElementById("product-form");
const deleteProduct = document.getElementById("delete-form");

addProduct.addEventListener("submit", (event) => {
  event.preventDefault();
  // Obtener los valores de los campos del formulario
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;

  // Crear un objeto con los valores del producto
  const productData = {
    title: title,
    description: description,
    price: price,
    thumbnail: thumbnail,
    code: code,
    stock: stock,
  };
  // Enviar el objeto del producto al servidor a través del socket
  socket.emit("new-product", productData);

  // Limpiar los campos del formulario después de enviar los datos
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("price").value = "";
  document.getElementById("thumbnail").value = "";
  document.getElementById("code").value = "";
  document.getElementById("stock").value = "";
});

deleteProduct.addEventListener("submit",(event)=>{
  event.preventDefault();
  const id = document.getElementById("id").value;
  socket.emit("delete-product", id);
  document.getElementById("id").value = "";
})

socket.on("update-list-products", ({ products }) => {
  const listProducts = document.getElementById("list-products");
  listProducts.innerText = "";

  products.forEach((product) => {
    const article = document.createElement("article");
    article.style.width = "30%";

    const idParagraph = document.createElement("p");
    idParagraph.innerHTML = `<strong>ID</strong>: ${product.id}`;
    article.appendChild(idParagraph);

    const nameParagraph = document.createElement("p");
    nameParagraph.innerHTML = `<strong>Nombre</strong>: ${product.title}`;
    article.appendChild(nameParagraph);

    const priceParagraph = document.createElement("p");
    priceParagraph.innerHTML = `<strong>Precio</strong>: ${product.price}`;
    article.appendChild(priceParagraph);

    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.innerHTML = `<strong>Descripción</strong>: ${product.description}`;
    article.appendChild(descriptionParagraph);

    const stockParagraph = document.createElement("p");
    stockParagraph.innerHTML = `<strong>Stock</strong>: ${product.stock}`;
    article.appendChild(stockParagraph);

    const thumbnailImage = document.createElement("img");
    thumbnailImage.style.height = "30%";
    thumbnailImage.src = product.thumbnail;
    thumbnailImage.alt = "";
    article.appendChild(thumbnailImage);

    listProducts.appendChild(article);
  });
});
