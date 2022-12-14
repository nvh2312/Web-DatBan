// let html = "";
// $.ajax({
//   url: "http://localhost:3000/home/api/showProduct",
//   method: "POST",
//   data: {},
//   dataType: "JSON",
//   success: (data) => {
//     localStorage.setItem("listProducts", JSON.stringify(data));
//   },
// });

// let retrievedObject = localStorage.getItem("listProducts");
// const arr_obj = JSON.parse(retrievedObject);
function showToast(msg) {
  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-bottom-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "3000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };
  let $toast = toastr["success"](msg);
}
let cart = [];
let arr_obj = "";
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
$(document).ready(async function () {
  let qtt = JSON.parse(localStorage.getItem("total"));
  if (!qtt) {
    qtt = 0;
  }
  $(".count").html(qtt);
  let html = "";
  arr_obj = await $.ajax({
    url: "http://localhost:3000/home/api/showProduct",
    method: "POST",
    data: {},
    dataType: "JSON",
  });
  $(".list-item > .dssp").empty();

  arr_obj.forEach((item, index) => {
    html +=
      '<div class="card my-3" style="width: 16rem;"><img class="card-img-top" style ="height: 10rem;" src="' +
      item.image_src +
      '" alt="Card image cap"><div class="card-body"><h5 class="card-title">' +
      item.name +
      '</h5>  <p class="card-text" style ="height: 8rem;">' +
      item.description +
      '</p>  <div class="row justify-content-around">          <span class="font-weight-bold">' +
      item.price +
      ' VND</span>          <span class="font-weight-light font-italic">' +
      item.time +
      '</span>          <button class="btn btn-success float-right" onclick ="addToCart(' +
      item.id +
      ')">+      </button> <input type="hidden" name="id" id=' +
      item.id +
      " /></div>  </div></div>";
  });
  $(html).appendTo(".list-item > .dssp");
});

function logout() {
  $.ajax({
    url: "http://localhost:3000/home/checkLogout",
    method: "POST",
    data: {},
    dataType: "JSON",
    success: () => {
      window.location = "/home";
    },
  });
}
const addToCart = async (id) => {
  // console.log(
  //   Object.assign(
  //     {},
  //     arr_obj.filter((sp) => sp.id == id)
  //   )
  // );
  let qtt = 0;
  showToast("Thêm vào giỏ hàng thành công");
  let storage = localStorage.getItem("cart");
  if (storage) {
    cart = JSON.parse(storage);
  }
  let product = await arr_obj.filter((sp) => sp.id == id)[0];
  let item = cart.find((c) => c.product.id == id);
  if (item) {
    item.quantity = Number(item.quantity) + 1;
  } else {
    cart.push({ product, quantity: 1 });
  }
  cart.forEach((item) => (qtt += Number(item.quantity)));
  $(".count").html(qtt);
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("total", JSON.stringify(qtt));
};
async function findProduct(e) {
  let html = "";
  arr_obj = await $.ajax({
    url: "http://localhost:3000/home/api/showCategoryProduct",
    method: "POST",
    data: { id: e },
    dataType: "JSON",
  });
  $(".list-item > .dssp").empty();

  if (arr_obj.length === 0) {
    html += "<h2>Không tìm thấy sản phẩm nào</h2>";
  } else {
    arr_obj.forEach((item, index) => {
      html +=
        '<div class="card my-3" style="width: 16rem;"><img class="card-img-top" style ="height: 10rem;" src="' +
        item.image_src +
        '" alt="Card image cap"><div class="card-body"><h5 class="card-title">' +
        item.name +
        '</h5>  <p class="card-text" style ="height: 8rem;">' +
        item.description +
        '</p>  <div class="row justify-content-around">          <span class="font-weight-bold">' +
        item.price +
        ' VND</span>          <span class="font-weight-light font-italic">' +
        item.time +
        '</span>          <button class="btn btn-success float-right" onclick ="addToCart(' +
        item.id +
        ')">+      </button> <input type="hidden" name="id" id=' +
        item.id +
        " /></div>  </div></div>";
    });
  }
  $(html).appendTo(".list-item > .dssp");
}
