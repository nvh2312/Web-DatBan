const phones = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
jQuery.validator.addMethod(
  "phonenb",
  function (element) {
    return !phones.test(element) ? false : true;
  },
  "Invalid phone number"
);
jQuery.validator.addMethod(
  "checkPhone",
  function (element) {
    // const a = await $.ajax({
    //   url: "http://localhost:3000/login/checkPhone",
    //   method: "POST",
    //   data: { phone: element },
    //   dataType: "JSON",
    // });
    // console.log(a);
    // return !a;
    return $.ajax({
      url: "http://localhost:3000/login/checkPhone",
      method: "POST",
      data: { phone: element },
      dataType: "JSON",
    });
  },
  "Số điện thoại đã được đăng ký "
);

function showToast(msg, opt) {
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
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };
  let $toast = toastr[opt](msg);
}

let validator = null;
let $sample_form = $("#sample_form");
if ($sample_form.length) {
  validator = $sample_form.validate({
    rules: {
      name: {
        required: true,
      },
      phone: {
        required: true,
        phonenb: true,
      },
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
      },
      balance: {
        min: 0,
      },
    },
    messages: {
      name: {
        required: "Vui lòng nhập tên",
      },
      phone: {
        required: "Vui lòng điền số điện thoại",
        phonenb: "Số điện thoại không đúng không đúng",
      },
      email: {
        required: "Vui lòng điền email",
        email: "Email không đúng",
      },
      password: "Vui lòng điền mật khẩu",
      balance: {
        min: "Số dư phải lớn hơn 0",
      },
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
      url: "http://localhost:3000/admin/api/getUsers",
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
        data: "name",
        render: function (data) {
          return '<div class= "my-3">' + data + "</div>";
        },
      },
      {
        data: "phone",
        render: function (data) {
          return '<div class= "my-3">' + data + "</div>";
        },
      },

      {
        data: "email",
        render: function (data) {
          return '<div class= "my-3">' + data + "</div>";
        },
      },
      {
        data: "balance",
        render: function (data) {
          return '<div class= "my-3">' + data + "</div>";
        },
      },
      {
        data: null,
        render: function (row) {
          let btnEdit =
            '<button type="button" class="btn btn-primary btn-sm mr-1 edit" data-id="' +
            row.id +
            '">Edit</button>';
          let btnDelete =
            '<button type="button" class="btn btn-danger btn-sm delete" data-id="' +
            row.id +
            '">Delete</button></div>';
          return `<div class= "ml-4 my-3 d-flex">${btnEdit}${btnDelete}</div>`;
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
  $("#dynamic_modal_title").text("Add User");

  $("#sample_form")[0].reset();

  $("#action").val("Add");

  $("#action_button").text("Add");

  $("#phone").attr("readonly", false);

  $("#action_modal").modal("show");
});

$("#sample_form").on("submit", function (event) {
  if (validator.form()) {
    event.preventDefault();

    $.ajax({
      url: "http://localhost:3000/admin/api/actionUser",
      method: "POST",
      data: $("#sample_form").serialize(),
      dataType: "JSON",
      beforeSend: function () {
        $("#action_button").attr("disabled", "disabled");
      },
      success: function (data) {
        $("#action_button").attr("disabled", false);
        if (data.message == "Phone đã tồn tại ") {
          $("#phone").focus();
          showToast(data.message, "warning");
        } else {
          $("#action_modal").modal("hide");
          showToast(data.message, "success");
          reloadData();
        }
      },
    });
  } else {
    showToast("Vui lòng điền thông tin chính xác", "error");
    return false;
  }
});
$(document).on("click", ".edit", function () {
  $("label").remove(".error");
  $(".form-control").each(function (index) {
    $(".form-control")[index].className = "form-control";
  });
  let id = $(this).data("id");

  $("#dynamic_modal_title").text("Edit User");

  $("#action").val("Edit");

  $("#action_button").text("Edit");

  $("#phone").attr("readonly", true);

  $("#action_modal").modal("show");

  $.ajax({
    url: "http://localhost:3000/admin/api/actionUser",
    method: "POST",
    data: { id: id, action: "fetch_single" },
    dataType: "JSON",
    success: function (data) {
      $("#name").val(data.name);
      $("#phone").val(data.phone);
      $("#password").val(data.password);
      $("#email").val(data.email);
      $("#balance").val(data.balance);
      $("#role").val(data.role);
    },
  });
});
$(document).on("click", ".delete", function () {
  let id = $(this).data("id");

  if (confirm("Are you sure you want to delete this data?")) {
    $.ajax({
      url: "http://localhost:3000/admin/api/actionUser",
      method: "POST",
      data: { action: "delete", id: id },
      dataType: "JSON",
      success: function (data) {
        showToast(data.message, "success");
        reloadData();
      },
    });
  }
});
