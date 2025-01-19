<template>
    <slot :widgetName="widgetName"></slot>
    <button v-if="debug" @click="debugCall">test selection</button>
    <div v-bind="$attrs" class="flatmap-viewer tw-p-0">
        <div class="tw-text-left tw-pl-1 flatmap-text" >
            <sparc-tooltip placement="top-left" content="select location on flatmap to filter the image selector">
                            <template #item>
                                <el-icon color="#8300BF"><InfoFilled /></el-icon>
                            </template>
                        </sparc-tooltip>
                        <p><b>Current Location: </b>{{ locationLabel }}</p>
        </div>

        <FlatmapVuer ref="flatmapRef" class="tw-px-2 tw-py-2" :disableUI="disableFlatmapUI" entry="UBERON:0001759" v-on:resource-selected="FlatmapSelected"  v-on:ready="FlatmapReady"/>

    </div>

</template>
<script setup>
  import { ref, inject, nextTick} from "vue";
  import {FlatmapVuer, MultiFlatmapVuer} from '@abi-software/flatmapvuer';
  import { useGlobalVarsStore } from '../stores/globalVars'
  import { useLocationStore} from "../stores/locationSelect";
  import "@abi-software/flatmapvuer/dist/style.css";
  FlatmapVuer.props.flatmapAPI.default="https://mapcore-demo.org/curation/flatmap/";

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

function FlatmapSelected(data){
    if (data.eventType === 'click') {
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
            flatmapRefMap.clearMarkers(); // to clear existing markers
            flatmapRefMap.addMarker(models, {
                location: location
            });
        }
    }
}
//this function is my temp work around to not having the map return anything useful
function addBufferToMinMax(id){
    return{
            min:id-.1,
            max:id+.1
        }
}

</script>
<style scoped lang="scss">
@import './node_modules/sparc-design-system-components-2/src/assets/_variables.scss';
    .flatmap-viewer{
        display: flex;
        flex-direction: column;

        .flatmap-text{
            display:flex;
            height: 50px;
            font-size:20px;
            line-height: 20px;
            margin: 4px;
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
            color: $mediumGrey;
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