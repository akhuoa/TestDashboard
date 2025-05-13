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
    import {useGlobalVarsStore} from "../stores/globalVars"
    const GlobalVars = useGlobalVarsStore();

    defineOptions({
        inheritAttrs: false
    })    
    
    const imgPath = ref(null);
    const TableData = ref();

    const widgetName = ref('MUSE Image Selector');


const currentRow = ref();

const handleCurrentChange = (val, index) => {
    currentRow.value = val;
    const selectedImage =  GlobalVars.DASH_IMAGE_ARRAY.find(x => x.packageId === val.id)
    GlobalVars.setSelectedImage(selectedImage) 
}

watch(() => GlobalVars.DASH_IMAGE_ARRAY, (newVal, oldVal) => {
    //convert to non-reactive object before passing it through the model. this avoids unexpected behavior
    //const imageArray = JSON.parse(JSON.stringify(newVal));
    TableData.value = buildTableSPARC(newVal);
})

function buildTableSPARC(imageArray){
        let _tempArr=[];
        imageArray.forEach((img)=>{
            let column = {
                description: img.description,
                sex: img.sex,
                age:img.ageRange,
                id:img.packageId,
                sparcId:img.sparcID
            }
            _tempArr.push(column);
        })
        return _tempArr;
    }
</script>
<style scoped>
:deep(.el-table__row){
    cursor:pointer;
}
    .selector-body{
        
    }
</style>