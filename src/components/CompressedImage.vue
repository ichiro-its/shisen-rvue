<template>
  <v-row dense>
    <v-col>
      <img v-if="typeof imgSource !== 'undefined'" :src="imgSource" style="width:100%; height:auto;"/>
      <v-skeleton-loader v-else type="image"></v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
import Subscription from '@/lib/Subscription'

export default {
  name: 'ShisenCompressedImage',
  props: {
    rosBridge: {
      type: Object,
    },
    node: {
      type: Object,
    },
    topicName: {
      type: String,
      required: true,
    },
  },
  data() {
    // either rosBridge or node, but not both
    if (typeof this.node !== 'undefined') {
      delete this.rosBridge;
    }

    return {
      imgSource: undefined,
      subscription: new Subscription({
        rosBridge: this.rosBridge,
        node: this.node,
        topicName: this.topicName,
        messageType: 'shisen_interfaces/CompressedImage',
        callback: (message) => {
          const bytes = new Uint8Array(message.data);
          const blob = new Blob([bytes.buffer]);

          let reader = new FileReader();
          reader.onload = (element) => {
            this.imgSource = element.target.result;
          };

          reader.readAsDataURL(blob);
        },
      }),
    };
  },
}
</script>