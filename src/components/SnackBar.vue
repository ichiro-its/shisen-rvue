<template>
  <v-snackbar v-model="snackbar" timeout="-1">
    {{message}}
    <template v-slot:action="{attrs}">
      <v-btn text v-bind="attrs" @click="close()">
        <span v-if="queue.length > 0">Next ({{queue.length}})</span>
        <span v-else>Close</span>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'shisen-snackbar',
  props: {
    app: { type: Object, required: true },
  },
  data() {
    return {
      snackbar: false,
      message: '',
      queue: [],
    };
  },
  methods: {
    show(message) {
      this.message = message;
      this.snackbar = true;
      if (typeof this.timeout !== 'undefined') {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        if (this.snackbar) {
          this.close();
        }
      }, 4000);
    },
    close() {
      this.snackbar = false;
      if (typeof this.timeout !== 'undefined') {
        clearTimeout(this.timeout);
      }
      if (this.queue.length > 0) {
        this.timeout = setTimeout(() => {
          if (!this.snackbar) {
            this.show(this.queue.shift());
          }
        }, 200);
      }
    },
  },
  mounted() {
    if (typeof this.app !== 'undefined') {
      this.app.log = (message) => {
        console.log(message);
        if (this.snackbar) {
          this.queue.push(message);
        }
        else {
          this.show(message);
        }
      };
    }
  }
}
</script>