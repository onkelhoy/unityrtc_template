mergeInto(LibraryManager.library, {
  UTWSend: function (to, message, channels) {
    /**
    * to:string
    * message:string
    * channels:string|string[]
    */

    if (window.RTC)
      window.RTC.send(
        Pointer_stringify(to), 
        Pointer_stringify(message), 
        Pointer_stringify(channels)
      );
    else console.log("ERROR - send called but RTC is not avaliable");
  },

  UTWBroadcast: function (message, channels) {
    /**
    * message:string
    * channels:string|string[]
    */

    if (window.RTC)
      window.RTC.broadcast(
        Pointer_stringify(message), 
        Pointer_stringify(channels)
      );
    else console.log("ERROR - broadcast called but RTC is not avaliable");
  },

  UTWDisconnect: function () {
    if (window.RTC) 
      window.RTC.disconnect();
    else console.log("ERROR - disconnect called but RTC is not avaliable");
  },
});