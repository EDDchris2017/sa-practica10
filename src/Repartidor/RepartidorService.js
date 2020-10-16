// =========================== SERVICIO DEL REPARTIDOR ===========================
const express = require("express")
, bodyParser = require('body-parser');
const app = express();
const axios = require('axios').default

var fs = require('fs'); var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/repartidor.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

// ******************************* ESTADO DEL SERVICIO *******************************
// 0 = no hay pedido en proceso ; 1 = hay pedido en entrega ; 2 = entragado a Cliente
let estado_pedido = 0;

// ******************************* METODOS DEL SERVICIO *******************************

/**
 *  Puerto del Repartidos : 3002
 */
app.listen(3002, () => {
    console.log("Servicio Repartidor: 3002");
});


app.use(bodyParser.json());

app.post('/recibirentrega', function (request, res){
    console.log("---> Un restaurante quiere que entrege un pedido !!!")

    res.send(recibirPedido(request.body.cliente,request.body.pedido))
});

app.post('/informarestado', function (request, res){
    console.log("---> El cliente solicito saber el estado de su pedido")

    res.send(informarEstado())
});

function recibirPedido(cliente,pedido)
{
    let respuesta = "";
    if ( !cliente || !pedido)
    {
        console.error("---> Error al recibir datos del restaurante")
        respuesta = "Error al procesa pedido"
    }else
    {
        console.log("---> Me pidieron entregar ha  " + cliente + " el pedido de : " + pedido)
        respuesta = {
            res : " Ya cuento con pedido, voy en camino !!"
        }
    }
    estado_pedido = 1;
    // Simular espera de Proceso de Llegada a la casa del cliente
    setTimeout(function(){
        estado_pedido = 2
        console.log("---> Ya estoy en el lugar del Cliente !! ")
        // Marcar como entregado
        console.log("---> Marcando la entrega como Finazalida ...")
        finalizarEntrega();
    }, 14000);
    return respuesta
}

function informarEstado()
{
    switch(estado_pedido)
    {
        case 1: return {res:"Aun voy en camino con su pedido, no se preocupe" , estado:1}
        case 2: return {res:"Ya estoy en la puerta de su casa :)", estado:2}
        case 0: return {res:"No ha realizado ningun pedido", estado:0}
    }
}

function finalizarEntrega()
{
    console.log("---> Avisando repartidor entrega ...")
    // Solicitar Pedido
    let parametros = {
        method: 'post',
        url: 'http://localhost:3004/finentrega-esb', 
    }
    axios(parametros)
        .then( function (response) {
            console.log("========== Restaurante ::: "+ response.data + " ==========")
        })
        .catch( function (error) {
            console.error(error)
        });
}