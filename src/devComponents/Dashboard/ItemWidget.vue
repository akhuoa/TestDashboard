<template>
            <div ref="instance" class="grid-stack-item-content" @click="selectWidget()">
                <component 
                v-slot="slotProps" 
                class="widget-body" 
                :class="{'widget-body-no-head':hideHeader}"
                :widgetID="widgetID"
                :is="componentTag" 
                :listening="highlight" 
                :hideHeader="hideHeader"
                v-bind="props.componentProperties">
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
                            <el-icon v-if="!staticMode"
                             class="item-widget-button"
                             @click="$emit('removeWidget')"
                             ><Close/></el-icon>
                            
                        </div>
                    </DashHeader>
                </component> 
            </div>
</template>
<script setup>
    import CloseIcon from '../../components/icons/CloseIcon.vue';
    import DownloadIcon from '../../components/icons/DownloadIcon.vue'
    import { Edit } from '@element-plus/icons-vue';
    import { ref, watch} from 'vue';
    import { useGlobalVarsStore } from '../../stores/globalVars';
    import DashHeader from "./DashHeader.vue";
    import { nextTick } from 'process';
    import { ElTooltip } from 'element-plus';
    import { Close } from "@element-plus/icons-vue";
    
    const emit = defineEmits(['removeWidget']);
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
            }
        })

     const hideHeader = ref(null);
     watch(()=> props.hideWidgetsHeader,(newVal)=>{
        hideHeader.value=newVal;
     },{immediate:true})
    
//-----------------------------------------------------------------------------
// hightlight functionslity
    let instance = ref(null);
    let highlight = ref(false)
    
    function selectWidget(){
        if(GlobalVars.selectibleWidgets.indexOf(props.widgetID.split("-")[0])>-1){
            highlight.value=!highlight.value;
            instance.value.classList.toggle("focus-from-Img-View");
        }
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

  .header-icon {
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
.focus-from-Img-View{
        border:solid purple 2px !important; //light  purple
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