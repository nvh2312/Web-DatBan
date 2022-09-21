let db = require("./database");

module.exports = class orders {
  constructor() {}
  static fetchAllOrder() {
    let sql = `select * from orders`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, data) => {
        if (err) throw err;
        else {
          resolve(data);
        }
      });
    });
  }
  static fetchOrderPhone(phone) {
    let sql = `select * from orders where user_phone=?`;
    return new Promise((resolve, reject) => {
      db.query(sql,phone, (err, data) => {
        if (err) throw err;
        else {
          resolve(data);
        }
      });
    });
  }
  static addOrder(ord) {
    let sql = `insert into orders set ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, ord, (err, results) => {
        if (err) throw err;
        else {
          resolve(results.insertId);
        }
      });
    });
  }
  static fetchSingleOrder(id) {
    let sql = `select * from orders where id = ?`;
    return new Promise((resolve, reject) => {
      db.query(sql, id, (err, data) => {
        if (err) throw err;
        else resolve(data[0]);
      });
    });
  }
  static updateOrder(ord, id) {
    let sql = `update orders set ? where id = "${id}"`;
    db.query(sql, ord, (err) => {
      if (err) throw err;
      else return true;
    });
  }
  static deleteOrder(id) {
    let sql = `delete from orders where id = ?`;
    db.query(sql, id, (err, data) => {
      if (err) throw err;
      else {
        return true;
      }
    });
  }
  static getDetail(id) {
    let sql = `select o.*,p.id as product_id,p.name as product_name,od.id as detail_id ,od.quantity,od.unit_price 
    from orders o 
    join order_detail od on o.id = od.order_id 
    join product p on od.product_id = p.id  
    where o.id = ?;`;
    return new Promise((resolve, reject) => {
      db.query(sql, id, (err, data) => {
        if (err) throw err;
        else resolve(data);
      });
    });
  }
  static fetchOrderTime(time) {
    let sql = `SELECT booking_time FROM orders where status != "Hủy đơn" and booking_date = "${time}"`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, data) => {
        if (err) throw err;
        else {
          resolve(data);
        }
      });
    });
  }
  static countOrder() {
    let sql = `SELECT status, count(id) as SL FROM orders group by status`;
    return new Promise((resolve, reject) => {
      db.query(sql, (err, data) => {
        if (err) throw err;
        else {
          resolve(data);
        }
      });
    });
  }
};
