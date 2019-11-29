var sqlite3 = require('sqlite3').verbose()
const DBSOURCE = "./db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    
    if (err) {
      // Não pode abrir a base de dados
      console.error(err.message)
      throw err
    }else{
        console.log('Conectou-se ao SQLite database.')
        db.run(`CREATE TABLE carros (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    fabricante TEXT,  
                    modelo TEXT,
                    ano INTEGER,
                    automatico BOOLEAN, 
                    preco FLOAT
                );`,
        (err) => {
            if (err) {
                // Tabelas já criadas
            }else{
                // Tabelas recém criadas, incluindo algumas linhas.
                console.log('criou carros')
                var insertCarros = 'INSERT INTO carros (fabricante, modelo, ano, automatico, preco) VALUES (?,?,?,?,?)'
                db.run(insertCarros, ['Volkswagen', 'jetta', 2013, 0, 56000.00])
                db.run(insertCarros, ['Chevrolet', 'Cruze', 2016, 1, 56000.00])
            }
        })
        db.run(`CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE,
                    password TEXT
                )`,
        (err) => {
            if (err) {
                // Tabelas já criadas
            }else{
                // Tabelas recém criadas, incluindo algumas linhas.
                console.log('criou users')
                var insertUser = 'INSERT INTO users (email, password) VALUES (?,?)'
                db.run(insertUser, ['italo@email.com', 'senha123456'])
            }
        });    
    }
});


module.exports = db
