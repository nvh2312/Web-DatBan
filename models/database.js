var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'datban'
});

db.connect((err) => {
    if(err) throw err;
    console.log('database is connected successfully!!!');
});
module.exports = db;