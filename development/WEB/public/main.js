// temp functions for
window.connect = function () {
  const room = document.querySelector("#room").value;
  const password = document.querySelector("#password").value;
  window.RTC.connect(room, password);
};

window.set_name = function () {
  const name = document.querySelector("#name").value;
  window.RTC.login(name, "123");
};

window.create = function () {
  const room = document.querySelector("#room").value;
  const password = document.querySelector("#password").value;

  window.RTC.create(room, password);
};
