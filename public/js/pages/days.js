
function showDay(day) {
  const day1 = document.getElementById("day-1");
  const day2 = document.getElementById("day-2");
  const btn1 = document.getElementById("btn-day-1");
  const btn2 = document.getElementById("btn-day-2");

  const isAlreadyActive = (day === 1 && day1.classList.contains("active")) ||
                          (day === 2 && day2.classList.contains("active"));
  if (isAlreadyActive) return;

  // Reset states
  day1.classList.remove("active", "out-left");
  day2.classList.remove("active", "out-left");

  // Switch with fade
  if (day === 1) {
    day2.classList.add("out-left");
    setTimeout(() => day1.classList.add("active"), 50);
    btn1.classList.add("active");
    btn2.classList.remove("active");
  } else {
    day1.classList.add("out-left");
    setTimeout(() => day2.classList.add("active"), 50);
    btn1.classList.remove("active");
    btn2.classList.add("active");
  }
}
