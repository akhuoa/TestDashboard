<template>
  <!-- Dashboard Header - with and without Filter -->
  <div class="dashboard-app">
    <div v-if="!hideHeader" class="dash-header tw-max-h-screen tw-flex tw-flex-col">
      <span class="tw-float-left tw-m-1 button">
        <el-button class="edit-button"
        @click="handleEditGrid()">
        {{ editGridButton }}
      </el-button>
      </span>
      <FilterWidget></FilterWidget>
    </div>
    <div v-else class="tw-h-10 dash-header">x
      <span class="tw-float-left tw-m-1">
        <el-button class="edit-button"
        @click="handleEditGrid()">
        {{ editGridButton }}
        </el-button>
      </span>
    </div>
<!-- Add New Widget Drop Down -->
    <el-col v-if="!staticMode">
      <div class="tw-m-4 tw-w-40">
        <el-select
        :value="NewComponent.Name"
        placeholder="Add New Widget">
          <el-option
            v-for="item in ComponentListOptions"
            :key="item"
            :label="item"
            :value="item"
            @click="addNewWidget(item)">
          </el-option>
        </el-select>
    </div>
  </el-col>
  <!-- Grid Stack JS -->
    <div  ref="root" class="grid-stack tw-h-screen">
      <div v-for="(w) in DashboardItems" class="grid-stack-item"
        :ref="el => widgetRefs[w.id] = el"
        :gs-x="w.x"
        :gs-y="w.y"
        :gs-w="w.w"
        :gs-h="w.h"
        :gs-id="w.id"
        :id="w.id"
        :key="w.id"
        :props ="w.Props"
        :gs-locked="w.Props?.locked"
        :gs-no-move="w.Props?.locked"
        :gs-no-resize="w.Props?.locked">
          <ItemWidget
          :widgetID="w.id"
          @remove-widget="removeWidget(w.id)"
          @toggle-lock="toggleWidgetLock"
          :static-mode="staticMode"
          :componentTag="w.component"
          :componentProperties="w.Props"
          :componentName="w.componentName"
          :hideWidgetsHeader="w.hideHeader"
          :is-locked="w.Props?.locked">
          </ItemWidget>
      </div>
    </div>

  </div>
</template>

<script setup>

import { ref, onBeforeMount, onMounted, nextTick, watch, reactive} from 'vue';
import { GridStack } from 'gridstack';
import FilterWidget from "../FilterWidget/FilterWidget.vue"
import ItemWidget from './ItemWidget.vue'
import { useGlobalVarsStore }from '../../stores/globalVars.ts';
import {Dataset} from '../../assets/Model';
import { storeToRefs } from 'pinia';
import "../../assets/theme.scss"
import "gridstack/dist/gridstack.min.css";
import "gridstack/dist/gridstack-extra.min.css";

const props = defineProps({
    dBItems:{
            type:Array,
            required:true
    },
    hideHeader:Boolean,
    options:{
        type:Object,
        required:false
    }
  })

const debug = false;
const _globalVars = useGlobalVarsStore();
let _DatasetImgs = ref({});
let editGridButton = ref("Edit Grid")

let Grid = null;
const root = ref(null);

const { DASHBOARD_ITEMS: DashboardItems } = storeToRefs(_globalVars);

let staticMode = ref(true);
let ComponentListOptions = _globalVars.componentList;
let NewComponent = {};
let NextId = props.dBItems.length+1;

onBeforeMount(() => {
    const savedDash = getItemsFromLS()
    _globalVars.setOptionServices(props.options.services)
    _globalVars.DASHBOARD_ITEMS= savedDash.length>0? savedDash: props.dBItems;
    _globalVars.loadFromLocalStorage();
  });
  onMounted(() => {
    initGridStack();
    addOptionsToGlobalVars();

  });


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
    _globalVars.gridInstance = Grid;
}

//Add Data to Global Vars for reactivity and Global Scoping -----------------------------
function addOptionsToGlobalVars(){
  if(props.options?.globalData){
    _globalVars.clearOptionsDataItems();
      for(const x in props.options.globalData){
        _globalVars.addOptionsDataItems(x,props.options.globalData[x])
      }
  }
}


//All additional Functions - - - - - - - - -- - - - - --  -- - -- - - - - - - -  --
watch(()=> staticMode.value, (value) => {
  Grid.setStatic(value);
  editGridButton.value = !value?"Save Grid":"Edit Grid";
})

function addNewWidget(name) {
  // adding new widget from dropdown
    if(name){
      NewComponent.Name = name;
    }
    const node = {id:NewComponent.Name+"-"+NextId,w:2,h:6,autoPosition:true, component: NewComponent.Name, componentName:NewComponent.Name, Props:{}};

    NextId++;
    //add component to items array first. this will update the dom
    DashboardItems.value.push(node);
    nextTick(()=>{
      //after dom updates, add your widget to the grid with makewidget. don't use addwidget
      Grid.makeWidget(node.id);
    });
}

function removeWidget(widget) {
    var index = DashboardItems.value.findIndex(w => w.id == widget);
    DashboardItems.value.splice(index, 1);
    const selector = `#${widget}`;
    Grid.removeWidget(selector, false);
  }

const widgetRefs = reactive({});
function toggleWidgetLock({id,isLocked}){
  const el = widgetRefs[id];
  if (el && Grid) {
    Grid.update(el, {
      locked:!isLocked,
      noMove: !isLocked,
      noResize: !isLocked
    });
  }
  _globalVars.toggleWidgetLock(id);
}
function handleEditGrid(){
  staticMode.value=!staticMode.value;
  if(staticMode.value){
    saveDashboard()
    _globalVars.saveToLocalStorage()
  }
}
function saveDashboard() {
  const gridItems = Grid.save();
  const merged = gridItems.map(fromGrid => {
    const dashItems = DashboardItems.value.find(DI => DI.id === fromGrid.id) || {};
    const overrides = (({ x, y, h, w }) => ({ x, y, h, w }))(fromGrid);
    return { ...dashItems, ...overrides };
  });
  window.localStorage.setItem("DashboardItems", JSON.stringify(merged));
}

function getItemsFromLS(){
    let dashItems = [];

    if(isValidJSON(window.localStorage.getItem("DashboardItems"))){
      dashItems = JSON.parse(window.localStorage.getItem("DashboardItems"));
    }
    return dashItems;
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

<style scoped lang="scss">
@import '../../assets/vars.scss';
.el-dialog__title {
  color: white;
}

.grid-stack {
 //background
}
.grid-stack-item {

  text-align: center;
  line-height: 35px;
  .grid-stack-item-content{
    overflow: hidden;
    // box-shadow: $dropShadow;
    border:solid $textLight 1px;
    border-radius: 0.2rem;
  }
}
.dashboard-app{
  font-family: Roboto, sans-serif;
  font-size: 14px;
  line-height: 17px;
  background: $background;
  color: $textDark;


  /* Force Inheritance */
  .edit-button {
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary-dark-2);
    color: white;

    &:hover{
      color:var(--el-color-primary-dark-2);
      background-color: var(--el-color-primary-light-3);
     border-color: var(--el-color-primary-dark-2);
    }
  }

  // .el-button:hover {
  //   background-color: var(--el-color-primary-light-3);
  //   border-color: var(--el-color-primary-dark-2);
  // }
}
</style>
<style lang="scss">
.el-dialog.full-dialog-dashboard {
  width: 95%;
  height: 95%;
  margin: auto;
  margin-top: 2.5%;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  color: var(--textDark);
}

</style>