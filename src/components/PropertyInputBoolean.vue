<template>
  <InputBoolean v-show="this.value !== null" :label="label || propertyName"
    :value="value" :change="onChange"/>
</template>

<script>
import InputBoolean from '@/components/InputBoolean'

export default {
  name: 'shisen-property-input-boolean',
  components: {
    InputBoolean,
  },
  props: {
    properties: { type: Object, required: true },
    propertyName: { type: String, required: true },
    label: { type: String },
    log: { type: Function },
  },
  data() {
    if (typeof this.properties !== 'undefined') {
      this.properties.listenPropertyChange({
        name: this.propertyName,
        callback: (value) => {
          this.value = (value !== 0);
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
            value: (this.value) ? 1 : 0,
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