let qtt = JSON.parse(localStorage.getItem("total"));
if (!qtt) {
  qtt = 0;
}
$(".count").html(qtt);
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