// temp functions for
window.connect = function () {
  const room = document.querySelector("#room").value;
  const password = document.querySelector("#password").value;
  window.RTC.connect(room, password);
};

window.create = function () {
  const room = document.querySelector("#room").value;
  const password = document.querySelector("#password").value;

  window.RTC.create(room, password);
};
