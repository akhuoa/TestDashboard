<template>
            <div ref="instance" class="grid-stack-item-content" :class="{'locked-widget':isLocked}">
                <component 
                v-slot="slotProps" 
                class="widget-body" 
                :class="{'widget-body-no-head':hideHeader}"
                :widgetID="widgetID"
                :is="componentTag" 
                :hideHeader="hideHeader"
                v-bind="props.componentProperties"
                :style="{ pointerEvents: widgetLocked ? 'none' : 'auto' }"
                :isLocked="widgetLocked">
                    <DashHeader 
                    v-if="slotProps" 
                    :widgetName="props.componentName" 
                    :widgetID="widgetID"
                    :staticMode="staticMode"
                    :hideHeader="hideHeader">
                        <div
                        class="tw-flex">
                            <el-tooltip 
                            placement="bottom-start"
                            v-for="icon in slotProps.childIcons">
                                <template #content>{{ icon.tooltip }}</template>
                                    <component 
                                    class="tw-w-4 header-icon"  
                                    :is="icon.comp" 
                                    @click="icon.event">
                                </component>
                            </el-tooltip>
                            <el-icon
                                class="header-icon lock-toggle"
                                @click="toggleLockWidget()">
                                    <Lock v-if="widgetLocked"/>
                                    <Unlock v-else/>
                            </el-icon>
                            <el-icon 
                                v-if="!staticMode && !isLocked"
                                class="item-widget-button"
                                @click="$emit('removeWidget')"
                                ><Close/>
                            </el-icon>
                            
                        </div>
                    </DashHeader>
                </component> 
            </div>
</template>
<script setup>
    import DownloadIcon from '../../components/icons/DownloadIcon.vue'
    import { ref, watch, computed} from 'vue';
    import { useGlobalVarsStore } from '../../stores/globalVars';
    import DashHeader from "./DashHeader.vue";
    import { ElTooltip } from 'element-plus';
    import { Close, Lock, Unlock } from "@element-plus/icons-vue";
    
    const emit = defineEmits(['removeWidget',"toggle-lock"]);
    const GlobalVars = useGlobalVarsStore();
    const props = defineProps({      
            widgetID:{
                type:String,
                required:true
            },
            staticMode:{
                type:Boolean,
                required:true
            },
            componentTag:{
                required:true
            },
            componentProperties:{
                type:Object
            },
            componentName:{
                type:String
            },
            //refactor to make hideHeader populated by getDashItem
            hideWidgetsHeader:{
                type:Boolean
            },
            isLocked:{
                type:Boolean,
                default:false
            }
        })
    let instance = ref(null);
    
    const widgetLocked = ref(false)
    watch(() => props.isLocked, (newVal) => {
        widgetLocked.value = newVal;
    }, { immediate: true });    
    
    const hideHeader = ref(null);
    watch(()=> props.hideWidgetsHeader,(newVal)=>{
        hideHeader.value=newVal;
    },{immediate:true})
    
//-----------------------------------------------------------------------------
function toggleLockWidget() {
    emit('toggle-lock', {
        id: props.widgetID,
        isLocked:widgetLocked.value
    });
}



</script>
<style scoped lang="scss">
@import '../../assets/vars.scss';
:deep(.content-header){
    z-index: 3;
    width:100%;
    overflow: hidden;
    h3{
        margin:10px;
    }
    .item-widget-button{
        cursor: pointer;
        margin-right:3px;
        width:20px;
        height: 20px;
    }
    .close-button{
        cursor: pointer;
        margin-right:3px;
        width:20px;
        height: 20px;
    }
}
:deep(.widget-body){
  height: calc( 100% - 40px );
}
:deep(.widget-body-no-head){
    height: inherit;
    h2{
        margin: 0;
    }
}
.grid-stack-item-content {
    background-color: #ffffff;
    overflow:hidden;
    text-align: start;
    display: flex;
    flex-flow: column;
    transition: background 0.3s ease-in-out;
    &:hover {
    background: $backgroundBlocked; 
  }
  &.locked-widget{
    background-color: #f2f2f2;
    .lock-toggle {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
  }

  .header-icon {
    cursor: pointer;
    height: 18px;
    opacity: 0;
    transform: translateY(5px);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  }

  &:hover .header-icon {
    opacity: 1;
    transform: translateY(0);
  }
}
:deep(.fill) {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
    flex-shrink: 1;
    width:100%;
    }
}

.icon-wrapper{
    width:25px
}

// hover functionality
.parent-div {
  position: relative;
  display: inline-block; // Keeps it sized to content (optional)
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
  transition: background 0.3s ease-in-out;


}

</style>