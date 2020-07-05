import ROSLIB from 'roslib'

class RosBridge {
  constructor(options) {
    this.address = 'ws://localhost:9090';
    this.isConnected = false;

    this.initCallbacks = [];

    if (typeof options === 'object') {
      if (typeof options.address === 'string') {
        this.address = options.address;
      }

      if (typeof options.onConnect === 'function') {
        this.onConnect = options.onConnect;
      }

      if (typeof options.onClose === 'function') {
        this.onClose = options.onClose;
      }

      if (typeof options.onError === 'function') {
        this.onError = options.onError;
      }
    }

    this.init();
  }

  init(options) {
    if (typeof options === 'object') {
      if (typeof options.address === 'string') {
        this.address = options.address;
      }
    }

    if (typeof this.ros !== 'undefined') {
      this.ros.close();
    }

    this.ros = new ROSLIB.Ros();
    this.isConnected = false;

    this.ros.on('connection', (...args) => {
      this.isConnected = true;

      // clear previous timeout
      if (typeof this.reconnectTimeout !== 'undefined') {
        clearTimeout(this.reconnectTimeout);
        delete this.reconnectTimeout;
      }

      this.initCallbacks.forEach((initCallback) => {
        initCallback(this);
      });

      if (typeof this.onConnect === 'function') {
        this.onConnect(...args);
      }
    });

    this.ros.on('close', (...args) => {
      this.isConnected = false;

      // clear previous timeout
      if (typeof this.reconnectTimeout !== 'undefined') {
        clearTimeout(this.reconnectTimeout);
        delete this.reconnectTimeout;
      }

      // reconnect in 10s when closed
      this.reconnectTimeout = setTimeout(() => {
        this.init();
      }, 10000);

      if (typeof this.onClose === 'function') {
        this.onClose(...args);
      }
    });

    this.ros.on('error', (...args) => {
      if (typeof this.onError === 'function') {
        this.onError(...args);
      }
    });

    this.ros.connect(this.address);
  }

  listenInit(callback) {
    if (typeof callback == 'function') {
      this.initCallbacks.push(callback);
    }
  }
}

export default RosBridge