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
function cancelOrder(value) {
  let id = $(value).data("id");
  if (confirm("Are you sure?")) {
    $.ajax({
      url: "http://localhost:3000/admin/api/actionOrder",
      method: "POST",
      data: { id: id, action: "Edit", status: "Hủy đơn" },
      dataType: "JSON",
      success: function (data) {
        window.location = "/admin/orders/" + id;
        showToast(data.message);
      },
    });
  }
}
function acceptOrder(value) {
  let id = $(value).data("id");
  if (confirm("Are you sure?")) {
    $.ajax({
      url: "http://localhost:3000/admin/api/actionOrder",
      method: "POST",
      data: { id: id, action: "Edit", status: "Chờ thanh toán" },
      dataType: "JSON",
      success: function (data) {
        window.location = "/admin/orders/" + id;
        showToast(data.message);
      },
    });
  }
}
function completeOrder(value) {
  let id = $(value).data("id");
  if (confirm("Are you sure?")) {
    $.ajax({
      url: "http://localhost:3000/admin/api/actionOrder",
      method: "POST",
      data: { id: id, action: "Edit", status: "Đã thanh toán" },
      dataType: "JSON",
      success: function (data) {
        window.location = "/admin/orders/" + id;
        showToast(data.message);
      },
    });
  }
}
