import Client from '@/lib/Client'
import Subscription from '@/lib/Subscription'

class Properties {
  constructor(options) {
    this.propertyChangeCallbacks = {};
    this.propertyDeleteCallbacks = {};

    if (typeof options === 'object') {
      if (typeof options.node !== 'undefined') {
        options.node.listenInit(() => {
          this.init();
        });

        this.getClient = new Client({
          node: options.node,
          serviceName: '/get_properties',
          serviceType: 'shisen_interfaces/srv/GetProperties',
        });

        this.setClient = new Client({
          node: options.node,
          serviceName: '/set_properties',
          serviceType: 'shisen_interfaces/srv/SetProperties',
        });

        this.eventSubscription = new Subscription({
          node: options.node,
          topicName: '/property_event',
          messageType: 'shisen_interfaces/msg/PropertyEvent',
          callback: (message) => {
            if (typeof message === 'object') {
              message.changed.forEach((property) => {
                this.onPropertyChange(property)
              });

              message.deleted.forEach((propertyName) => {
                this.onPropertyDelete(propertyName);
              });
            }
          },
        });
      }
    }
  }

  init() {
    if (typeof this.getClient !== 'undefined') {
      this.getClient.call({
        request: {},
        callback: (response) => {
          if (typeof response === 'object' && typeof response.properties !== 'undefined') {
            response.properties.forEach((property) => {
              this.onPropertyChange(property);
            });
          }
        },
      });
    }
  }

  onPropertyChange(property) {
    if (typeof property === 'object') {
      if (property.name in this.propertyChangeCallbacks) {
        this.propertyChangeCallbacks[property.name].forEach((callback) => {
          if (typeof callback === 'function') {
            callback(property.value);
          }
        });
      }
    }
  }

  onPropertyDelete(propertyName) {
    if (propertyName in this.propertyDeleteCallbacks) {
      this.propertyDeleteCallbacks[propertyName].forEach((callback) => {
        if (typeof callback === 'function') {
          callback();
        }
      });
    }
  }

  listenPropertyChange(options) {
    if (typeof options === 'object' && typeof options.name === 'string'
        && typeof options.callback === 'function') {
      if (!(options.name in this.propertyChangeCallbacks)) {
        this.propertyChangeCallbacks[options.name] = [];
      }
      this.propertyChangeCallbacks[options.name].push(options.callback);
    }
  }

  listenPropertyDelete(options) {
    if (typeof options === 'object' && typeof options.name === 'string'
        && typeof options.callback === 'function') {
      if (!(options.name in this.propertyDeleteCallbacks)) {
        this.propertyDeleteCallbacks[options.name] = [];
      }
      this.propertyDeleteCallbacks[options.name].push(options.callback);
    }
  }

  setProperty(options) {
    if (typeof options === 'object' && typeof options.name === 'string'
        && typeof options.value === 'number') {
      if (typeof this.setClient !== 'undefined') {
        this.setClient.call({
          request: {
            properties: [
              {
                name: options.name,
                value: options.value,
              },
            ],
          },
        });
      }
    }
  }
}

export default Properties