const form = document.getElementById('attendance-form');
const chartCanvas = document.getElementById('attendance-chart');
let attendanceData = {
  Present: 0,
  Absent: 0,
  Sick: 0,
};

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const present = parseInt(document.getElementById('present-count').value) || 0;
  const absent = parseInt(document.getElementById('absent-count').value) || 0;
  const sick = parseInt(document.getElementById('sick-count').value) || 0;

  attendanceData.Present += present;
  attendanceData.Absent += absent;
  attendanceData.Sick += sick;

  updateChart();
  form.reset();
});

let chart = new Chart(chartCanvas, {
  type: 'pie',
  data: {
    labels: ['Present', 'Absent', 'Sick'],
    datasets: [{
      label: 'School Attendance',
      data: [0, 0, 0],
      backgroundColor: ['#90ee90', '#ff6b6b', '#fdd835'],
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Overall Attendance Distribution'
      }
    }
  }
});

function updateChart() {
  chart.data.datasets[0].data = [
    attendanceData.Present,
    attendanceData.Absent,
    attendanceData.Sick
  ];
  chart.update();
}
