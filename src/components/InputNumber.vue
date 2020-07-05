<template>
  <v-row align="center" dense>
    <v-col cols="6">
      {{label}}
    </v-col>
    <v-col v-if="typeof this.step === 'number'" cols="2">
      <v-btn @click="onDecrease" small>{{'-'  + Math.abs(this.step)}}</v-btn>
    </v-col>
    <v-col :cols="(typeof this.step === 'number') ? 2 : 6">
      <v-text-field :value="value" type="number" @change="onChange" @blur="onBlur"
        hide-details solo dense>
      </v-text-field>
    </v-col>
    <v-col v-if="typeof this.step === 'number'" cols="2">
      <v-btn @click="onIncrease" small>{{'+'  + Math.abs(this.step)}}</v-btn>
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
      type: Number,
    },
    step: {
      type: Number,
    },
    change: {
      type: Function,
    },
  },
  methods: {
    onChange(value) {
      if (typeof this.change === 'function') {
        this.change(Number(value));
      }
    },
    onBlur() {
      this.onChange(Number(this.value));
    },
    onDecrease() {
      this.onChange(Number(this.value) - Math.abs(this.step));
    },
    onIncrease() {
      this.onChange(Number(this.value) + Math.abs(this.step));
    },
  },
}
</script>

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }
</style>