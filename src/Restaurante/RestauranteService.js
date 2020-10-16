// =========================== SERVICIO DEL RESTAURANTE ===========================

const express = require("express")
, bodyParser = require('body-parser');
const app = express();
const axios = require('axios').default

var fs = require('fs'); var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/restaurante.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
 log_file.write(util.format(d) + '\n');
 log_stdout.write(util.format(d) + '\n');
};

// ******************************* ESTADO DEL SERVICIO *******************************
// 0 = no hay pedido en proceso ; 1 = hay pedido en proceso ; 2 = entregado a Repartidor
let estado_pedido = 0;


// ******************************* METODOS DEL SERVICIO *******************************

/**
 *  Puerto del Repartidos : 3003
 */
app.listen(3003, () => {
    console.log(" Servicio Restaurante: 3003");
});

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Restaurante activo');
    res.status(200)
});

app.post('/recibirpedido', function (request, res){
    console.log("---> Se recibio un pedido !!!")

    res.send(recibirPedido(request.body.cliente,request.body.pedido))
});
app.post('/informarestado', function (request, res){
    console.log("--->"+ request.body.cliente +" solicito saber el estado de su pedido")

    res.send(informarEstado())
});

app.post('/finentrega', function (request, res){
    console.log("==== El repartidor dice que ya entrego el pedido , muy bien !!! ===")
    res.send(" === Gracias Repartidor !!! ===")
});

app.get('/quit',function(request,res){
    console.log("Salir del servicio")
    process.exit(0);
})

/**
 * Procesa pedidos de los cliente
 * @param {Nombre del cliente} cliente 
 * @param {Pedido del cliente} pedido 
 */
function recibirPedido(cliente, pedido)
{
    let respuesta = "";
    if ( !cliente || !pedido)
    {
        console.error("---> Error al recibir datos de un cliente")
        respuesta = "Error al procesa pedido"
    }else
    {
        console.log("---> El Cliente " + cliente + " pidio " + pedido)
        respuesta = {
            res : "Que tal " + cliente + " tu pedido se esta procesando ..."
        }
    }
    // Hay un pedido en proceso
    estado_pedido = 1
    // Simular espera de Proceso de Cocinado
    setTimeout(function(){
        estado_pedido = 2
        console.log("---> El pedido esta Listo !! ")
        avisarRepartidor(cliente,pedido)
    }, 10000);

    return respuesta
}

function informarEstado()
{
    switch(estado_pedido)
    {
        case 1: return {res:"El pedido sigue en proceso" , estado:1}
        case 2: return {res:"Pedido cocinado, entregado al repartidor", estado:2}
        case 0: return {res:"No ha realizado ningun pedido", estado:0}
    }
}

function avisarRepartidor(cliente,pedido)
{
    console.log("---> Avisando repartidor entrega ...")
    // Solicitar Pedido
    let parametros = {
        method: 'post',
        url: 'http://localhost:3004/recibirentrega-esb-repartidor',
        data: {
            cliente: cliente,
            pedido: pedido
        },
        headers: {
            'Content-Type': 'application/json'
        }   
    }
    axios(parametros)
        .then( function (response) {
            console.log("---> Repartidor ::: "+ response.data.res)
        })
        .catch( function (error) {
            console.error(error)
        });
}

module.exports.app = app;