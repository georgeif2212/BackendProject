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
  const category = document.getElementById("category").value;

  // Crear un objeto con los valores del producto
  const productData = {
    title: title,
    description: description,
    price: price,
    thumbnail: thumbnail,
    code: code,
    stock: stock,
    category: category,
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

deleteProduct.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = document.getElementById("id").value;
  socket.emit("delete-product", id);
  document.getElementById("id").value = "";
});

socket.on("update-list-products", ({ products }) => {
  const listProducts = document.getElementById("list-products");
  listProducts.innerText = "";
  products.forEach((product) => {
    const article = document.createElement("article");
    article.classList.add("card", "product-real-time");

    const thumbnailImage = document.createElement("img");
    thumbnailImage.classList.add("card-img-top", "product-real-time__img");
    thumbnailImage.src = product.thumbnail;
    thumbnailImage.alt = "";
    article.appendChild(thumbnailImage);

    const div = document.createElement("div");
    div.classList.add("card-body");
    article.append(div);

    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.innerHTML = `${product.title}`;
    div.appendChild(title);

    let p = document.createElement("p");
    p.classList.add("card-text");
    p.innerHTML = `<strong>ID</strong>: ${product._id}`;
    div.appendChild(p);

    p = document.createElement("p");
    p.innerHTML = `<strong>Precio</strong>: ${product.price}`;
    div.appendChild(p);

    p = document.createElement("p");
    p.innerHTML = `<strong>Descripción</strong>: ${product.description}`;
    div.appendChild(p);

    p = document.createElement("p");
    p.innerHTML = `<strong>Stock</strong>: ${product.stock}`;
    div.appendChild(p);

    listProducts.appendChild(article);
  });
});
