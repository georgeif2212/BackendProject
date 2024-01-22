
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
