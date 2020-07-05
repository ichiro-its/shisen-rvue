class Node {
  constructor(options) {
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

      if (typeof options.nodeName === 'string') {
        this.nodeName = options.nodeName;
      }
    }
  }

  init(options) {
    if (typeof options === 'object') {
      if (typeof options.ros !== 'undefined') {
        this.ros = options.ros;
      }

      if (typeof options.nodeName === 'string') {
        this.nodeName = options.nodeName;
      }
    }

    if (typeof this.ros !== 'undefined' && typeof this.nodeName === 'string') {
      this.initCallbacks.forEach((initCallback) => {
        initCallback(this);
      });
    }
  }

  listenInit(callback) {
    this.initCallbacks.push(callback);
  }
}

export default Node