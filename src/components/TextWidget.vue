<template>
  <slot :widgetName="widgetName" :childIcons="childIcons"></slot>
<div class="text-widget-wrap" v-bind="$attrs">

      <!-- if user binds widget to global variable -->
    <div v-if="reactiveState">
      <h2>{{ textContentGV }}</h2>
    </div>
    <!-- if user is manually inputting value -->
    <div v-else v-click-out="saveInput" @keyup.enter="saveInput" class="tw-flex">
      <div v-show="editing">
          <el-input @focus="$event.target.select()" ref="textUserInput" v-model="textContent"></el-input>
      </div> 
      <div v-show="!editing" @click="editInput()" class="tw-w-full tw-h-full">
          <h2>{{ textContent }}</h2>
      </div>
      <!-- <el-icon v-show="!editing">
        <Edit @click="editInput()"/>
      </el-icon> -->
    </div>

  </div>
  <TextWidgetSettings  
      :show-dialog="settingsVisible"
      :reactive-source-value = "props.bindedKey"
      :manual-entry-value="textContent"
      :hide-header-value="props.hideHeader"
      @close-dialog="settingsVisible = false"
      @update-text-var="(x)=>updateTextVariable(x)"
      >
  </TextWidgetSettings>
</template>
<script setup>
  import { ref, shallowRef, watch, computed } from "vue";
  import { Edit } from "@element-plus/icons-vue";
  import TextWidgetSettings from "../devComponents/TextWidget/TextWidgetSettings.vue";
  import {useGlobalVarsStore} from "../stores/globalVars.ts"
import { off } from "process";
  const globalVars = useGlobalVarsStore();

  defineOptions({
      inheritAttrs: false
  })    
  const props = defineProps({
    displayText:String,
    bindedKey:String,
    widgetID:String,
    hideHeader:Boolean
  })

  //String that user sees
  const textContent = ref(null);
  watch(() => props.displayText, (newVal) => {
      textContent.value = newVal;
    }, { immediate: true });
  const textContentGV = computed(() => {
    const optionMatch = globalVars.optionsData.find(item => item.name === props.bindedKey);
    return optionMatch?.value ?? "—"; 
  })
  //reactive state is the user assigning the value to a global variable
  const reactiveState = ref(props.bindedKey?true:false);

/*
Item Wiget Assignments - slot dependant
*/
//might need to be depricated - interfering with other ways to set the widget title/name
  const widgetName = ref('Text Widget')
  //add icon to header
  const childIcons=shallowRef([{"comp":Edit,"event":openSettings,"tooltip":"open Text settings"}])

/*
Feature: Click To Manually Edit Text - outside of settings
*/
  const editing = ref(false);
  const textUserInput = ref(null);

  function editInput(){
        editing.value=true;
        textUserInput.value ? textUserInput.value.focus(): "";
  }
  function saveInput(){
        editing.value=false;
  }

/*
SETTINGS
*/
  const settingsVisible = ref(false)
  function openSettings(){
    settingsVisible.value=true
  }

  // called when settings is updated
  function updateTextVariable({manualEdit,reactiveSource, hideHeader}){
    const dashItem = globalVars.getDashItem(props.widgetID);
    dashItem.hideHeader = hideHeader;
    if(manualEdit){
      reactiveState.value = false;
      dashItem.Props.displayText = manualEdit;
      dashItem.componentName = manualEdit;
      dashItem.Props.bindedKey = null;
    }else if(reactiveSource){
      reactiveState.value = true;
      dashItem.Props.displayText =null;
      dashItem.componentName = camelCaseToTitle(reactiveSource);
      dashItem.Props.bindedKey = reactiveSource;
    }

  }
  /*
  HELPER FUNCTIONS
  */
  function camelCaseToTitle(str) {
    if(!str){return;}
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before uppercase letters
        .replace(/^./, match => match.toUpperCase()); // Capitalize first letter
}

</script>
<style scoped>
  .text-widget-wrap{
      margin:auto;
  }
</style>