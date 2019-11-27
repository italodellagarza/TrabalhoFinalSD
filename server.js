var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();


var app = express();
app.use(bodyParser.json());


app.listen(5000)

var carros = [
    {fabricante: 'Volkswagen', modelo: 'jetta', ano: '2013', automatico: true, preco: 56000.00},
    {fabricante: 'Chevrolet', modelo: 'Cruze', ano: '2016', automatico: false, preco: 56000.00}
]

// Getters
app.get('/', function (req, res) {
    res.end('Bem vindo a API Carros')
})

app.get('/carros', function (req, res) {
    res.json(carros);
})

app.get('/carros/count', function (req, res) {
    res.json(carros.length.toString());
})

app.get('/carros/menorpreco', function (req, res) {

    var menorID = 0;
    var menorPreco = carros[0].preco;
    for(i = 0; i < carros.length; ++i) {
        if(carros[i].preco < menorPreco) {
            menorID = i;
            menorPreco = carros[i].preco;
        }
    }
    res.json(carros[menorID]);
})

app.get('/carros/:id', function (req, res) {
    var id = req.params.id;
    if(id >= 0 && id < carros.length){
        res.json(carros[id]);
    }
    else {
        res.status(500).json({status: 'erro', message: 'id invalido'});
    }

})

// Posters
app.post('/carros', function (req, res) {
    var carro = req.body;
    carros[carros.length] = carro;
    res.json(carros[carros.length - 1])
})

// Deleters
app.delete('/carros/:id', function (req, res) {
    var id = req.params.id;
    if(id >= 0 && id < carros.length){
        carros.splice(id, 1);
        res.json(carros);
    }
    else {
        res.status(500).json({status: 'erro', message: 'id invalido'});
    }
})

// Updaters
app.put('/carros/:id', function (req, res) {
    var id = req.params.id;
    var newParams = req.body;
    if(id >= 0 && id < carros.length){
        carros[id] = {...carros[id], ...newParams};
    }
    else {
        res.status(500).json({status: 'erro', message: 'id invalido'});
    }
    res.json(carros[id])
})

// Todo MySQL, JWT
// Thanks to https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/,  https://gitlab.com/gcc129/api-carros
