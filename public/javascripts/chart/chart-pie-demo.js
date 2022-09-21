// Set new default font family and font color to mimic Bootstrap's default styling
(Chart.defaults.global.defaultFontFamily = "Nunito"),
  '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = "#858796";

async function loadChart() {
  let data = await $.ajax({
    url: "http://localhost:3000/admin/api/countOrder",
    method: "GET",
    dataType: "JSON",
    success: function (data) {
      console.log(data);
    },
  });

  var ctx = document.getElementById("myPieChart");
  let myPieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Chờ thanh toán", "Chờ xác nhận", "Hủy đơn", "Đã thanh toán"],
      datasets: [
        {
          data: [data[0].SL, data[1].SL, data[2].SL, data[3].SL],
          backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "black"],
          hoverBackgroundColor: ["#2e59d9", "#17a673", "#2c9faf"],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: "#dddfeb",
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false,
      },
      cutoutPercentage: 80,
    },
  });
}
// Pie Chart Example
loadChart();
