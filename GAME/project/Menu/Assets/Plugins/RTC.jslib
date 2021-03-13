mergeInto(LibraryManager.library, {
  send: function (to, message, channels) {
    /**
    * to:string
    * message:string
    * channels:string|string[]
    */

    window.RTC.send(
      Pointer_stringify(to), 
      Pointer_stringify(message), 
      Pointer_stringify(channels)
    );
  },

  broadcast: function (message, channels) {
    /**
    * message:string
    * channels:string|string[]
    */

    window.RTC.broadcast(
      Pointer_stringify(message), 
      Pointer_stringify(channels)
    );
  },

  terminateSocket: function () {
    window.RTC.terminateSocket();
  },

  terminate: function () {
    window.RTC.terminate();
  },

  start: function () {
    window.RTC.start();
  },

  create: function (room, password) {
    /**
    * room:string
    * password:string
    */

    window.RTC.create(
      Pointer_stringify(room), 
      Pointer_stringify(password)
    );
  },

  connect: function (room, password) {
    /**
    * room:string
    * password:string
    */

    window.RTC.connect(
      Pointer_stringify(room), 
      Pointer_stringify(password)
    );
  },
});