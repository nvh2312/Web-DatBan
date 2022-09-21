let totalPrice = 0;
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
const loadData = () => {
  $("#floor").empty();
  loadFloors();
  $("select").select2({
    theme: "bootstrap-5",
  });
  $("#pickadate").flatpickr();
  flatpickr("#pickadate", {
    minDate: "today",
    maxDate: new Date().fp_incr(14), // 14 days from now
    disable: [
      function (date) {
        // return true to disable
        return date.getDay() === 0;
      },
    ],
  });

  let qtt = JSON.parse(localStorage.getItem("total"));
  if (!qtt) {
    qtt = 0;
  }
  $(".count").html(qtt);
  let arr_cart = JSON.parse(localStorage.getItem("cart"));
  $(".items").empty();
  let html = "";

  if (arr_cart)
    arr_cart.forEach((item) => {
      totalPrice += item.product.price * Number(item.quantity);
      html +=
        '<div class="product border-bottom text-dark ml-3"><div class="row"><div class="col-md-3"> <img class="img-fluid mx-auto my-5 d-block image" src="' +
        item.product.image_src +
        '"> </div>   <div class="col-md-8">   <div class="info">    <div class="row">      <div class="col-md-5 product-name">  <div class="product-name">   <h5>' +
        item.product.name +
        '</h5> <div class="product-info"><div>Mô tả: <span class="value">' +
        item.product.description +
        '</span></div>       <div>Giá: <span class="value">' +
        item.product.price +
        '  VND</span> </div><div>Thời gian: <span class="value">' +
        item.product.time +
        '</span>   </div>    </div></div>  </div>  <div class="col-md-4 quantity">  <label for="quantity' +
        item.product.id +
        '">Quantity:</label>   <input id="quantity' +
        item.product.id +
        '" type="number" data-id="' +
        item.product.id +
        '" value="' +
        item.quantity +
        '" class="form-control quantity-input" min="1" onchange ="changeQuantity(this)">    </div> <div class="col-md-3 price text-center">   <label class="font-weight-light">Price:</label> <p id="price' +
        item.product.id +
        '">' +
        item.product.price * Number(item.quantity) +
        '</p> <button class="btn btn-success border-secondary bg-white text-dark mb-2 refresh" data-id="' +
        item.product.id +
        '" onclick="refresh(this)">  <i class="fa fa-refresh"></i> </button> <button class="btn btn-success border-secondary bg-white text-dark mb-2 delete" data-id="' +
        item.product.id +
        '" onclick="deleteItem(this)"> <i class="fa fa-trash"></i>  </button>   </div>    </div>   </div>   </div>  </div></div>';
    });
  $(".showSl").html(`Hiện đang có ${qtt} món ăn.`);
  if (qtt == 0) {
    html += '<div class="text-center mt-5"><h2>Chưa có sản phẩm nào</h2></div>';
  }
  $(html).appendTo(".items");
  $(".totalPrice").html(totalPrice + " VND");
  $(".total").html(totalPrice + " VND");
  localStorage.setItem("price", JSON.stringify(totalPrice));
};
async function loadFloors() {
  await $.ajax({
    url: "http://localhost:3000/admin/api/getAllFloors",
    method: "GET",
    data: {},
    dataType: "JSON",
    success: (data) => {
      data.forEach((value) => {
        $("#floor").append(
          "<option value=" + value.id + ">" + value.name + "</option>"
        );
      });
    },
  });
  $("#floor").change();
}
$("#floor").change(function () {
  let floorID = $(this).val();
  loadTables(floorID);
});
function loadTables(floorID) {
  $("#order_table").empty();
  $.ajax({
    url: "http://localhost:3000/admin/api/getAllTableFloor",
    method: "POST",
    data: { floorID },
    dataType: "JSON",
    success: (data) => {
      data.forEach((value) => {
        $("#order_table").append(
          "<option value=" + value.id + ">" + value.name + "</option>"
        );
      });
    },
  });
}
let arr_obj = "";

$(document).ready(async function () {
  loadData();
});
$("#pickadate").change(async function () {
  $("#order_times option").each((value) => {
    $("option[value=" + (value + 8) + "]").prop("disabled", false);
  });
  let arr = [];
  let inputDate = $(this).val().slice(8, 11);
  const date = new Date();
  let dt = date.getDate();
  let h = date.getHours();
  if (dt < 10) dt = "0" + dt;
  console.log(dt == inputDate);
  if (dt == inputDate) {
    $("#order_times option").each((value) => {
      if (value + 8 <= h) {
        $("option[value=" + (value + 8) + "]").prop("disabled", "true");
      }
    });
  }
  let a = await $.ajax({
    url: "http://localhost:3000/admin/api/getTime",
    method: "POST",
    data: { timeOrder: $(this).val() },
    dataType: "JSON",
  });
  await a.forEach((value) => {
    arr = arr.concat(JSON.parse(value.booking_time));
  });
  arr.forEach((value) => {
    $("option[value=" + value + "]").prop("disabled", "true");
  });
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
const changeQuantity = (value) => {
  let id = $(value).data("id");
  let cart = JSON.parse(localStorage.getItem("cart"));
  let item = cart.find((c) => c.product.id == id);
  let lastPrice =
    JSON.parse(localStorage.getItem("price")) -
    item.quantity * item.product.price;
  let total =
    JSON.parse(localStorage.getItem("total")) +
    Number(value.value) -
    item.quantity;
  item.quantity = value.value;
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("total", JSON.stringify(total));
  let price = item.product.price * Number(item.quantity);
  localStorage.setItem("price", JSON.stringify(price + lastPrice));
  $(`#price${id}`).html(price);
  $(".totalPrice").html(price + lastPrice + " VND");
  $(".total").html(price + lastPrice + " VND");
  $(".showSl").html(`Hiện đang có ${total} món ăn.`);
  $(".count").html(total);
};
const refresh = (value) => {
  let id = $(value).data("id");
  $(`#quantity${id}`).val(1);
  $(`#quantity${id}`).change();
};
const deleteItem = (value) => {
  if (confirm("Are you sure you want to delete this item?")) {
    let id = $(value).data("id");
    let cart = JSON.parse(localStorage.getItem("cart"));
    let index = cart.findIndex((c) => c.product.id == id);
    cart.splice(index, 1);
    $(`#quantity${id}`).val(0);
    $(`#quantity${id}`).change();
    localStorage.setItem("cart", JSON.stringify(cart));
    totalPrice = 0;
    loadData();
  }
};

$(".checkout").click(function () {
  let booking_date = $("#pickadate").val();
  let booking_time = $("#order_times").val();
  let booking_name = $("#booking_name").val();
  let booking_phone = $("#booking_phone").val();
  let table_id = $("#order_table").val();
  let description = $("#note").val();
  let arr_order = localStorage.getItem("cart");
  let total = JSON.parse(localStorage.getItem("price"));
  booking_time = JSON.stringify(booking_time);

  $.ajax({
    url: "http://localhost:3000/admin/api/userOrder",
    method: "POST",
    data: {
      booking_date,
      booking_time,
      booking_name,
      booking_phone,
      arr_order,
      total,
      table_id,
      description,
    },
    dataType: "JSON",
    beforeSend: function () {
      $(".checkout").attr("disabled", "disabled");
    },
    success: async function (data) {
      $(".checkout").attr("disabled", false);
      localStorage.clear();
      showToast(data.message);
      loadData();
    },
  });
});
