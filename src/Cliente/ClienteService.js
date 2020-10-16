// =========================== SERVICIO DEL CLIENTE ===========================
const axios = require('axios').default

var fs = require('fs'); var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/cliente.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
 log_file.write(util.format(d) + '\n');
 log_stdout.write(util.format(d) + '\n');
};

let cocinado  = 0;
let entregado = 0;

solicitarPedido()
var verificar = setInterval(function(){
    estadoRestaurante()
    if( cocinado == 2)
    {
        // Finalizar Pedido a Restaurante
        clearInterval(verificar)
        // Iniciar Pedido a Repartidor
        var verificarRepartidor = setInterval(function(){
            console.log("---> REPARTIDOR COMO VAS ")
            estadoRepartidor()
            if ( entregado == 2)
            {
                clearInterval(verificarRepartidor)
                console.log("========== Gracias repartidor por entregarme mi comida :D ==========")
            }
        },4000)
    }
},4000)


// ========================== ACCIONES DEL CLIENTE ============================

function solicitarPedido()
{
    console.log("---> Quiero una Hamburguesa Extra Queso con papas y Agua en Lata , Christopher Lopez ")
    console.log("---> Realizando Pedido ...")
    // Solicitar Pedido
    let parametros = {
        method: 'post',
        url: 'http://localhost:3004/recibirpedido-esb',
        data: {
            cliente: "Christopher",
            pedido: "Hamburguesa Extra Queso con papas y Agua en Lata"
        },
        headers: {
            'Content-Type': 'application/json'
        }   
    }
    axios(parametros)
        .then( function (response) {
            console.log("---> Restaurante ::: "+ response.data.res)
            //estadoRestaurante()
        })
        .catch( function (error) {
            console.error(error)
        });
}

function estadoRestaurante()
{

            console.log("---> RESTAURANTE COMO VA MI COMIDA ")
            // Verificar estado del pedido en restaurante
            let parametros = {
                method: 'post',
                url: 'http://localhost:3004/informarestado-esb-restaurante',
                data: {
                    cliente: "Christopher",
                    pedido: "Hamburguesa Extra Queso con papas y Agua en Lata"
                },
                headers: {
                    'Content-Type': 'application/json'
                }   
            }
            axios(parametros)
                .then( function (response) {
                    console.log("---> Restaurante ::: "+ response.data.res)
                    cocinado = response.data.estado
                })
                .catch( function (error) {
                    console.error(error)
                });

}

function estadoRepartidor()
{
    
    // Verificar estado del pedido con el repartidor
    let parametros = {
        method: 'post',
        url: 'http://localhost:3004/informarestado-esb-repartidor',
        datos : {
            cliente : "Christopher"
        },
        headers: {
            'Content-Type': 'application/json'
        }   
    }
    axios(parametros)
        .then( function (response) {
            console.log("---> Repartidor ::: "+ response.data.res)
            entregado = response.data.estado
        })
        .catch( function (error) {
            console.error(error)
        });
}