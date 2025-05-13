<template>
    <div
    v-if="!hideHeader" 
    class="content-header dash-header-visible stick-to-top tw-flex tw-flex-row tw-items-center tw-justify-between tw-h-10">                    
      <div>
         <!-- click to edit Widget Header -->
        <div v-click-out="saveInput" @keyup.enter="saveInput" class="tw-flex">
          <div v-show="editing" class="editing-div">
              <el-input @focus="$event.target.select()" ref="textUserInput" v-model="headerText"></el-input>
          </div> 
          <div v-show="!editing" @click="editInput()" class="visible-div" >
              <div class="tw-m-4 tw-leading-none tw-pl-1 widget-name">{{ headerText }}</div>
          </div>
          <!-- <el-icon v-show="!editing">
            <Edit @click="editInput()"/>
          </el-icon> -->
        </div>
      </div>
      <div class="header-slot-icon">
        <slot></slot>
      </div>
    </div>
    <div v-else
      class="dash-header-hide content-header">
      <div class="header-slot-icon">
        <slot></slot>
      </div>

    </div>
</template>
<script setup>
import {ref, watch} from 'vue'
import {useGlobalVarsStore} from "../../stores/globalVars.ts"
const globalVars = useGlobalVarsStore();

const props = defineProps({      
    widgetName:{
        type:String,
        required:true
    },
    widgetID:{
      type:String,
      required:true
    },
    //refactor to make hideHeader populated by getDashItem
    hideHeader:Boolean
})
  const headerText = ref(null);
  watch(() => props.widgetName, (newVal) => {
      headerText.value = newVal;
    }, { immediate: true });

/*
Feature: Click To Manually Edit Text
*/
  const editing = ref(false);
  const textUserInput = ref(null);

  function editInput(){
        editing.value=true;
        textUserInput.value ? textUserInput.value.focus(): "";
  }
  function saveInput(){
        editing.value=false;
        const dashItem = globalVars.getDashItem(props.widgetID);
        dashItem.componentName = headerText;
  }
</script>
<style scoped lang="scss">
.content-header{
  .visible-div{
    min-width: 100px;
    height: 40px;
  }
  .editing-div{
    width:150px;
  }
}
.header-slot-icon{
    position: absolute;
    top: 5px;
    right: 5px;
  }
.dash-header-hide{

}
.dash-header-visible{
  min-height: 40px;
}
.stick-to-top{
position: sticky;
top: 0;
width: 100%;
}

</style>