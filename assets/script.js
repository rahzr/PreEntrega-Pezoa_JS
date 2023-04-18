// Objeto
const preciosCafe = {
  "americano": 1900,
  "expresso": 1200,
  "capuchino": 2600,
  "latte": 2800
};

let ordenCliente = {};

// Funcion y promp
while (true) {
  let tipoCafe = prompt("¿Qué tipo de café quieres? Americano, expresso, capuchino o latte. (click en cancelar para salir)");
  if (!tipoCafe) {
    break;
  }
  let cantidadCafe = parseInt(prompt(`¿Cuántos quieres ordenar?`));
  if (!isNaN(cantidadCafe)) {
    ordenCliente[tipoCafe] = cantidadCafe;
  }
}

// Ciclo
let precioTotal = 0;
for (let tipoCafe in ordenCliente) {
  precioTotal += preciosCafe[tipoCafe] * ordenCliente[tipoCafe];
}

console.log(`El precio total es: $${precioTotal}`);
