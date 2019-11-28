var express = require('express');
var bodyParser = require('body-parser');
var db = require('./database.js');
var app = express();
app.use(bodyParser.json());


app.listen(5000)

//var carros = [
  //  {fabricante: 'Volkswagen', modelo: 'jetta', ano: '2013', automatico: true, preco: 56000.00},
    //{fabricante: 'Chevrolet', modelo: 'Cruze', ano: '2016', automatico: false, preco: 56000.00}
//]

// Getters
app.get('/', function (req, res) {
    res.end('Bem vindo a API Carros');
})

app.get('/carros', function (req, res){
    var sql = "SELECT * FROM carros";
    var params = [];
    db.all(sql, params, function(err, rows){
        if(err){
            res.status(400).json({"erro ": err.message});
            return;
        }
        else {
            res.json({"message": "success", "data": rows})
        }
    });
})

app.get('/carros/count', function (req, res) {
    sql = "SELECT COUNT(*) FROM carros";
    params = [];
    db.get(sql, params, function(err, result) {
        if(err){
            res.status(400).json({"erro ": err.message});
            return;
        }
        res.json({"message": "success", "data": result["COUNT(*)"]})
    });
})

app.get('/carros/menorpreco', function (req, res) {
    var sql = "SELECT * FROM carros WHERE preco = (SELECT MIN(preco) FROM carros)";
    var params = []
    db.get(sql, params, function(err, row){
        if(err){
            res.status(400).json({"erro ": err.message});
            return;
        }
        else {
            res.json({"message": "success", "data": row})
        }
    });
})

app.get('/carros/:id', function (req, res) {
    var sql = "SELECT * FROM carros WHERE id = ?";
    var params = [req.params.id];

    db.get(sql, params, function(err, row){
        if(err){
            res.status(400).json({"erro ": err.message});
            return;
        }
        else {
            res.json({"message": "success", "data": row})
        }
    });

})

// Posters
app.post('/carros', function (req, res) {
    var carro = req.body;
    var sql = "INSERT INTO carros (fabricante, modelo, ano, automatico, preco) VALUES (?,?,?,?,?)";
    var params = [carro.fabricante, carro.modelo, carro.ano, carro.automatico, carro.preco];
    db.run(sql, params, function(err, result) {
        if(err) {
            res.status(400).json({"error": err.message})
            return;
        } 
        res.json({
            "message": "success",
            "data": carro,
            "id" : this.lastID
        });
    });
})

// Deleters
app.delete('/carros/:id', function (req, res) {
    var sql = "DELETE FROM carros WHERE id=?";
    var params = [req.params.id];
    db.run(sql, params, function(err, result) {
        if(err) {
            res.status(400).json({"error": res.message})
                return;
        }
        else {
            res.json({"message":"deleted", changes: this.changes})
        }
    });
   
})

// Updaters
app.put('/carros/:id', function (req, res) {
    var newCarro = req.body;
    var sql = `UPDATE carros SET 
                    fabricante = COALESCE(?, fabricante),
                    modelo = COALESCE(?, modelo),
                    ano = COALESCE(?, modelo),
                    automatico = COALESCE(?, modelo),
                    preco = COALESCE(?, modelo)
                WHERE id = ?`;
    var params = [newCarro.fabricante, newCarro.modelo, newCarro.ano, newCarro.automatico, newCarro.preco ,req.params.id];
    db.run(sql, params, function(err, result){
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({
            message: "success",
            data: newCarro,
            changes: this.changes
        })
    });
})

// Todo JWT, novos dados
// Thanks to https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/, 
//           https://gitlab.com/gcc129/api-carros
