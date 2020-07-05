<template>
  <v-app-bar app>
    <v-toolbar-title v-if="typeof app.title !== 'undefined'">
      {{app.title}}
    </v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  name: 'ShisenHeader',
  props: {
    app: {
      type: Object,
      required: true,
    },
  },
}
</script>