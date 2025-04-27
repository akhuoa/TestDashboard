<template>
  <el-dialog
    class="full-dialog-dashboard"
    v-model="dialogVisible"
    title="Text Widget Settings"
    :append-to-body="true"
  >
    <div class="widget-settings-container">

        <!-- Select Widget Value -->
        <div class="widget-setting">
          <h4>Select This Widget's Value </h4>
          <h5>Select From Variables</h5>
          <el-select v-model="reactiveSource" class="text-settings-height">
            <el-option
              :value="'manual edit'"
              :key="'none'"
              label="None"

            />
            <el-option 
            v-for="ops in widgetSelectOptions" 
            :value="ops.name" 
            :key="ops.name" 
            :label="ops.name">
            </el-option>
          </el-select>
          <h5>Manual Entry</h5>
          <el-input v-model="manualTextEntry" class="text-settings-height"></el-input>
         <el-checkbox v-model="hideHeader" label="Hide Header"></el-checkbox>
        </div>



              <!-- <div class="widget-setting">
          <h4>Assign This Widget's Header</h4>
          <el-input v-model="widgetHeader" :disabled="hideHeader" placeholder="default is value name"/>
        </div>

      <div class="widget-hide-header">
        <label>Hide Header</label>
        <el-checkbox v-model="hideHeader" :value="hideHeader" />
      </div> -->
      
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="dialog-footer">
        <el-button class="secondary" @click="dialogVisible = false">Cancel</el-button>
        <el-button @click="updateTextVariable()">Save</el-button>
      </div>
    </template>

  </el-dialog>
</template>

    <script setup>
    
    import { ref, watch, computed} from 'vue'
    import { storeToRefs } from 'pinia';
    import {useGlobalVarsStore} from "../../stores/globalVars.ts"
    const globalVars = useGlobalVarsStore();

    const emit = defineEmits(['close-dialog','update-text-var']);
    const props = defineProps({
    showDialog: {
      type: Boolean,
      default: false,
    },
    reactiveSourceValue: {
      type: String,
      default: "",
    },
    manualEntryValue:{
      type:String,
      default:""
    },
    hideHeaderValue:{
      type:Boolean,
      default:false
    }

    })

    //handle close dialog emit
    const dialogVisible = computed({
      get: () => props.showDialog,
      set: (value) => {
        if (!value) emit("close-dialog");
      },
    });

    const reactiveSource = ref(props.reactiveSourceValue);
    const hideHeader = ref(props.hideHeaderValue);
    const manualTextEntry = ref(props.manualEntryValue);
    watch(() => props.manualEntryValue, (newVal) => {
      manualTextEntry.value = newVal;
    }, { immediate: true });


    //Gather select options for user based on available global vars. 
    const { optionsData: widgetSelectOptions } = storeToRefs(globalVars);

    function updateTextVariable(){
      let manualEditValue = manualTextEntry.value;
      if(!manualEditValue || manualEditValue=="manual edit"){
        manualEditValue = null;
      }
      emit("update-text-var",{"reactiveSource":reactiveSource.value, "manualEdit":manualEditValue, "hideHeader":hideHeader.value});
      dialogVisible.value = false;
    }

    </script>
    <style scoped lang="scss">
@import '../../assets/vars.scss';
.el-dialog__header{
  color:white;
}
.full-dialog-dashboard {
  width: 95%;
  height: 95%;
  margin: auto;
  margin-top: 2.5%;
}

.widget-settings-container {
  display: flex;
  flex-direction: column;
  gap: 16px; 
  font-family: Roboto, sans-serif;
  font-size: 14px;
  color: var(--textDark);
}

/* Row for Select & Title Fields */
.widget-settings-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

/* Styling for Each Setting */
.widget-setting {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .el-select{
    height: 42px;
  }
}

.widget-setting select,
.widget-setting input {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--el-color-primary-dark-2);
  border-radius: 4px;
}

/* Hide Header Section */
.widget-hide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  width:25%;
}

/* Button Styles */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.el-button {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary-dark-2);
  color: white;
}

.el-button:hover {
  background-color: var(--el-color-primary-light-3);
  border-color: var(--el-color-primary-dark-2);
}
.text-settings-height .el-input {
  height: 42px; 
}
.text-settings-height .el-input__inner {
  height: 42px;
  line-height: 42px;
}

    </style>