<template>
  <InputNumber v-show="this.value !== null" :label="label || propertyName"
    :value="value" :step="step" :change="onChange"/>
</template>

<script>
import InputNumber from '@/components/InputNumber'

export default {
  name: 'ShisenPropertyInputNumber',
  components: {
    InputNumber,
  },
  props: {
    properties: {
      type: Object,
      required: true,
    },
    propertyName: {
      type: String,
      required: true,
    },
    label: {
      type: String,
    },
    step: {
      type: Number,
    },
    log: {
      type: Function,
    },
  },
  data() {
    if (typeof this.properties !== 'undefined') {
      this.properties.listenPropertyChange({
        name: this.propertyName,
        callback: (value) => {
          this.value = value;
        },
      });

      this.properties.listenPropertyDelete({
        name: this.propertyName,
        callback: () => {
          this.value = null;
        },
      });
    }

    return {
      value: null,
    };
  },
  methods: {
    onChange(value) {
      if (this.value !== value) {
        this.value = value;
        if (typeof this.properties !== 'undefined') {
          this.properties.setProperty({
            name: this.propertyName,
            value: this.value,
          });

          if (typeof this.log === 'function') {
            this.log('trying to change ' + this.propertyName + ' to ' + this.value);
          }
        }
      }
    },
  },
}
</script>