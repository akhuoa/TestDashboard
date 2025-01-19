<template>              
<slot :widgetName="widgetName"></slot>
<div  v-bind="$attrs">

    <div class="fill">
        <img :src=imgPath>
    </div>
    <el-table 
    :data="TableData" 
    class="table-of-images tw-text-sm"
    highlight-current-row
    @current-change="handleCurrentChange"
    >
            <el-table-column prop="description" label="Description"  width="200" show-overflow-tooltip/>
            <el-table-column prop="sex" label="Sex"/>
            <el-table-column prop="age" label="Age"/>
     </el-table>
    </div>

</template>
<script setup>
    import { ref, inject, nextTick, watch } from "vue";
    import { useOpenerStore } from "../stores/opener";
    import { TableObject} from "../devComponents/ImageSelector/ImageModel"
    import { Api } from "../services";
    import {useGlobalVarsStore} from "../stores/globalVars"
    const GlobalVars = useGlobalVarsStore();
    const emitter = inject('emitter');

    defineOptions({
        inheritAttrs: false
    })    
    
    const imgPath = ref(null);
    const ImageArray = ref(null);
    const TableData = ref();

    const widgetName = ref('MUSE Image Selector');


const currentRow = ref();

const handleCurrentChange = (val, index) => {
  currentRow.value = val;
  getBiolucidaLink(currentRow);
}

watch(() => GlobalVars.MBF_IMAGE_ARRAY, (newVal, oldVal) => {
    //convert to non-reactive object before passing it through the model. this avoids unexpected behavior
    const imageArray = JSON.parse(JSON.stringify(newVal));
    buildTableFromImages(imageArray);
})

//on update
const getBiolucidaLink = async (dataset)=>{
    const sparcId = dataset.value.sparcId;
    const packageId = dataset.value.id;
    GlobalVars.MBF_IMAGE_NAME = packageId;
    let share_link = "";
    let _response = {};
    try{
        await Api.biolucida.getShareLink(packageId,sparcId).then(response =>{
            _response = response;
        })
        if (_response.status === 200) {
            share_link= _response.data.share_link;
            GlobalVars.MBF_SHARE_LINK= share_link;
        }
    }catch(e){
        console.error("couldn't fetch images from dataset");
    }
}

    function buildTableFromImages(images){
        ImageArray.value = new TableObject(images);
        TableData.value = ImageArray.value.buildTableSPARC();
    }

</script>
<style scoped>
:deep(.el-table__row){
    cursor:pointer;
}
    .selector-body{
        
    }
</style>