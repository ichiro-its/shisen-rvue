<template>
  <v-row align="center" no-gutters>
    <v-col cols="6">
      {{label}}
    </v-col>
    <v-col cols="6">
      <v-layout justify-center>
        <v-switch :input-value="value" :label="(value) ? 'True' : 'False'"
          @change="onChange" hide-details/>
      </v-layout>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ShisenInputBoolean',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
    },
    change: {
      type: Function,
    },
  },
  methods: {
    onChange(value) {
      if (typeof this.change === 'function') {
        this.change(value || false);
      }
    },
  },
}
</script>