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
        // Puedes realizar acciones adicionales aquí, como actualizar la interfaz de usuario
      } else {
        console.error("Error al agregar el producto al carrito");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  }
});
