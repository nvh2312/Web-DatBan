let db = require("./database");

let data = [];

module.exports = class order_detail {
  constructor() {}
  static fetchAllDetail() {
    let sql = `select * from order_detail`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, data) => {
        if (err) throw err;
        else {
          resolve(data);
        }
      });
    });
  }
  static addDetail(ord) {
    let sql = `insert into order_detail set ?`;

    db.query(sql, ord, (err, data) => {
      if (err) throw err;
      else {
        return true;
      }
    });
  }
  static fetchSingleDetail(id) {
    let sql = `select * from order_detail where id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, id, (err, data) => {
        if (err) throw err;
        else resolve(data[0]);
      });
    });
  }
  static updateDetail(ord, id) {
    let sql = `update order_detail set ? where id = "${id}"`;
    db.query(sql, ord, (err) => {
      if (err) throw err;
      else return true;
    });
  }
  static deleteDetail(id) {
    let sql = `delete from order_detail where id = ?`;
    db.query(sql, id, (err, data) => {
      if (err) throw err;
      else {
        return true;
      }
    });
  }
};
