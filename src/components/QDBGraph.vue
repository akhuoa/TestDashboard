
<template>
  <!-- slot for dynamic header -->
  <slot :widgetName="widgetName" :childIcons="childIcons">
  </slot>

    <div v-bind="$attrs"  class="tw-flex tw-flex-col tw-h-full">
      <component
      id="my-chart-id"
      :is="visualizationComponent"
      :options="chartOptions"
      :data="chartData">
    </component>
    </div>

      <GraphSettings    
      :show-dialog="settingsVisible"
      @close-dialog="settingsVisible = false"
      @update-chart="(x)=>updateChart(x)"
      :settingsData="graphSettingsObject"
      >
      </GraphSettings>
</template>
<script setup>

  import {ref, onMounted, shallowRef} from "vue";
  import { Bar, Scatter, Pie, Line  } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,PointElement, LineElement } from 'chart.js'
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement)
  import {GraphSettingsObject, VisualizationMap} from "../devComponents/QDBGraph/GraphModel.js"
  import GraphSettings from '../devComponents/QDBGraph/QDBGraphSettings.vue'
  import GraphIcon from "./icons/GraphIcon.vue";

  defineOptions({
  inheritAttrs: false
  })

  const widgetName = ref("QDB Graph");
  const settingsVisible=ref(false);

  function openSettings(){
    settingsVisible.value=true
  }

  //add icon to header
  const childIcons=shallowRef([{"comp":GraphIcon,"event":openSettings,"tooltip":"open graph settings"}])

  //retrieve saved settings if exist
  let graphSettingsObject = getSavedGraphSettings();
 // let visualization = ref(graphSettings.visualization);
  let visualizationComponent = shallowRef(VisualizationMap.get(graphSettingsObject.visualization));
  //graphSettingsObject.datasets?graphSettingsObject.datasets[0].data=[40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]:"";
  const chartData = ref(graphSettingsObject.returnSettingsData()); 
  const chartOptions = ref({
        responsive: true,
        maintainAspectRatio: false
      });

//called by Graph Settings component
function updateChart(data){
  //graphSettingsObject needs to be entirely new obj in order for chartData to update on the DOM
  graphSettingsObject = data.clone();
  chartData.value = graphSettingsObject.returnSettingsData();
  visualizationComponent.value=VisualizationMap.get(graphSettingsObject.visualization);
  
}

function getSavedGraphSettings(){
   //temporarily return with no settings
   let hasSavedSettings = false;
   if(hasSavedSettings){
    return new GraphSettingsObject();
   }else{
    return new GraphSettingsObject();
   }
   
}

</script>
<style scoped lang="scss">


</style>