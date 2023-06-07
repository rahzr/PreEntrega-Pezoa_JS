let sPhoneData;
let carritoData = [];
let marcasFiltradas = new Set();

fetch('assets/data/productos.json')
  .then(response => response.json())
  .then(data => {
    sPhoneData = data;
    muestraDatos();
    addMarcas();
  })
  .catch(error => {
    console.error('Error json:', error);
  });

function muestraDatos() {
  if (!sPhoneData) {
    return;
  }

  let gridProductos = document.querySelector(".grid-productos");
  let fragmento = document.createDocumentFragment();

  // itera sobre los productos
  sPhoneData.forEach(item => {
    let productCard = document.createElement("div");
    let precioFormateado = item.precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    let ofertaFormateada = item.oferta.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    productCard.classList.add("uk-width-1-2", "uk-width-1-4@m", "product-card");

    productCard.innerHTML = `
      <div class="uk-card uk-light uk-relative">
        <span class="sku">${item.id}</span>
        <figure>
          <img class="img-producto" src="${item.rutaImg}"/>
        </figure>
        <div class="marca uk-text-small">${item.marca}</div>
        <div class="modelo uk-card-title">${item.modelo}</div>
        <div class="uk-text-small atributos">
          <span class="color">${item.color}</span>
          <span class="capacidad">${item.capacidad}</span>
        </div>
        <div class="oferta">$${ofertaFormateada}</div>
        <div class="uk-text-small">$${precioFormateado}</div>
        <button class="btn-agrega uk-button-default uk-padding-small uk-width-1-1 uk-margin-top">Agregar al carrito</button>
      </div>`;

    fragmento.appendChild(productCard);
  });

  // limpia y agrega el fragmento al contenedor
  gridProductos.innerHTML = "";
  gridProductos.appendChild(fragmento);

  let searchBox = document.querySelector(".uk-search-input");
  let searchForm = document.querySelector(".uk-search");

  searchBox.addEventListener("input", () => {
    performSearch();
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    performSearch();
  });

  function performSearch() {
    let searchTerm = searchBox.value.toLowerCase();
    let productCards = document.querySelectorAll(".grid-productos .product-card");

    // itera sobre html de producto, muestra y oculta segun la busqueda
    productCards.forEach(card => {
      let marca = card.querySelector(".product-card .marca").textContent.toLowerCase();
      let modelo = card.querySelector(".product-card .modelo").textContent.toLowerCase();
      let color = card.querySelector(".product-card .color").textContent.toLowerCase();
      let id = card.querySelector(".product-card .sku").textContent.toLowerCase();

      if (marca.includes(searchTerm) || modelo.includes(searchTerm) || color.includes(searchTerm) || id.includes(searchTerm)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  }

  // manejo del boton agregar al carrito
  let addToCartButtons = document.querySelectorAll(".btn-agrega");

  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      let productCard = button.closest(".product-card");
      let sku = productCard.querySelector(".sku").textContent;
      let imgProducto = productCard.querySelector(".img-producto").getAttribute("src");
      let marca = productCard.querySelector(".marca").textContent;
      let modelo = productCard.querySelector(".modelo").textContent;
      let color = productCard.querySelector(".color").textContent;
      let oferta = productCard.querySelector(".oferta").textContent;

      let carritoInfo = document.createElement("div");
      carritoInfo.classList.add("info");

      carritoInfo.innerHTML = `
      <figure>
        <img src="${imgProducto}"/>
      </figure>
      <div>
        <div class="marca">${marca}</div>
        <div class="modelo">${modelo}</div>
        <div class="color">${color}</div>
        <div class="oferta">${oferta}</div>
        <button class="btn-quitar uk-button-default uk-width-1-1 uk-margin-top">Quitar</button>
      </div>`;

      document.querySelector("#carrito").appendChild(carritoInfo);

      carritoData.push({
        sku,
        marca,
        modelo,
        color,
        oferta
      });

      updateCarrito();
      saveCarritoData();

      let removeButton = carritoInfo.querySelector(".btn-quitar");

      removeButton.addEventListener("click", () => {

        carritoInfo.remove();

        // encuentra el indice del producto en el arreglo y lo quita
        let index = carritoData.findIndex(product => product.sku === sku);
        if (index !== -1) {
          carritoData.splice(index, 1);
        }

        updateCarrito();
        saveCarritoData();

        // notificacion de toastify cuando se elimina un producto
        Toastify({
          text: `${marca} ${modelo} eliminado al carrito`,
          avatar: `${imgProducto}`,
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "center",
          stopOnFocus: true,
          style: {
            background: "var(--red)",
          },
          onClick: function () {} // Callback after click
        }).showToast();
      });

      // notificacion de toastify cuando se agrega un producto
      Toastify({
        text: `${marca} ${modelo} agregado al carrito`,
        avatar: `${imgProducto}`,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "var(--turquoise)",
          color: "var(--blue-dark)"
        },
        onClick: function () {} // Callback after click
      }).showToast();
    });
  });

  function updateCarrito() {
    let valorTotal = 0;
    let pedidoTexto = "";
  
    carritoData.forEach(product => {
      let precio = Number(product.oferta.replace("$", "").replace(".", ""));
      valorTotal += precio;
  
      // agrega la información del producto al texto del pedido
      pedidoTexto += " - " + `${product.marca} ${product.modelo}`;
    });
  
    let valorTotalFormateado = valorTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    document.getElementById("TotalForm").textContent = `$${valorTotalFormateado}`;
  
    // actualiza el contenido del input del pedido
    document.getElementById("pedido").value = pedidoTexto;
    document.querySelector(".valor-total").textContent = valorTotalFormateado;

    // console.log(pedidoTexto);
    // console.log(valorTotalFormateado);
  }

  let formCarrito = document.getElementById("formCarrito");

  formCarrito.addEventListener("submit", (event) => {
    event.preventDefault();

    // valores del formulario
    let nombre = document.getElementById("nombre").value;
    let telefono = document.getElementById("telefono").value;
    let correo = document.getElementById("correo").value;
    let pedido = document.getElementById("pedido").value;
    let pedidoTotal = document.getElementById("TotalForm").textContent;

    // verificar que la iformacion esta siendo rescatada
    // console.log("Nombre:", nombre);
    // console.log("Teléfono:", telefono);
    // console.log("Correo electrónico:", correo);
    // console.log("Pedido:", pedido);
    // console.log("Total:", pedidoTotal);

    // limpia el carrito
    carritoData = [];
    document.querySelector("#carrito").innerHTML = "";

    // limpia el local storage
    localStorage.removeItem("carritoData");

    updateCarrito();
  });


  function saveCarritoData() {
    // guarda los datos del carrito en local storage
    localStorage.setItem("carritoData", JSON.stringify(carritoData));
  }

  function loadCarritoData() {
    let savedData = localStorage.getItem("carritoData");
    if (savedData) {
      carritoData = JSON.parse(savedData);
      carritoData.forEach(product => {
        let carritoInfo = document.createElement("div");
        carritoInfo.classList.add("info");

        carritoInfo.innerHTML = `
        <div class="marca">${product.marca}</div>
        <div class="modelo">${product.modelo}</div>
        <div class="color">${product.color}</div>
        <div class="oferta">${product.oferta}</div>
        <button class="btn-quitar uk-button-default uk-width-1-1 uk-margin-top">Quitar</button>`;

        // Agrega la información del producto al carrito
        document.querySelector("#carrito").appendChild(carritoInfo);

        let removeButton = carritoInfo.querySelector(".btn-quitar");

        removeButton.addEventListener("click", () => {
          // Quita la información del producto del carrito
          carritoInfo.remove();

          let index = carritoData.findIndex(p => p.sku === product.sku);
          if (index !== -1) {
            carritoData.splice(index, 1);
          }

          updateCarrito();
          saveCarritoData();
        });
      });
    }
  }

  loadCarritoData();
}


function addMarcas() {
  let marcasContainer = document.querySelector(".marcas");
  let marcas = new Set();

  sPhoneData.forEach(item => {
    marcas.add(item.marca);
  });

  marcas.forEach(marca => {
    let marcaItem = document.createElement("li");
    marcaItem.classList.add("marca-item");
    marcaItem.textContent = marca;

    marcaItem.addEventListener("click", () => {
      if (marcasFiltradas.has(marca)) {
        marcasFiltradas.delete(marca);
        marcaItem.classList.remove("marca-selected");
      } else {
        marcasFiltradas.add(marca);
        marcaItem.classList.add("marca-selected");
      }

      applyFiltros();
    });

    marcasContainer.appendChild(marcaItem);
  });

  let verTodos = document.createElement("li");
  verTodos.classList.add("marca-item");
  verTodos.textContent = "Ver todos";

  verTodos.addEventListener("click", () => {
    marcasFiltradas.clear();
    applyFiltros();
    // quita la clase marca-selected de todos los elementos
    let marcaItems = document.querySelectorAll(".marcas .marca-item");
    marcaItems.forEach(item => {
      item.classList.remove("marca-selected");
    });
  });

  marcasContainer.appendChild(verTodos);
}

function applyFiltros() {
  let productCards = document.querySelectorAll(".grid-productos .product-card");

  productCards.forEach(card => {
    let marca = card.querySelector(".product-card .marca").textContent;

    if (marcasFiltradas.size === 0 || marcasFiltradas.has(marca)) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

muestraDatos();
