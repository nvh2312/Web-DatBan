const phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
const emailCheck =
  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
$("#signup").click((event) => {
  if (
    !$("#name").val() ||
    !$("#phone").val() ||
    !$("#password").val() ||
    !$("#re-pass").val() ||
    !$("#email").val()
  ) {
    alert("Vui lòng điền đầy đủ thông tin");
  } else {
    let loi = "";
    loi = $("#err-name")
      .text()
      .concat(
        $("#err-phonenb").text(),
        $("#err-repa").text(),
        $("#err-email").text()
      );
    if (loi) {
      alert("Vui lòng điền thông tin chính xác!!!");
    } else {
      event.preventDefault();
      $.ajax({
        url: "http://localhost:3000/login/addUser",
        method: "POST",
        data: $(".sign-up-form").serialize(),
        dataType: "JSON",
        success: () => {
          alert("Đăng ký tài khoản thành công");
          $("#tab-1").click();
        },
      });
    }
  }
});

$("#tab-2").click(() => {
  $(".login-box").height("850px");
});
$("#tab-1").click(() => {
  $(".login-box").height("650px");
});

$("#phone").keyup(() => {
  let phone = $("#phone").val();
  if (!phone) {
    $("#err-phonenb").html("Số điện thoại không được để trống");
  } else if (!phone.match(phones)) {
    $("#err-phonenb").html("Số điện thoại không đúng");
  } else {
    $.ajax({
      url: "http://localhost:3000/login/fetchSingleUser",
      method: "POST",
      data: { phone: phone },
      dataType: "JSON",
      success: (data) => {
        if (data.data) {
          $("#err-phonenb").html("Số điện thoại đã được đăng ký");
        } else {
          $("#err-phonenb").empty();
        }
      },
    });
  }
});
$("#name").keyup(() => {
  let name = $("#name").val();
  if (!name) {
    $("#err-name").html("Tên không được để trống");
  }
});
$("#password").blur(() => {
  let password = $("#password").val();
  if (password) {
    $("#err-pass").empty();
  }
});
$("#password").keyup(() => {
  if ($("#re-pass").val()) {
    let password = $("#password").val();
    if (password && password != $("#re-pass").val()) {
      $("#err-repa").html("Mật khẩu không khớp");
    } else $("#err-repa").empty();
  }
});
$("#re-pass").keyup(() => {
  if ($("#password").val()) {
    let repass = $("#re-pass").val();
    if (repass == $("#password").val()) {
      $("#err-repa").empty();
    } else $("#err-repa").html("Mật khẩu không khớp");
  }
});
$("#name").blur(() => {
  let name = $("#name").val();
  if (name) {
    $("#err-name").empty();
  }
});
$("#email").keyup(() => {
  let email = $("#email").val();
  if (!email) {
    $("#err-email").html("Email không được để trống");
  } else if (!email.match(emailCheck)) {
    $("#err-email").html("Email không đúng");
  } else $("#err-email").empty();
});

$("#signin").click(() => {
  const phone = $("#phone-log").val();
  const password = $("#pass").val();

  if (!phone || !password) {
    alert("Vui lòng điền đầy đủ thông tin");
  } else {
    $.ajax({
      url: "http://localhost:3000/login/checkLogin",
      method: "POST",
      data: { phone: phone, password: password },
      dataType: "JSON",
      success: (data) => {
        const mess = data.message;
        console.log(data.token);
        if (mess == "Đăng nhập thành công") {
          setCookie("token", data.token, 1);
          if(data.role == 1)window.location="/admin";
          else window.location="/home";
        }
        else alert(mess);
      },
    });
  }
});
