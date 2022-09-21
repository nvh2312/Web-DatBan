var db = require("./database");

let data = [];

module.exports = class tabless {
  constructor() {}
  static fetchAllTable() {
    let sql = `select * from tables`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, data) => {
        if (err) throw err;
        else {
          resolve(data);
        }
      });
    });
  }
  static fetchAllTableFloor(id) {
    let sql = `select * from tables where floor_id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, id ,(err, data) => {
        if (err) throw err;
        else {
          resolve(data);
        }
      });
    });
  }
  static addTable(tables) {
    let sql = `insert into tables set ?`;

    db.query(sql, tables, (err, data) => {
      if (err) throw err;
      else {
        return true;
      }
    });
  }
  static fetchSingleTable(id) {
    let sql = `select * from tables where id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, id, (err, data) => {
        if (err) throw err;
        else resolve(data[0]);
      });
    });
  }
  static updateTable(tab, id) {
    let sql = `update tables set ? where id = "${id}"`;
    db.query(sql, tab, (err) => {
      if (err) throw err;
      else return true;
    });
  }
  static deleteTable(id) {
    let sql = `delete from tables where id = ?`;
    db.query(sql, id, (err, data) => {
      if (err) throw err;
      else {
        return true;
      }
    });
  }
};
