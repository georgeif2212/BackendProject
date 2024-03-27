document.addEventListener("DOMContentLoaded", () => {
  // Agrega un controlador de eventos a todos los botones "Agregar al carrito"
  document.querySelectorAll(".add-cart").forEach((button) => {
    button.addEventListener("click", function (event) {
      const productId = event.currentTarget.dataset.productId;
      const cartId = event.currentTarget.dataset.cartId.trim();

      addToCart(productId, cartId);
    });
  });

  async function addToCart(productId, cartId) {
    try {
      const response = await fetch(
        `/api/carts/${cartId}/products/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: 1,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Producto agregado al carrito", result);
      } else {
        console.error("Error al agregar el producto al carrito");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  }

  document
    .getElementById("deleteForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const access_token = document.getElementById("access-token").value;
      const productId = document.getElementById("id").value;
      console.log("HOLA: ", access_token);
      // Realiza la solicitud a la API con el ID del producto
      fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Producto eliminado:", data);
          // Puedes manejar la respuesta como desees
        })
        .catch((error) => {
          console.error("Error eliminando producto:", error);
          // Puedes manejar el error como desees
        });
    });
});
