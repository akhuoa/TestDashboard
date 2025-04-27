<template>
    <div class="content-header stick-to-top tw-flex tw-flex-row tw-items-center tw-justify-between tw-h-10 tw-p-1">                    
      <slot></slot>
    </div>
    <div class="metadata-imgV">

    </div>
    <div ref="instance" class="viewer-img">
        <img :src=shareLink> 
    </div>
</template>
<script setup>

    import { ref, defineEmits, watch} from 'vue';
    import {useGlobalVarsStore} from "../stores/globalVars"

    const props = defineProps({
        title:{
                type:String,
                required:true
            }, 
        listening:{
            tyep:Boolean
        }
    })
    
    const emit = defineEmits(['setTitle']);
    emit('setTitle','MUSE Image Viewer');

    const GlobalVars = useGlobalVarsStore();
    const shareLink = ref("");
    watch(() => GlobalVars.SELECTED_IMAGE, (newVal, oldVal) => {
        ///do something
    })

</script>
<style scoped lang="scss">

    .viewer-img{
        display: flex;
        height: 100%;
        img{
            max-width: 100%;
            max-height: 100%;
        }
    }
    .highlight{
        border: solid purple 2px; //light purple
    }
.metadata-imgV{
    text-align: left;
    margin-left:6px;
    margin:0;
        line-height: 1rem !important;
    p{
        margin:0 !important;
    }
}
</style>
