/*
* !!! Only to be enabled when Developing Application !!!
* (Static) Development Verbose console logger with timestamps
* When Launching Application for Release:
* => Change _enabled to false
*     => all Debug logs will not be printed in console
*/
export class Debug {
  private static _enableLogging = true; // Change to enable Client-Console Debug-Message logging

  static log(str: any): void {
    if (!this._enableLogging) return;
    console.log(this.timestamp() + " " + str);
  }
  // Current local Timestamp, '[HH:MM,SS] '
  private static timestamp(): string {
    var date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return "[" + hours + ":" + minutes + ":" + seconds + "]";
  }
}

