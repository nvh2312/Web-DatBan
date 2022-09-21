let db = require("./database");

let data = [];

module.exports = class categories {
  constructor() {}
  static fetchAllCategory() {
    let sql = `select * from category`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, data) => {
        if (err) throw err;
        else {
          resolve(data);
        }
      });
    });
  }
  static addCategory(category) {
    let sql = `insert into category set ?`;

    db.query(sql, category, (err, data) => {
      if (err) throw err;
      else {
        return true;
      }
    });
  }
  static fetchSingleCategory(id) {
    let sql = `select * from category where id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, id, (err, data) => {
        if (err) throw err;
        else resolve(data[0]);
      });
    });
  }
  static fetchSingleCategory(id) {
    let sql = `select * from category where id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, id, (err, data) => {
        if (err) throw err;
        else resolve(data[0]);
      });
    });
  }
  static updateCategory(us, id) {
    let sql = `update category set ? where id = "${id}"`;
    db.query(sql, us, (err) => {
      if (err) throw err;
      else return true;
    });
  }
  static deleteCategory(id) {
    let sql = `delete from category where id = ?`;
    db.query(sql, id, (err, data) => {
      if (err) throw err;
      else {
        return true;
      }
    });
  }
  
};