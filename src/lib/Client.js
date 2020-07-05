import ROSLIB from 'roslib'

class Client {
  constructor(options) {
    this.callLocked = false;
    this.callQueue = [];

    this.initCallbacks = [];

    if (typeof options === 'object') {
      if (typeof options.rosBridge !== 'undefined') {
        options.rosBridge.listenInit((rosBridge) => {
          if (typeof rosBridge === 'object') {
            this.init({
              ros: rosBridge.ros,
            });
          }
        });
      }

      if (typeof options.node !== 'undefined') {
        options.node.listenInit((node) => {
          if (typeof node === 'object') {
            this.init({
              ros: node.ros,
              nodeName: node.nodeName,
            });
          }
        });
      }

      if (typeof options.serviceName === 'string') {
        this.serviceName = options.serviceName;
      }

      if (typeof options.serviceType === 'string') {
        this.serviceType = options.serviceType;
      }
    }
  }

  init(options) {
    if (typeof options === 'object' && typeof options.ros !== 'undefined') {
      if (typeof this.serviceName === 'string' && typeof this.serviceType === 'string') {
        this.service = new ROSLIB.Service({
          ros: options.ros,
          name: (typeof options.nodeName === 'string')
            ? options.nodeName + this.serviceName
            : this.serviceName,
          serviceType: this.serviceType,
        });

        this.callQueuePop();

        this.initCallbacks.forEach((initCallback) => {
          initCallback(this);
        });
      }
    }
  }

  listenInit(callback) {
    this.initCallbacks.push(callback);
  }

  call(options) {
    if (this.callLocked || typeof this.service === 'undefined') {
      this.callQueue.push(options);
    }
    else {
      this.callLocked = true;
      this.callProcess(options);
    }
  }

  callProcess(options) {
    if (typeof options === 'object') {
      if (typeof options.request !== 'undefined') {
        this.service.callService(
          new ROSLIB.ServiceRequest(options.request),
          (...args) => {
            this.callQueuePop();
            if (typeof options.callback === 'function') {
              options.callback(...args);
            }
          },
          () => {
            this.callQueuePop();
          }
        );
      }
    }
  }

  callQueuePop() {
    if (typeof this.service !== 'undefined') {
      if (this.callQueue.length > 0) {
        this.callProcess(this.callQueue.pop());
      }
      else {
        this.callLocked = false;
      }
    }
  }
}

export default Client