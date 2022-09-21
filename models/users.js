var db = require("./database");

let data = [];

module.exports = class users {
  constructor() {}
  static fetchAllUser() {
    let sql = `select * from user where role = 0`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, data) => {
        if (err) throw err;
        else {
          resolve(data);
        }
      });
    });
  }
  static addUser(us) {
    let sql = `insert into user set ?`;

    db.query(sql, us, (err, data) => {
      if (err) throw err;
      else {
        return true;
      }
    });
  }
  static fetchSingleUser(phone) {
    let sql = `select * from user where phone = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, phone, (err, data) => {
        if (err) throw err;
        else resolve(data[0]);
      });
    });
  }
  static fetchUserById(id) {
    let sql = `select * from user where id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, id, (err, data) => {
        if (err) throw err;
        else resolve(data[0]);
      });
    });
  }
  static updateUser(us, pnb) {
    let sql = `update user set ? where phone = "${pnb}"`;
    db.query(sql, us, (err) => {
      if (err) throw err;
      else return true;
    });
  }
  static deleteUser(id) {
    let sql = `delete from user where id = ?`;
    db.query(sql, id, (err, data) => {
      if (err) throw err;
      else {
        return true;
      }
    });
  }
};
