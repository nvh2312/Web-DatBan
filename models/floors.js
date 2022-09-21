var db = require("./database");

let data = [];

module.exports = class floors {
  constructor() {}
  static fetchAllFloor() {
    let sql = `select * from floor`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, data) => {
        if (err) throw err;
        else {
          resolve(data);
        }
      });
    });
  }
  static addFloor(floor) {
    let sql = `insert into floor set ?`;

    db.query(sql, floor, (err, data) => {
      if (err) throw err;
      else {
        return true;
      }
    });
  }
  static fetchSingleFloor(id) {
    let sql = `select * from floor where id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, id, (err, data) => {
        if (err) throw err;
        else resolve(data[0]);
      });
    });
  }
  static updateFloor(prod, id) {
    let sql = `update floor set ? where id = "${id}"`;
    db.query(sql, prod, (err) => {
      if (err) throw err;
      else return true;
    });
  }
  static deleteFloor(id) {
    let sql = `delete from floor where id = ?`;
    db.query(sql, id, (err, data) => {
      if (err) throw err;
      else {
        return true;
      }
    });
  }
};
