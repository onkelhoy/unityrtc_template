mergeInto(LibraryManager.library, {
  Send: function (to, message, channels) {
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

  Broadcast: function (message, channels) {
    /**
    * message:string
    * channels:string|string[]
    */

    window.RTC.broadcast(
      Pointer_stringify(message), 
      Pointer_stringify(channels)
    );
  },

  Disconnect: function () {
    window.RTC.Disconnect();
  },
});