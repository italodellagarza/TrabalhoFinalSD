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
                )`,
        (err) => {
            if (err) {
                // Tabela já criada
            }else{
                // Tabela recém criada, incluindo algumas linhas.
                var insert = 'INSERT INTO carros (fabricante, modelo, ano, automatico, preco) VALUES (?,?,?,?,?)'
                db.run(insert, ['Volkswagen', 'jetta', 2013, 0, 56000.00])
                db.run(insert, ['Chevrolet', 'Cruze', 2016, 1, 56000.00])
            }
        });  
    }
});


module.exports = db
