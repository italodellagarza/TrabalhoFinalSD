/**
 * server.js
 * Servidor Básico em Javascript
 * Ítalo Della Garza Silva
 * Adaptado de: https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/, 
 *              https://gitlab.com/gcc129/api-carros
 * 04/12/2019
 * Universidade Federal de Lavras
 */

var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var db = require('./database.js');
var app = express();

const SECRET_KEY = "secretkey23456";


app.use(bodyParser.json());


app.listen(5000)



function verifyJWT(req, res, next){
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'Nenhum token fornecido.' });
    
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Falhou ao autenticar o token.' });
        
        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        next();
    });
}


// Getters
app.get('/', function (req, res) {
    res.end('Bem vindo a API Livros');
})

app.get('/livros', verifyJWT, function (req, res){
    var sql = "SELECT * FROM Livro";
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

app.get('/livros/count', verifyJWT, function (req, res) {
    sql = "SELECT COUNT(*) FROM Livro";
    params = [];
    db.get(sql, params, function(err, result) {
        if(err){
            res.status(400).json({"erro ": err.message});
            return;
        }
        res.json({"message": "success", "data": result["COUNT(*)"]})
    });
})



app.get('/livros/:id', verifyJWT, function (req, res) {
    var sql = "SELECT * FROM Livro WHERE id = ?";
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

app.post('/livros/byautor', verifyJWT, function (req, res) {
    var sql = "SELECT * FROM Livro WHERE autor = ?";
    var params = [req.body.autor];

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

app.post('/login', function (req, res) {
    const email = req.body.email;
    const senha = req.body.senha;
    sql = "SELECT * FROM Usuario WHERE email = ?";
    var params = [email]

    db.get(sql, params, function(err, usuario) {
        if(err) {
            res.status(400).json({"erro ": err.message});
            return;
        }
        else {
            if(senha == usuario.senha) {
                console.log('successo');
                const  expiresIn  =  24  *  60  *  60;
                const  accessToken  =  jwt.sign({ id:  usuario.id }, SECRET_KEY, {
                    expiresIn:  expiresIn
                });
                res.status(200).send({ "email":  email, "access_token":  accessToken, "expires_in":  expiresIn});
            }
        }
    })

});


app.post('/livros', verifyJWT, function (req, res) {
    var livro = req.body;
    var sql = "INSERT INTO Livro (titulo, autor, genero, edicao, anoPublicacao, numPaginas) VALUES (?,?,?,?,?,?)";
    var params = [livro.titulo, livro.autor, livro.genero, livro.edicao, livro.anoPublicacao, livro.numPaginas];
    db.run(sql, params, function(err, result) {
        if(err) {
            res.status(400).json({"error": err.message})
            return;
        } 
        res.json({
            "message": "success",
            "data": livro,
            "id" : this.lastID
        });
    });
})

// Deleters
app.delete('/livros/:id', verifyJWT, function (req, res) {
    var sql = "DELETE FROM Livro WHERE id=?";
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
app.put('/livros/:id', verifyJWT, function (req, res) {
    var novoLivro = req.body;
    var sql = `UPDATE Livro SET 
                    titulo = COALESCE(?, titulo),
                    autor = COALESCE(?, autor),
                    genero = COALESCE(?, genero),
                    edicao = COALESCE(?, edicao),
                    anoPublicacao = COALESCE(?, anoPublicacao),
                    numPaginas = COALESCE(?, numPaginas)
                WHERE id = ?`;
    var params = [novoLivro.titulo, novoLivro.autor, novoLivro.genero, novoLivro.edicao, novoLivro.anoPublicacao, novoLivro.numPaginas];
    db.run(sql, params, function(err, result){
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
        res.json({
            message: "success",
            data: novoLivro,
            changes: this.changes
        })
    });
})
