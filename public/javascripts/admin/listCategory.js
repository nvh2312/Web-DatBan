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
        url: "http://localhost:3000/admin/api/getPageCategories",
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
            return `<div class= "my-3">${btnEdit}${btnDelete}</div>`;
          },
        },
      ],
    });
  }
$(document).ready(function () {
  loadData();
});
function reloadData() {
  $("#sample_data").DataTable().ajax.reload();
}
$("#add_data").click(function () {
  $("label").remove(".error");
  $("#dynamic_modal_title").text("Add Category");

  $("#sample_form")[0].reset();

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

    },
    messages: {
      name: {
        required: "Vui lòng nhập tên",
      },

    },
  });
}
$("#sample_form").on("submit", function (event) {
  if (validator.form()) {
    event.preventDefault();

    $.ajax({
      url: "http://localhost:3000/admin/api/actionCategory",
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
  let id = $(this).data("id");

  $("#dynamic_modal_title").text("Edit Category");

  $("#action").val("Edit");

  $("#action_button").text("Edit");

  $("#action_modal").modal("show");

  $.ajax({
    url: "http://localhost:3000/admin/api/actionCategory",
    method: "POST",
    data: { id: id, action: "fetch_single" },
    dataType: "JSON",
    success: function (data) {
      $("#name").val(data.name);
      $("#id").val(data.id);
    },
  });
});
$(document).on("click", ".delete", function () {
  let id = $(this).data("id");

  if (confirm("Are you sure you want to delete this data?")) {
    $.ajax({
      url: "http://localhost:3000/admin/api/actionCategory",
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
