const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor de sockets 😀");
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
