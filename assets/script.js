// objeto con precios y variedades de café
const cafeTipos = [
  {
    nombre: "Americano",
    descripcion: "Café negro con agua caliente",
    precio: 1900,
    disponible: true,
  },
  {
    nombre: "Expresso",
    descripcion: "Café negro",
    precio: 1200,
    disponible: true,
  },
  {
    nombre: "Cappuccino",
    descripcion: "Café con leche caliente y espuma de leche",
    precio: 2600,
    disponible: false,
  },
  {
    nombre: "Latte",
    descripcion: "Café con leche caliente y espuma",
    precio: 2800,
    disponible: true,
  },
];

// array vacío
let ordenesClientes = [];

// Función y prompt
while (true) {
  let tipoCafe = prompt("¿Qué tipo de café quieres? Americano, Expresso, Cappuccino o Latte. (Haz click en cancelar para salir)");
  if (!tipoCafe) {
    break;
  }
  let cantidadCafe = parseInt(prompt(`¿Cuántos quieres ordenar?`));
  if (!isNaN(cantidadCafe)) {
    let nombreCliente = prompt("¿Cuál es tu nombre?");
    ordenesClientes.push({nombre: nombreCliente, tipoCafe: tipoCafe, cantidad: cantidadCafe});
  }
}

// Map y array
const preciosOrdenes = ordenesClientes.map(orden => {
  const tipoDeCafe = cafeTipos.find(cafe => cafe.nombre.toLowerCase() === orden.tipoCafe.toLowerCase());
  if (tipoDeCafe) {
    const precioTotal = tipoDeCafe.precio * orden.cantidad;
    return {
      // datos ingresados en el prompt
      cliente: orden.nombre,
      tipoCafe: tipoDeCafe.nombre,
      cantidad: orden.cantidad,
      precioTotal: precioTotal
    };
  } else {
    return null;
  }
}).filter(orden => orden !== null);

// mensaje con el detalle y precio final
preciosOrdenes.forEach(orden => {
  console.log(`Gracias ${orden.cliente}, el precio total por ${orden.cantidad} ${orden.tipoCafe} es: $${orden.precioTotal}`);
});

// console.log para verificar que funcione la info del .map
console.log(preciosOrdenes);


// Prompt para filtrar ordenes
const tipoCafeFiltro = prompt("¿Quieres filtrar las órdenes por un tipo de café en específico? Ingresa el nombre del tipo de café o presiona 'cancelar' para continuar sin filtrar.");

// Si el usuario ingreso un tipo de café para filtrar
if (tipoCafeFiltro) {

  const tipoCafeFiltroMin = tipoCafeFiltro.toLowerCase();

  // Filtrar las ordenes
  const ordenesFiltradas = preciosOrdenes.filter(orden => orden.tipoCafe.toLowerCase() === tipoCafeFiltroMin);

  // Pintar las ordenes filtradas
  console.log(`Órdenes de ${tipoCafeFiltro}:`);
  ordenesFiltradas.forEach(orden => {
    console.log(`- Cliente: ${orden.cliente}, Cantidad: ${orden.cantidad}, Precio Total: $${orden.precioTotal}`);
  });
}
