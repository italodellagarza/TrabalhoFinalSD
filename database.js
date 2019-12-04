/**
 * database.js
 * Cria o banco de dados
 * Ítalo Della Garza Silva
 * Adaptado de: https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/, 
 *              https://gitlab.com/gcc129/api-carros
 * 04/12/2019
 * Universidade Federal de Lavras
 */

var sqlite3 = require('sqlite3').verbose();
const DBSOURCE = "./db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    
    if (err) {
      // Não pode abrir a base de dados
      console.error(err.message)
      throw err
    }else{
        console.log('Conectou-se ao SQLite database.')
        db.run(`CREATE TABLE Livro (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    titulo TEXT,  
                    autor TEXT,
                    genero TEXT,
                    edicao INTEGER,
                    anoPublicacao INTEGER,
                    numPaginas INTEGER
                );`,
        (err) => {
            if (err) {
                // Tabelas já criadas
            }else{
                // Tabelas recém criadas, incluindo algumas linhas.
                console.log('criou Livro');
                var insertLivro = 'INSERT INTO Livro (titulo, autor, genero, edicao, anoPublicacao, numPaginas) VALUES (?,?,?,?,?,?)';
                db.run(insertLivro, ['Fogo e Sangue – Crônicas de Gelo e Fogo', 'George R. R. Martin', 'Fantasia', 1, 2018, 736]);
                db.run(insertLivro, ['A Guerra dos Tronos – Crônicas de Gelo e Fogo', 'George R. R. Martin', 'Fantasia', 1, 2010, 592]);
                db.run(insertLivro, ['Comentários À Execução Civil', 'Donaldo Armelin', 'Direito', 2, 2008, 241]);
                db.run(insertLivro, ['Você Sabe Estudar?', 'Claudio de Moura Castro', 'Autoajuda', 1, 2015, 143]);
                db.run(insertLivro, ['Interferências', 'Connie Willis', 'Humor', 1, 2018, 123]);
                db.run(insertLivro, ['Areia Movediça', 'Malin Persson Giolito', 'Terror', 1,  2019, 114]);

            }
        })
        db.run(`CREATE TABLE Usuario (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE,
                    senha TEXT
                )`,
        (err) => {
            if (err) {
                // Tabelas já criadas
            }else{
                // Tabelas recém criadas, incluindo algumas linhas.
                console.log('criou usuario')
                var insertUser = 'INSERT INTO Usuario (email, senha) VALUES (?,?)'
                db.run(insertUser, ['italo@email.com', 'senha123456']);
            }
        });    
    }
});


module.exports = db
