<template>
    <div class="dash-header tw-h-10">
     <span class="tw-float-left tw-m-1"><el-button @click="staticMode=!staticMode">{{ editGridButton }}</el-button></span>
     <FilterWidget></FilterWidget>
    </div>
    <el-col v-if="!staticMode">
      <el-row class="tw-m-12">
        <el-select :value="NewComponent.Name" placeholder="Add New Widget">
          <el-option
            v-for="item in ComponentListOptions" :key="item" :label="item" :value="item" @click="addNewWidget(item)">
          </el-option>
        </el-select>
        <el-button v-if="debug" type="default" @click="saveDashboard()" disabled >Save Dashboard</el-button>
      </el-row>
  </el-col> 
    <div  ref="root" class="grid-stack tw-h-screen">
      <div v-for="(w) in DashboardItems" class="grid-stack-item" 
      :gs-x="w.x" :gs-y="w.y" :gs-w="w.w" :gs-h="w.h" :gs-id="w.id" :id="w.id" :key="w.id">
            <ItemWidget :widgetID="w.id" @remove-widget="removeWidget(w.id)" :static-mode="staticMode" :componentTag="w.component" :componentProperties="w.Props">
            </ItemWidget>
      </div>
    </div>
</template>



<script setup>

import { ref, onBeforeMount, onMounted, nextTick, inject, onUpdated, watch} from 'vue';
import { GridStack } from 'gridstack';
import FilterWidget from "../devComponents/FilterWidget/FilterWidget.vue"
import ItemWidget from './ItemWidget.vue';
import { useGlobalVarsStore }from '../stores/globalVars.ts';
import {Dataset} from '../assets/Model';

import "gridstack/dist/gridstack.min.css";
import "gridstack/dist/gridstack-extra.min.css";

const debug = false;
const _emitter = inject('emitter');
const _globalVars = useGlobalVarsStore();
let _DatasetImgs = ref({});
let editGridButton = ref("Edit Grid")

let Grid = null;
const root = ref(null);

let NavItem = ref({});
let DashboardItems = ref([]);
let staticMode = ref(true);
getItemsFromLS();
let ComponentListOptions = _globalVars.componentList;
let NewComponent = {};
let NextId = DashboardItems.value.length;


const dBItems = debug ? [{ id: "TextWidget-1", x: 0, y: 0, h: 1, w:4, componentName:"Text",component:"TextWidget" }] : 
[{ id: "FlatmapViewer-1", x: 0, y: 0, h: 8, w:2, componentName:"Flatmap Viewer",component:"FlatmapViewer" },
    { id: "ImageSelector-2", x: 2, y: 0, h: 8, w:3, componentName:"Image Selector", component:"ImageSelector"},
    { id: "BiolucidaViewer-3", x: 5, y: 0,h: 11, w:7, componentName:"MBF Viewer", component:"BiolucidaViewer"},
    { id: "ODBGraph-1", x: 0, y: 8, h: 3, w:5, componentName:"Flatmap Viewer",component:"QDBGraph" }]


onBeforeMount(() => {
  DashboardItems.value = dBItems;
  });
  onMounted(() => {
    initGridStack();
  });
  onUpdated(() => {

})

//retrieve dataset as json ------------------------------- - - - - - - - --------- - -- - -- - - -
function retrieveDataset(){
  fetch('./dataByLocation.json')
    .then((response) => response.json())
    .then((json) => _DatasetImgs.value = Object.assign(new Dataset(json)),
     );
}

//add gridstack specific events here - - - - - - --  -- -- - - -- - --  -- - - -----  -  - - - - 
function initGridStack(){
    const options={
      float:true,
      column:12,
      cellHeight: "70px",
      minRow: 12,
      margin:5,
      alwaysShowResizeHandle:true,

      resizable: {
        handles: 'e,se,s,sw,w,n'
      }
    }
    Grid = GridStack.init(options);
    Grid.setStatic(staticMode.value)
}
//All additional Functions - - - - - - - - -- - - - - --  -- - -- - - - - - - -  --
watch(()=> staticMode.value, (value) => {
  Grid.setStatic(value);
  editGridButton.value = !value?"Save Grid":"Edit Grid";
})

function addNewWidget(name) {
  // if parameter name then newWidget comes from dropdown. else it comes from emmitter
    if(name){
      NewComponent.Name = name;
      NewComponent.Props = new Map();
    }
    const node = {id:NewComponent.Name+"-"+NextId,w:2,h:6,autoPosition:true, component: NewComponent.Name, componentName:NewComponent.Name, componentProperties:NewComponent.Props};
    
    // for(let [key,val] of NewComponent.Props){
    //   node.propName=key
    //   node.propVal = val;
    // }
    NextId++;
    //add component to items array first. this will update the dom
    DashboardItems.value.push(node);

    nextTick(()=>{
      //after dom updates, add your widget to the grid with makewidget. don't use addwidget
      Grid.makeWidget(node.id);
    });
}
_emitter.on('SparcDashboard-addNewWidget', (value) => { 
      NewComponent.value={}
      NewComponent.Props = new Map();
      NewComponent.Name = value[0];
      value[1].forEach((val)=>{
        NewComponent.Props.set(val.key,val.value);
      })
      
      addNewWidget()  
  })
  
function removeWidget(widget) {
    var index = DashboardItems.value.findIndex(w => w.id == widget);
    DashboardItems.value.splice(index, 1);
    const selector = `#${widget}`;
    Grid.removeWidget(selector, false);    
  }
function saveDashboard(){
  const gridItems = Grid.save();
  gridItems.forEach(item => {
    item.component = item.id.split("-")[0];
    item.componentName = item.component;
  });
  window.localStorage.setItem("DashboardItems",JSON.stringify(gridItems));
}
function getItemsFromLS(){
    let dashItems = [];
    let nav = {};
  
    if(isValidJSON(window.localStorage.getItem("DashboardItems"))){
      dashItems = JSON.parse(window.localStorage.getItem("DashboardItems"));
    }
    nav = dashItems.find(item => item.id === "SubjectNav");
    if(!nav){
      NavItem= {id:"SubjectNav",x:0,y:0,h:20,w:2, component:_globalVars.navigatorType, noMove:true, locked:true};
    }else{
      NavItem = nav;
    }
    let navIndex = dashItems.indexOf(nav);
    if(navIndex!==-1){
      dashItems.splice(navIndex,1);
    }
    DashboardItems.value = dashItems;
}
    
function isValidJSON(str) {
  if(!str){return false;}
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    
    return true;
}
</script>

<style  lang="scss">
@import './node_modules/sparc-design-system-components-2/src/assets/_variables.scss';

.dash-header {
  background-color: $darkBlue;
  color: white;
}
.grid-stack {
  background: $background;
}

.grid-stack-item {

  text-align: center;
  line-height: 35px;
  .grid-stack-item-content{
    overflow: hidden;
  }
}



</style>