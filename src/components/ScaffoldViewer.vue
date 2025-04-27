<script setup>
import { ScaffoldVuer } from '@abi-software/scaffoldvuer';

import {ref} from 'vue'

const ScaffoldSelected = function(annotation) {
    console.log(annotation);
}

const url = ref("https://mapcore-bucket1.s3-us-west-2.amazonaws.com/others/29_Jan_2020/heartICN_metadata.json")
const helpMode =ref(false);
const displayMarkers= ref(true)
const displayMinimap = ref(false)

const widgetName = ref('')

const minimapSettings= ref({
        x_offset: 16,
        y_offset: 16,
        width: 128,
        height: 128,
        align: "bottom-right"
      })
</script>
<template>
<slot :widgetName="widgetName"></slot>
  <ScaffoldVuer style="height:100%;width:100%;"
    :url="url"
    :helpMode="helpMode"
    :displayMarkers="displayMarkers"
    :displayMinimap="displayMinimap"
    :minimapSettings="minimapSettings" />
</template>
<style lang="scss" scoped>
@import '@abi-software/scaffoldvuer/dist/style.css';
</style>