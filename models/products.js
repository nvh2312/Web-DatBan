var db = require("./database");

let data = [];

module.exports = class products {
  constructor() {}
  static fetchAllProduct() {
    let sql = `select * from product`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, data) => {
        if (err) throw err;
        else {
          resolve(data);
        }
      });
    });
  }
  static addProduct(product) {
    let sql = `insert into product set ?`;

    db.query(sql, product, (err, data) => {
      if (err) throw err;
      else {
        return true;
      }
    });
  }
  static fetchProductById(id) {
    let sql = `select * from product where id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, id, (err, data) => {
        if (err) throw err;
        else resolve(data[0]);
      });
    });
  }
  static updateProductById(prod, id) {
    let sql = `update product set ? where id = "${id}"`;
    db.query(sql, prod, (err) => {
      if (err) throw err;
      else return true;
    });
  }
  static deleteProduct(id) {
    let sql = `delete from product where id = ?`;
    db.query(sql, id, (err, data) => {
      if (err) throw err;
      else {
        return true;
      }
    });
  }
};
