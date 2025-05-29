<template>
    <slot :widgetName="widgetName"></slot>
    <button v-if="debug" @click="debugCall">test selection</button>
    <div v-bind="$attrs" class="flatmap-viewer tw-p-0">
        <div class="tw-text-left tw-pl-1 flatmap-text" >
            <el-tooltip placement="top-start">
                <template #content>   select location on flatmap to filter the image selector  </template>
                <el-icon color="#8300BF"><InfoFilled /></el-icon>
            </el-tooltip>
            <p><b>Current Location: </b>{{ locationLabel }}</p>
        </div>

        <FlatmapVuer ref="flatmapRef" uuid="0ea568ec-538d-52f3-a8e7-0437d844e1cf" class="tw-px-2 tw-py-2" :disableUI="disableFlatmapUI" entry="UBERON:0001759" v-on:resource-selected="FlatmapSelected"  v-on:ready="FlatmapReady"/>

    </div>

</template>
<script setup>
  import { ref, inject, nextTick} from "vue";
  import {FlatmapVuer, MultiFlatmapVuer} from '@abi-software/flatmapvuer';
  import { useGlobalVarsStore } from '../stores/globalVars'
  import { useLocationStore} from "../stores/locationSelect";
  import "@abi-software/flatmapvuer/dist/style.css";
  import { ElTooltip } from "element-plus";
  import { InfoFilled } from "@element-plus/icons-vue";

  FlatmapVuer.props.flatmapAPI.default="https://mapcore-demo.org/devel/flatmap/v4/";

defineOptions({
        inheritAttrs: false
    })
  const props = defineProps({
    listening:{
            type:Boolean
    }
  })
  const debug = false;
  const GlobalVars = useGlobalVarsStore();
  const disableFlatmapUI = true;
  let FlatmapReady = false;

  const widgetName = ref('Flatmap Selector');
  const emitter = inject('emitter');
  const flatmapRef = ref('flatmapRef');

    let locationId = "";
    const locationLabel = ref("None selected");
    const locationStore = useLocationStore();

function FlatmapSelected([data]){
    if (data.eventType === 'click') {
    resetLocation();
    clearMarkers();
    showMarker(data);

    if(!data.feature.location || locationId===data.feature.location){return;}
    locationLabel.value = data.label;
    GlobalVars.FLATMAP_LOCATION = data.label ? data.label: "";
    locationId = data.feature.location;
    //const locationMinMax = addBufferToMinMax(locationId);
    //send to image selector
    locationStore.getLocationFromMinMax(locationId-.1,locationId+.1)
    }
}
function debugCall(){
    locationStore.getLocationFromMinMax(.1,.15);
}
function showMarker(data){
    if (data.eventType === 'click') {
        const flatmapRefMap = flatmapRef.value.mapImp;

        const { kind, models, location } = data.feature;
        if (flatmapRefMap && models && location && kind === 'centreline') {
            flatmapRefMap.addMarker(models, {
                location: location
            });
        }
    }
}
function clearMarkers() {
    const flatmapRefMap = flatmapRef.value.mapImp;
    if (flatmapRefMap) {
        flatmapRefMap.clearMarkers();
    }
}
function resetLocation() {
    locationId = "";
    locationLabel.value = "None selected";
}
//this function is my temp work around to not having the map return anything useful
function addBufferToMinMax(id){
    return{
            min:id-.1,
            max:id+.1
        }
}

</script>
<style>
/* this cannot be scoped while still working as designed. Style leak exists reardless of this line */
        @import "@abi-software/flatmapvuer/dist/style.css";
</style>
<style scoped lang="scss">
@import "../assets/vars.scss";

    .flatmap-viewer{
        display: flex;
        flex-direction: column;

        .flatmap-text{
            display:flex;
            min-height: 60px;
            font-size:20px;
            line-height: 17px;
            margin-left: 4px;
            .el-tooltip__trigger{
                padding: 16px 5px 0 0;
                font-size: 12px;
            }
        }

        :deep(.flatmap-container){
            width:auto;
        }
        :deep(.flatmap-tooltip-popup){
            z-index: 4;
            position:relative;
            max-width: 170px !important;
        }

        p{
            color: grey;
            font-size: 14px;
            b{
                color:#8300BF;
            }
        }
    }
    .open-image{
        color:#8300BF;
    }

</style>