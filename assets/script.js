let sPhoneData;
let carritoData = [];

fetch('assets/data/productos.json')
  .then(response => response.json())
  .then(data => {
    sPhoneData = data;
    muestraDatos();
  })
  .catch(error => {
    console.error('Error json:', error);
  });
  

function muestraDatos() {
  let gridProductos = document.querySelector(".grid-productos");
  let fragment = document.createDocumentFragment();

  // Itera sobre los productos
  sPhoneData.forEach(item => {
    let productCard = document.createElement("div");
    let precioFormateado = item.precio.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    let ofertaFormateada = item.oferta.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    productCard.innerHTML =  `
      <div class="product-card uk-card uk-light uk-relative">
        <span class="sku">${item.id}</span>
        <div class="marca uk-text-small">${item.marca}</div>
        <h3 class="modelo uk-card-title uk-margin-remove">${item.modelo}</h3>
        <div class="uk-text-small atributos">
          <span class="color">${item.color}</span>
          <span class="capacidad">${item.capacidad}</span>
        </div>
        <div class="oferta">$${ofertaFormateada}</div>
        <div class="uk-text-small">$${precioFormateado}</div>
        <button class="btn-agrega uk-button-default uk-padding-small uk-width-1-1 uk-margin-top">Agregar al carrito</button>
      </div>`;

    // Agrega html de producto a fragment
    fragment.appendChild(productCard);
    // console.log(sPhoneData);
  });

  // Limpia y agrega el fragmento al contenedor
  gridProductos.innerHTML = "";
  gridProductos.appendChild(fragment);

  // Barra de buscar
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

    // Itera sobre html de producto, muestra/ocults segun la busqueda
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

  // Manejo del btn "agregar al carrito"
  let addToCartButtons = document.querySelectorAll(".btn-agrega");

  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      let productCard = button.closest(".product-card");
      let sku = productCard.querySelector(".sku").textContent;
      let marca = productCard.querySelector(".marca").textContent;
      let modelo = productCard.querySelector(".modelo").textContent;
      let color = productCard.querySelector(".color").textContent;
      let oferta = productCard.querySelector(".oferta").textContent;

      let carritoInfo = document.createElement("div");
      carritoInfo.classList.add("info");
      
      carritoInfo.innerHTML = `
        <div class="marca">${marca}</div>
        <div class="modelo">${modelo}</div>
        <div class="color">${color}</div>
        <div class="oferta">${oferta}</div>
        <button class="btn-quitar uk-button-default uk-width-1-1 uk-margin-top">Quitar</button>`;

      // Agrega la informacion del producto al carrito
      document.querySelector("#carrito").appendChild(carritoInfo);

      // Agrega el producto al arreglo de datos carrito
      carritoData.push({ sku, marca, modelo, color, oferta });

      // Actualiza el carrito y guarda datoss
      updateCarrito();
      saveCarritoData();

      let removeButton = carritoInfo.querySelector(".btn-quitar");
      removeButton.addEventListener("click", () => {
        // Quita la informacion del producto carrito
        carritoInfo.remove();

        // Encuentra el indice del producto en el arreglo y lo quita
        let index = carritoData.findIndex(product => product.sku === sku);
        if (index !== -1) {
          carritoData.splice(index, 1);
        }

        // Actualiza el carrito y guarda los datos
        updateCarrito();
        saveCarritoData();
      });
    });
  });

  function updateCarrito() {
    // Actualiza el contenido del carrito con los datos carritoData
  }

  function saveCarritoData() {
    // Guarda datos del carrito en local storage
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

        // Agrega la informacion del producto al carrito
        document.querySelector("#carrito").appendChild(carritoInfo);

        let removeButton = carritoInfo.querySelector(".btn-quitar");
        removeButton.addEventListener("click", () => {
          // Elimina la informacion del producto del carrito
          carritoInfo.remove();

          // Encuentra el indice del producto en el arreglo y lo quita
          let index = carritoData.findIndex(p => p.sku === product.sku);
          if (index !== -1) {
            carritoData.splice(index, 1);
          }

          // Actualiza carrito y guarda datos
          updateCarrito();
          saveCarritoData();
        });
      });
    }
  }


  loadCarritoData();
}
