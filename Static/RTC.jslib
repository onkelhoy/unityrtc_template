mergeInto(LibraryManager.library, {
  send: function (to, message, channels) {
    /**
    * to:string
    * message:string
    * channels:string|string[]
    */

    window.RTC.send(to, message, channels);
  },

  broadcast: function (message, channels) {
    /**
    * message:string
    * channels:string|string[]
    */

    window.RTC.broadcast(message, channels);
  },

  terminateSocket: function () {
    window.RTC.terminateSocket();
  },

  terminate: function () {
    window.RTC.terminate();
  },

  farwell: function () {
    window.RTC.farwell();
  },

  create: function (room, password) {
    /**
    * room:string
    * password:string
    */

    window.RTC.create(room, password);
  },

  connect: function (room, password) {
    /**
    * room:string
    * password:string
    */

    window.RTC.connect(room, password);
  },

  unityToWeb: function(message, a, b) {
    window.unityToWeb(message, a, b)
  }
});