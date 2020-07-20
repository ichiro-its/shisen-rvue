<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-row>
          <v-col>
            <v-card>
              <v-card-subtitle>Node Setting</v-card-subtitle>
              <v-container>
                <InputText label="Ros Bridge Address" :value="rosBridge.address" :change="rosBridgeAddressChange"/>
                <InputText label="Node Name" :value="node.nodeName" :change="nodeNameChange"/>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-subtitle>Captured Image</v-card-subtitle>
              <v-container>
                <CompressedImage :node="node" topicName="/compressed_image"/>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-row>
          <v-col>
            <v-card>
              <v-card-subtitle>Preprocess Effect</v-card-subtitle>
              <v-container>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="Brightness" property-name="brightness" :step="10"/>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="Contrast" property-name="contrast" :step="10"/>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="Saturation" property-name="saturation" :step="10"/>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="Hue" property-name="hue" :step="10"/>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="Temperature" property-name="temperature" :step="10"/>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="Gain" property-name="gain" :step="10"/>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-subtitle>Camera Transform</v-card-subtitle>
              <v-container>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="Focus" property-name="focus"/>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="Zoom" property-name="zoom"/>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="Pan" property-name="pan"/>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="Tilt" property-name="tilt"/>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="Roll" property-name="roll"/>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="4">
        <v-row>
          <v-col>
            <v-card>
              <v-card-subtitle>Capture Setting</v-card-subtitle>
              <v-container>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="FPS" property-name="fps"/>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="Auto Exposure" property-name="auto_exposure"/>
                <PropertyInputBoolean :properties="properties" :log="log"
                  label="Auto White Balance" property-name="auto_wb"/>
                <PropertyInputBoolean :properties="properties" :log="log"
                  label="Auto Focus" property-name="autofocus"/>
                <PropertyInputBoolean :properties="properties" :log="log"
                  label="Backlight" property-name="backlight"/>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-subtitle>Frame Size</v-card-subtitle>
              <v-container>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="Frame Width" property-name="frame_width"/>
                <PropertyInputNumber :properties="properties" :log="log"
                  label="Frame Height" property-name="frame_height"/>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CompressedImage from '@/components/CompressedImage'
import InputText from '@/components/InputText'
import PropertyInputBoolean from '@/components/PropertyInputBoolean'
import PropertyInputNumber from '@/components/PropertyInputNumber'
import Node from '@/lib/Node'
import Properties from '@/lib/Properties'
import RosBridge from '@/lib/RosBridge'

export default {
  name: 'shisen-vide-capturer',
  components: {
    CompressedImage,
    InputText,
    PropertyInputBoolean,
    PropertyInputNumber,
  },
  props: {
    app: { type: Object, required: true },
  },
  data() {
    let rosBridge = new RosBridge({
      onConnect: () => {
        this.log('connected to server!');
      },
      onClose: () => {
        this.log('closed from server! (reconnect in 10 seconds)');
      },
      onError: () => {
        this.log('server error!');
      },
    });

    let node = new Node({
      rosBridge: rosBridge,
      nodeName: '/video_capturer',
    });

    let properties = new Properties({
      node: node,
    });

    return {
      rosBridge: rosBridge,
      node: node,
      properties: properties,
    };
  },
  methods: {
    log(message) {
      if (typeof this.app !== 'undefined') {
        this.app.log(message);
      }
      else {
        console.log(message);
      }
    },
    rosBridgeAddressChange(value) {
      if (value != this.rosBridge.address) {
        this.log('connecting to ' + value);
        this.rosBridge.init({
          address: value,
        });
      }
    },
    nodeNameChange(value) {
      if (value != this.node.nodeName) {
        this.log('changing node to ' + value);
        this.node.init({
          nodeName: value,
        });
      }
    },
  },
  created() {
    if (typeof this.app !== 'undefined') {
      this.app.title = 'Video Capturer';
      document.title = this.app.title + ' | Shisen RVue';
    }
  },
}
</script>