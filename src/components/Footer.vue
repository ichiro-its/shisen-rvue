<template>
  <v-footer app absolute class="font-weight-medium">
    <v-col v-if="typeof app.project !== 'undefined' && typeof app.version !== 'undefined'"
      class="text-center" cols="12">
      <strong>{{app.project}}</strong> (v{{app.version}})
    </v-col>
  </v-footer>
</template>

<script>
export default {
  name: "shisen-footer",
  props: {
    app: { type: Object, required: true },
  },
}
</script>