import ROSLIB from 'roslib'

class Subscription {
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

      if (typeof options.topicName === 'string') {
        this.topicName = options.topicName;
      }

      if (typeof options.messageType === 'string') {
        this.messageType = options.messageType;
      }

      if (typeof options.callback === 'function') {
        this.callback = options.callback;
      }
    }
  }

  init(options) {
    if (typeof options === 'object' && typeof options.ros !== 'undefined') {
      if (typeof this.topicName === 'string' && typeof this.messageType === 'string') {
        if (typeof this.topic !== 'undefined') {
          this.topic.unsubscribe();
        }

        this.topic = new ROSLIB.Topic({
          ros: options.ros,
          name: (typeof options.nodeName === 'string')
            ? options.nodeName + this.topicName
            : this.topicName,
          messageType: this.messageType,
        });

        this.topic.subscribe(this.callback);

        this.initCallbacks.forEach((initCallback) => {
          initCallback(this);
        });
      }
    }
  }

  listenInit(callback) {
    this.initCallbacks.push(callback);
  }
}

export default Subscription