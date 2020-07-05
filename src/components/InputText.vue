<template>
  <v-row align="center" dense>
    <v-col cols="6">
      {{label}}
    </v-col>
    <v-col cols="6">
      <v-text-field :value="value" type="text" @change="onChange" @blur="onBlur"
        hide-details solo dense>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ShisenInputText',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
    },
    change: {
      type: Function,
    },
  },
  methods: {
    onChange(value) {
      if (typeof this.change === 'function') {
        this.change(value);
      }
    },
    onBlur() {
      if (typeof this.change === 'function') {
        this.change(this.value);
      }
    },
  },
}
</script>