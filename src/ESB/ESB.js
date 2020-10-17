// =========================== DATOS DE SERVICIOS ===========================
const service_restaurante = "restaurante"
const service_repartidor  = "repartidor" 

// =========================== SERVICIO DEL ESB ===========================

const express = require("express")
, bodyParser = require('body-parser');
const app = express();
const axios = require('axios').default

var fs = require('fs'); var util = require('util');
var log_file = fs.createWriteStream('/logs/historial_ESB.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};


/**
 *  Puerto del ESB : 3004
 */
app.listen(80, () => {
    console.log("Servicio ESB: 3004");
});
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('ESB activo');
    res.status(200)
});

app.post('/recibirpedido-esb', function (request, res){
    console.log("====================================")
    console.log("Pedido de Cliente al Restaurante")
    console.log("Redirigir respuesta a Restaurante")
    console.log("CLIENTE -> RESTAURANTE")
    console.log("====================================")

    enviarDatos('http://'+service_restaurante + "/recibirpedido",request.body,function(msg){
        res.send(msg)
    })
});

app.post('/informarestado-esb-restaurante', function (request, res){
    console.log("====================================")
    console.log("Consultar estado de Cliente al Restaurante")
    console.log("Redirigir respuesta de estado a Restaurante")
    console.log("CLIENTE --> RESTAURANTE")
    console.log("====================================")

    /*let msg = "NO HAY NADA !!!!!!!!"
    msg = enviarDatos(service_restaurante + "/informarestado",request.body)
    console.log("MENSAJE REPARTIDOR \n" + msg)*/

    enviarDatos('http://'+service_restaurante + "/informarestado",request.body,function(msg){
        res.send(msg)
    })
    
});

app.post('/informarestado-esb-repartidor', function (request, res){
    console.log("====================================")
    console.log("Consultar estado de Cliente al Repartidor")
    console.log("Redirigir respuesta de estado a Repartidor")
    console.log("CLIENTE -> REPARTIDOR")
    console.log("====================================")
    
    enviarDatos('http://'+service_repartidor + "/informarestado",request.body,function(msg){
        res.send(msg)
    })
});

app.post('/recibirentrega-esb-repartidor', function (request, res){
    console.log("====================================")
    console.log("Enviar envio pedido Restaurante al Repartidor")
    console.log("Redirigir respuesta de estado a Repartidor")
    console.log("RESTAURANTE -> REPARTIDOR")
    console.log("====================================")

    enviarDatos('http://'+service_repartidor + "/recibirentrega",request.body,function(msg){
        res.send(msg)
    })
});

app.post('/finentrega-esb', function (request, res){
    console.log("====================================")
    console.log("Enviar Marca entrega al Restaurante")
    console.log("Redirigir respuesta de estado a Restaurante")
    console.log("REPARTIDOR -> RESTAURANTE")
    console.log("====================================")

    enviarDatos('http://'+service_restaurante + "/finentrega",request.body,function(msg){
        res.send(msg)
    })
});

function enviarDatos(url,datos,callback)
{
    // Solicitar Pedido
    let parametros = {
        method: 'post',
        url: url,
        data: datos,
        headers: {
            'Content-Type': 'application/json'
        }   
    }
    //return new Promise(resolve => {
        axios(parametros)
            .then( function (response) {
                callback(response.data)
            })
            .catch( function (error) {
                console.error(error)
            });
    //});
}
