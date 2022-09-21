const err_src = "/uploads/tradau.jpg";
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
function loadCategory() {
  $.ajax({
    url: "http://localhost:3000/admin/api/getCategories",
    method: "GET",
    data: {},
    dataType: "JSON",
    success: (data) => {
      $("#category_product").append(
        "<option selected disabled hidden></option>"
      );
      data.data.forEach((value) => {
        $("#category_product").append(
          "<option value=" + value.id + ">" + value.name + "</option>"
        );
      });
    },
  });
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
      url: "http://localhost:3000/admin/api/getItems",
    },
    aaSorting: [],
    columns: [
      {
        data: "image_src",
        render: function (data) {
          return (
            // '<img src="../../uploads/' +
            `<img src="` +
            data +
            `" alt=""height="65" width="65" onerror="this.src='` +
            err_src +
            `';" style="border-radius: 0.275rem;" >`
          );
        },
      },
      {
        data: "name",
        render: function (data) {
          return '<div class= "my-3">' + data + "</div>";
        },
      },
      {
        data: "category_name",
        render: function (data) {
          return '<div class= "my-3">' + data + "</div>";
        },
      },
      {
        data: "price",
        render: function (data) {
          return '<div class= "my-3">' + data + " VND</div>";
        },
      },
      {
        data: "time",
        render: function (data) {
          return '<div class= "my-3">' + data + "</div>";
        },
      },
      {
        data: null,
        render: function (row) {
          let btnDisaleproduct = row.disable
            ? '<button type="button" class="btn btn-warning btn-sm mr-1 item-dis" data-id="' +
              row.id +
              '"><i class="far fa-eye"></i></button>'
            : '<button type="button" class="btn btn-success btn-sm mr-1 item-dis" data-id="' +
              row.id +
              '"><i class="far fa-eye-slash"></i></button>';
          let btnEdit =
            '<button type="button" class="btn btn-primary btn-sm mr-1 edit" data-id="' +
            row.id +
            '">Edit</button>';
          let btnDelete =
            '<button type="button" class="btn btn-danger btn-sm delete" data-id="' +
            row.id +
            '">Delete</button></div>';
          return `<div class= "my-3">${btnDisaleproduct}${btnEdit}${btnDelete}</div>`;
        },
      },
    ],
  });
}

$(document).ready(function () {
  $("select").select2({
    theme: "bootstrap-5",
  });
  loadData();
});
function reloadData() {
  $("#sample_data").DataTable().ajax.reload();
}
$("#add_data").click(function () {
  $("label").remove(".error");
  loadCategory();
  $("#dynamic_modal_title").text("Add Product");

  $("#sample_form")[0].reset();
  $("#category_product").empty();

  $("#action").val("Add");

  $("#action_button").text("Add");

  $("#action_modal").modal("show");
});
let validator = null;
let $sample_form = $("#sample_form");
if ($sample_form.length) {
  validator = $sample_form.validate({
    rules: {
      name: {
        required: true,
      },
      description: {
        required: true,
        maxlength: 50,
      },
      price: {
        required: true,
        min: 0,
      },
      image_src: {
        required: true,
        extension: "jpeg|jpg|png",
      },
      time: {
        required: true,
        maxlength: 30,
      },
      category_product: {
        required: true,
      },
    },
    messages: {
      name: {
        required: "Vui lòng nhập tên sản phẩm",
      },
      description: {
        required: "Vui lòng nhập mô tả sản phẩm",
        maxlength: "Vượt quá giới hạn kí tự",
      },
      price: {
        required: "Vui lòng nhập giá",
        min: "Giá bán phải lớn hơn 0",
      },
      image_src: {
        required: "Vui lòng chọn ảnh cho sản phẩm",
        extension: "Sai định dạng",
      },
      time: {
        required: "Vui lòng nhập thời gian chuẩn bị",
        maxlength: "Vượt quá giới hạn kí tự",
      },
      category_product: {
        required: "Vui lòng chọn loại sản phẩm",
      },
    },
  });
}
$("#sample_form").on("submit", function (event) {
  if (validator.form()) {
    event.preventDefault();

    $.ajax({
      url: "http://localhost:3000/admin/api/actionProduct",
      method: "POST",
      data: $("#sample_form").serialize(),
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
  } else {
    return false;
  }
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
      $("#category_product").val(data.category_product).trigger('change');
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
