// temp functions for
window.connect = function () {
  const room = document.querySelector("#room").value;
  const password = document.querySelector("#password").value;
  window.RTC.Connect(room, password);
};

window.create = function () {
  const room = document.querySelector("#room").value;
  const password = document.querySelector("#password").value;

  window.RTC.Create(room, password);
};
