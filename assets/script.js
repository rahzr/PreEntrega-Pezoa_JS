// objeto con precios y variedades de café
const preciosCafe = {
  "americano": 1900,
  "expresso": 1200,
  "capuchino": 2600,
  "latte": 2800
};

// array vacío
let ordenesClientes = [];

// Funcion y promp
while (true) {
  let tipoCafe = prompt("¿Qué tipo de café quieres? Americano, expresso, capuchino o latte. (click en cancelar para salir)");
  if (!tipoCafe) {
    break;
  }
  let cantidadCafe = parseInt(prompt(`¿Cuántos quieres ordenar?`));
  if (!isNaN(cantidadCafe)) {
    let nombreCliente = prompt("¿Cuál es tu nombre?");
    ordenesClientes.push([nombreCliente, tipoCafe, cantidadCafe]);
  }
}

// map y array
const preciosOrdenes = ordenesClientes.map(orden => {
  const precioCafe = preciosCafe[orden[1]];
  const precioTotal = precioCafe * orden[2];
  return {
    // datos ingresados en el promp
    cliente: orden[0],
    tipoCafe: orden[1],
    cantidad: orden[2],
    precioTotal: precioTotal
  };
});

// mensaje con el detalle y precio final
preciosOrdenes.forEach(orden => {
  console.log(`Gracias ${orden.cliente}, el precio total por ${orden.cantidad} ${orden.tipoCafe} es: $${orden.precioTotal}`);
});

// console.log para verificar que funcione la info del .map
console.log(preciosOrdenes)
