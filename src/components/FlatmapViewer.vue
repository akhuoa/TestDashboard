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
        <div>
            <label>
                <input type="checkbox" @change="toggleVisibility" />
                Show only the vagus nerve
            </label>
        </div>

        <FlatmapVuer
            ref="flatmapRef"
            :key="selectedFlatmapUUID"
            :uuid="selectedFlatmapUUID"
            class="tw-px-2 tw-py-2"
            :disableUI="disableFlatmapUI"
            entry="UBERON:0001759"
            v-on:resource-selected="FlatmapSelected"
            v-on:ready="FlatmapReady"
        />

    </div>

</template>
<script setup>
  import { ref, computed, nextTick} from "vue";
  import {FlatmapVuer, MultiFlatmapVuer} from '@abi-software/flatmapvuer';
  import { useGlobalVarsStore } from '../stores/globalVars'
  import { ElTooltip } from "element-plus";
  import { InfoFilled } from "@element-plus/icons-vue";

defineOptions({
        inheritAttrs: false
    })
  const props = defineProps({
    listening:{
            type:Boolean
    },
    flatmapAPI:{
            type:String,
    },
    flatmapUUID:{
            type:String,
    }
  })

  let flatmapAPI = props.flatmapAPI || 'https://mapcore-demo.org/current/flatmap/v3/';
  let flatmapUUID = props.flatmapUUID || '588d9ef2-5d5a-5e04-b6c4-73c5310fb708';

  // if there are url queries for flatmap server or uuid, use them for testing
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('flatmap-server')) {
      flatmapAPI = urlParams.get('flatmap-server');
  }
  if (urlParams.has('flatmap-uuid')) {
      flatmapUUID = urlParams.get('flatmap-uuid');
  }

  FlatmapVuer.props.flatmapAPI.default = flatmapAPI;

  const debug = false;
  const GlobalVars = useGlobalVarsStore();
  const disableFlatmapUI = true;
  let FlatmapReady = false;
  const flatmapLocation = computed(()=>GlobalVars.FLATMAP_LOCATION)

  const widgetName = ref('Flatmap Selector');
  const flatmapRef = ref('flatmapRef');

let locationId = "";
const locationLabel =  computed(()=>flatmapLocation.value||"None Selected");

const selectedFlatmapUUID = computed(() => {
    return GlobalVars.SELECTED_SUBJECTS.length > 0 ? GlobalVars.SELECTED_SUBJECTS[0].flatmapUUID : flatmapUUID;
});

// Only these two values of the `models` parameter will give a location that makes sense for a QDB query.
const validModels = [
    'http://uri.interlex.org/base/ilx_0789705', // Right vagus nerve
    'http://uri.interlex.org/base/ilx_0785628' // Left vagus nerve
];

function toggleVisibility(e) {
    const onlyShowVagusNerve = e.target.checked;
    const vagusFilter = {
        "OR": [
            {
                "NOT": {
                    "tile-layer": "pathways"
                }
            },
            {
                "AND": [
                    {
                        "tile-layer": "pathways"
                    },
                    {
                        "models": validModels
                    }
                ]
            }
        ]
    };
    const payload = onlyShowVagusNerve ? vagusFilter : undefined;
    flatmapRef.value.setVisibilityFilter(payload);
}

function FlatmapSelected(_data){
    const [data1] = _data; // first item to check eventType
    if (data1.eventType === 'click') {
    const data = _data.find((item) => item.feature && validModels.includes(item.feature.models));
    resetLocation();
    clearMarkers();
    if (data) {
    showMarker(data);

    if(!data.feature.location || locationId===data.feature.location){return;}
    locationLabel.value = data.label;
    GlobalVars.FLATMAP_LOCATION = data.label ? data.label: "";
    locationId = data.feature.location;
    //const locationMinMax = addBufferToMinMax(locationId);
    //send to image selector
    //min max needs to be a global var to be stored so that other calls can use it. for example when sub selector is updated.
    GlobalVars.setMinMax({min:locationId-.1,max:locationId+.1})
    GlobalVars.saveToLocalStorage()
    }
    }
}
function debugCall(){
   // locationStore.getLocationFromMinMax(.1,.15);
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