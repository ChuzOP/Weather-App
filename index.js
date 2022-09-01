require("dotenv").config();

const {
  leerInput,
  inquirerMenu,
  pausa,
  listadoDeLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busqueda");

console.log("hola gente soy lolito");

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //Mostrar mensaje
        const lugar = await leerInput("Ciudad: ");
        //Buscar lugares con coincidencias
        const lugares = await busquedas.ciudad(lugar);
        //seleccionar el lugar
        const id = await listadoDeLugares(lugares);
        if(id === '0') continue;

        const selectPlace = lugares.find((lugar) => lugar.id === id);
        //guardar en db el lugar
        busquedas.agregarHistorial(selectPlace.nombre);

        const { nombre, latitud, longitud } = selectPlace;

        //clima
        const clima = await busquedas.climaCiudad(latitud, longitud);
        const { desc, temperatura, temp_max, temp_min } = clima;

        console.clear();
        console.log("\n============================".red);
        console.log("  Información de la ciudad".red);
        console.log("============================\n".red);
        console.log("Ciudad: ", nombre.green);
        console.log("Longitud: ", longitud);
        console.log("Latitutd: ", latitud);
        console.log("Descripción del clima:", desc.green);
        console.log("Temperatura: ", temperatura, "ºC");
        console.log("Minima: ", temp_min, "ºC");
        console.log("Maxima: ", temp_max, "ºC");
        break;

      case 2:
        busquedas.historialCapitalize.forEach( (lugar, i) => {
          const idx = `${ i + 1}.`.green;
          console.log( `${ idx } ${lugar}`.white );
        } )
        break;

    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
