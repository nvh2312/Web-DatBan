let arr_order = [];
function showToast(msg) {
  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-top-right",
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
function loadData() {
  $("#sample_data").DataTable({
    sScrollX: "100%",
    sScrollXInner: "101%",
    bScrollCollapse: true,
    processing: true,
    serverSide: true,
    serverMethod: "get",
    ajax: {
      url: "http://localhost:3000/admin/api/getOrders",
    },
    aaSorting: [],
    columns: [
      {
        data: "id",
        render: function (data) {
          return '<div class= "my-3">' + data + "</div>";
        },
      },
      {
        data: "status",
        render: function (data) {
          return '<div class= "my-3">' + data + "</div>";
        },
      },
      {
        data: "total",
        render: function (data) {
          return '<div class= "my-3">' + data + "</div>";
        },
      },
      {
        data: "date_init",
        render: function (data) {
          return '<div class= "my-3">' + data + "</div>";
        },
      },
      {
        data: "user_phone",
        render: function (data) {
          return '<div class= "my-3">' + data + "</div>";
        },
      },
      {
        data: null,
        render: function (row) {
          let btnView = `<a href="/admin/orders/${row.id}"><button type="button" class="btn btn-primary btn-sm mr-1" data-id="' +
            row.id +
            '">View</button></a>`;

          return `<div class= "my-3">${btnView}</div>`;
        },
      },
    ],
  });
}
function loadProducts() {
  $.ajax({
    url: "http://localhost:3000/home/api/showProduct",
    method: "POST",
    data: {},
    dataType: "JSON",
    success: (data) => {
      data.forEach((value) => {
        $("#order_items").append(
          "<option value=" + value.id + ">" + value.name + "</option>"
        );
      });
    },
  });
}
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
$("#order_items").change(function () {
  $(".list-item").empty();
  arr_order = [];
  $(this)
    .val()
    .forEach(async (value, index) => {
      let data = await $.ajax({
        url: "http://localhost:3000/home/api/getProduct",
        method: "POST",
        data: { id: value },
        dataType: "JSON",
      });
      let vt = index + 1;
      let html =
        '<hr><div class="d-flex"><div class="col-md-2"><p class="mt-1">' +
        vt +
        '.</p></div><div class="col-md-3 product-name"><p class="mt-1">' +
        data.name +
        '</p></div><div class="col-md-3 price text-center">  <p class="mt-1">' +
        data.price +
        '</p></div><div class="col-md-1 mt-1">x</div><div class="col-md-3 quantity"><input id="' +
        index +
        '" type="number" value="1"class="form-control quantity-input" min="1" onchange="updateQuantity(this)"> </div> </div>';
      $(".list-item").append(html);
      const item = {
        id: value,
        price: data.price,
        quantity: 1,
      };
      arr_order.push(item);
    });
  console.log(arr_order);
});

function updateQuantity(value) {
  arr_order[value.id].quantity = value.value;
  console.log(arr_order);
}

$(document).ready(function () {
  // let options = $('option[value="8"]');
  // options.prop('disabled', 'true');
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
function reloadData() {
  $("#sample_data").DataTable().ajax.reload();
}
$("#add_data").click(function () {
  $("#order_items").empty();
  $("#floor").empty();
  loadFloors();
  loadProducts();
  $("label").remove(".error");
  $("#dynamic_modal_title").text("Add Order");

  $("#sample_form")[0].reset();

  $("#action").val("Add");

  $("#action_button").text("Add");

  $("#action_modal").modal("show");
});
$("#order_times").change(function () {
  console.log($(this).val());
});
$("#sample_form").on("submit", function (event) {
  event.preventDefault();
  arr_order = JSON.stringify(arr_order);
  //arr_order,
  let booking_date = $("#pickadate").val();
  let booking_time = $("#order_times").val();
  let booking_name = $("#booking_name").val();
  let booking_phone = $("#booking_phone").val();
  let table_id = $("#order_table").val();
  let action = $("#action").val();
  booking_time = JSON.stringify(booking_time);

  $.ajax({
    url: "http://localhost:3000/admin/api/actionOrder",
    method: "POST",
    data: {
      booking_date,
      booking_time,
      booking_name,
      booking_phone,
      arr_order,
      table_id,
      action,
    },
    dataType: "JSON",
    beforeSend: function () {
      $("#action_button").attr("disabled", "disabled");
    },
    success: function (data) {
      $("#action_button").attr("disabled", false);
      $("#action_modal").modal("hide");
      showToast(data.message);
      reloadData();
    },
  });
});
$(document).on("click", ".edit", function () {
  $("label").remove(".error");
  $(".form-control").each(function (index) {
    $(".form-control")[index].className = "form-control";
  });
  $("#category_product").empty();
  loadCategory();
  let id = $(this).data("id");

  $("#dynamic_modal_title").text("Edit Product");

  $("#action").val("Edit");

  $("#action_button").text("Edit");

  $("#action_modal").modal("show");

  $.ajax({
    url: "http://localhost:3000/admin/api/actionProduct",
    method: "POST",
    data: { id: id, action: "fetch_single" },
    dataType: "JSON",
    success: function (data) {
      $("#name").val(data.name);
      $("#description").val(data.description);
      $("#price").val(data.price);
      $("#image_src").val(data.image_src);
      $("#time").val(data.time);
      $("#category_product").val(data.category_product).trigger("change");
      $("#id").val(data.id);
    },
  });
});
$(document).on("click", ".delete", function () {
  let id = $(this).data("id");

  if (confirm("Are you sure you want to delete this data?")) {
    $.ajax({
      url: "http://localhost:3000/admin/api/actionProduct",
      method: "POST",
      data: { action: "delete", id: id },
      dataType: "JSON",
      success: function (data) {
        showToast(data.message);
        reloadData();
      },
    });
  }
});
$(document).on("click", ".item-dis", function () {
  let id = $(this).data("id");

  $.ajax({
    url: "http://localhost:3000/admin/api/disableProduct",
    method: "POST",
    data: { id: id },
    dataType: "JSON",
    success: function (data) {
      showToast(data.message);
      reloadData();
    },
  });
});
