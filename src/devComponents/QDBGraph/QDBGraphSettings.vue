<template>

  <el-dialog
      v-model="dialogVisible"
      title="QDB Graph Settings"
      width="90%"
      :append-to-body="true"
    >
      <div class="tw-p-1">
        <label>Select Your Visualization: </label>
        {{ selectedVisual }} 
        <div><el-button v-for="v in  visualizations" @click="changeVisualization(v)" 
          :class="{ 'secondary': v!=selectedVisual }" >{{ v }}</el-button></div>
      </div>
        <slot>
          <div v-if="selectedVisual=='Distribution'" class="tw-flex tw-m-2 distribution-settings">
              <div class="tw-font-bold tw-m-1">Distribution:</div>
              <el-input type="number" v-model.number="newGraphData.distValue" class=" tw-w-20 tw-h-8"></el-input>
              <el-select v-model="newGraphData.distPercentage" class="tw-w-20">
                <el-option :value="false" label="num" >num</el-option>
                <el-option :value="true" label="%">%</el-option>
              </el-select>
              <div class="tw-font-bold tw-m-1 tw-ps-3 auto-range">Auto Range X:</div>
              <el-switch v-model="newGraphData.autoXRange"></el-switch>
              <el-input v-model="newGraphData.rangeXMin" :disabled="newGraphData.autoXRange" placeholder="Min" class="tw-h-8 tw-w-20"></el-input>
              <el-input v-model="newGraphData.rangeXMax" :disabled="newGraphData.autoXRange" placeholder="Max" class="tw-h-8 tw-w-20"></el-input>
              <div class="tw-font-bold tw-m-1 tw-ps-3 auto-range">Auto Range Y:</div>
              <el-switch v-model="newGraphData.autoYRange" :disabled="true"></el-switch>
              <el-input v-model="newGraphData.rangeYMin" :disabled="newGraphData.autoYRange" placeholder="Min" class="tw-h-8 tw-w-20"></el-input>
              <el-input v-model="newGraphData.rangeYMax" :disabled="newGraphData.autoYRange" placeholder="Max" class="tw-h-8 tw-w-20"></el-input>
  
          </div>
          <div v-for="gm in gMList">
  
            <el-row class="tw-m-2 border-division">
              
                <div class="tw-font-bold tw-m-1">{{ gMList.indexOf(gm)+1+": " }} 
                </div>
  
                <div class="tw-p-1 tw-w-40 bd-select">
                  <el-select v-model="gm._metric" placeholder="Metric">
                    <el-option 
                      v-for="m in metricList" :key="m" :label="m" :value="m" @click="selectMetric(m, gm)">{{ m }}
                    </el-option>
                  </el-select>
                </div>
    
                <div class="tw-p-1 tw-w-40 bd-select">
                  <el-select v-model="gm._xAspect" placeholder="x-axis">
                    <el-option
                      v-for="a in gm._aspectList" :key="a" :label="a" :value="a" @click="changeAxis('_x',a,gm)">
                    </el-option>
                  </el-select>
                </div>
        
                <div class="tw-p-1 tw-w-40 bd-select" >
                  <el-select :disabled="selectedVisual!=='Scatter'" v-model="gm._yAspect" placeholder="y-axis">
                    <el-option
                      v-for="a in gm._aspectList" :key="a" :label="a" :value="a" @click="changeAxis('_y',a,gm)">
                    </el-option>
                  </el-select>
                </div>
  
              <div class="tw-flex tw-flex-col tw-w-50 bd-select">
                <div class="tw-p-1 demo-color-block">
                  <el-input v-model="gm.label" placeholder="Legend" class=" tw-h-8"></el-input>
                  <el-color-picker v-model="gm.backgroundColor" />
                </div>
              </div>
              <div class="tw-p-1 tw-w-5">
                  <el-button style="height: 20px;" v-if="gMList.indexOf(gm)>0" @click="removeMetric(gm)">-</el-button>
                </div>
            </el-row>
  
          </div>
        
          <el-button @click="addMetric()">+</el-button>
        </slot>
  
      <template #footer>
        <div class="dialog-footer">
          <el-button class="secondary" @click="dialogVisible = false">Cancel</el-button>
          <el-button @click="updateGraph()">
            Save
          </el-button>
        </div>
      </template>
    </el-dialog>
  </template>
  <script setup>
  
  import { ref, onMounted, watch, shallowRef, toRaw, computed } from 'vue'
  import { ElMessageBox } from 'element-plus'
  import {VisualizationMap, GraphSettingsObject} from "./GraphModel.js"
  import { Api } from "../../services";
  
  const emit = defineEmits(['close-dialog','update-chart']);
  
  const props = defineProps({      
      showDialog:{
        type: Boolean,
        default: false
      },
      options:{default:{}},
      settingsData:{default:{}},
  })
  //copy property data
  const newGraphData = ref(new GraphSettingsObject(props.settingsData));
  onMounted(()=>{
    getMetricList();
  })
  
  //close and open------------------------------------
  const dialogVisible=ref(false);
  watch(dialogVisible, (newVal) => {
    if(newVal==false){
        emit("close-dialog")}
    })
   watch(()=>props.showDialog, (newVal) => {
         dialogVisible.value=newVal
     });
  
  // on Save------------------------------------------------------
  function updateGraph(){
    emit('update-chart',toRaw(newGraphData.value))
    dialogVisible.value=false
  }
  
  //visualizations ---------------------------------------------
  const visualizations =  Array.from(VisualizationMap.keys());
  let selectedVisual = shallowRef(newGraphData.value.visualization);
  //const foo = newGraphData.value;
  function changeVisualization(graphName){
      newGraphData.value.clearAllMetrics();
      selectedVisual.value = graphName ;
      newGraphData.value.visualization = graphName;
  }
  //multi metric options gMList = global metric-----------------------------------------
  const gMList = shallowRef(newGraphData.value.datasets);
  watch(()=>newGraphData.value.datasets, (newVal) => {
         gMList.value = newGraphData.value.datasets;
     });
  function addMetric(){
      newGraphData.value.addMetric();
  }
  function removeMetric(metric){
    newGraphData.value.removeMetric(metric);
    // if(gMList.value.length>1){
    //   const index = gMList.value.indexOf(metric);
    //   gMList.value.slice(index,1);
    // }
  }
  //metric options within gMList------------------------------------------------------
  
  const metricList = ref([]);
  
  const getMetricList = async ()=>{
    let _metric_list = {};
      try{
          const response = await Api.qdb.getClasses()
          _metric_list = response;
          _metric_list = _metric_list.map(m=>m.label);
          _metric_list.push("random data");
          metricList.value = _metric_list;
          
      }catch(e){
          console.error("couldn't fetch classes/metrics from QDB");
          console.error(e.message)
      }
    }
    function selectMetric(selectedMetric, targetMetric){
      if(selectedMetric==="random data"){return;}
        const i = newGraphData.value.datasets.indexOf(targetMetric);
        const dataset = newGraphData.value.datasets[i];
        dataset._metric = selectedMetric;
        newGraphData.value.datasets[i].clearAllAspects();
        getAspectList(selectedMetric, dataset);
    }
  //aspects --------------------------------------------------------
  //const aspectList = ref([]);
  const getAspectList = async(metric, dataset)=>{
    let _aspect_list = {};
  
    try{
        const response = await Api.qdb.getAspectsFromMetric(metric)
        _aspect_list = response;
        dataset._aspectList = _aspect_list.map(a=>a.label);
    }catch(e){
        console.error("couldn't fetch aspects of "+metric+" from QDB",e);
    }
  }
  //change value of x or y axis
  function changeAxis(axis, aspect, metric){
      const metricIndex = newGraphData.value.datasets.indexOf(metric);
      newGraphData.value.datasets[metricIndex][axis] = aspect;
      getDataByAspect(axis,aspect,metricIndex);
  }
  
  
  //---------------------------------------------------------------
  const getDataByAspect = async(axis,aspect,metricIndex)=>{
      try{
        let _axisData = {};
        const metricName = newGraphData.value.datasets[metricIndex]._metric;
        const response = await Api.qdb.getDataByAspect(metricName,aspect)
        _axisData = response;
        if(_axisData && _axisData.length){
          newGraphData.value.addDataToMetric(axis,_axisData,metricIndex);
        }
      }
      catch(e){
        console.error("could not fetch data points from qdb",e);
      }
  }
  
  const handleClose = () => {
   // ElMessageBox.confirm('Hello World')
   alert("yo")
      .then(() => {
        done()
      })
      .catch(() => {
        // catch error
      })
  }
  
  </script>
  <style scoped lang="scss">
  .auto-range{
    width:30px;
  }
  .demo-color-block {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }
  .border-division{
    
    padding:.5rem; 
  }
  .border-division .bd-select {
    width:150px;
    height: 36px; 
  }
  .distribution-settings{
    height: 36px;
    div{
      width:100px;
      height: 32px;
    }
  }
  </style>