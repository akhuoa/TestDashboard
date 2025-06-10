<template>              
<slot :widgetName="widgetName"></slot>
<div  v-bind="$attrs">

    <div class="fill">
        <img :src=imgPath>
    </div>
    <el-table 
    ref="tableInstance"
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
    import { ref, computed, watch, onMounted } from "vue";
    import {useGlobalVarsStore} from "../stores/globalVars"
import { nextTick } from "process";
    const GlobalVars = useGlobalVarsStore();

    defineOptions({
        inheritAttrs: false
    })    
    
    const tableInstance = ref(null)
    const imgPath = ref(null);
    const widgetName = ref('MUSE Image Selector');
    const filteredImages = computed(()=>GlobalVars.DASH_IMAGE_ARRAY)
    const TableData = ref(buildTableSPARC(filteredImages.value))
    const currentRow = computed(()=>GlobalVars.CURRENT_ROW);

    onMounted(()=>{
        nextTick(()=>{
            const tbc = TableData.value.find(x=>x.id==currentRow.value.id)
            tableInstance.value.setCurrentRow(tbc)
        })

    })


const handleCurrentChange = (row, index) => {
    if(!row){return}
    const selectedImage =  filteredImages.value.find(x => x.packageId === row.id)
    GlobalVars.setSelectedImage(selectedImage,row) 
    GlobalVars.saveToLocalStorage();
}

watch(filteredImages, 
    (newVal, oldVal) => {
        TableData.value = buildTableSPARC(newVal);
})

function buildTableSPARC(imageArray){
    if(!imageArray?.length){return []}
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