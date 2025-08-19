<template>              
<slot :widgetName="widgetName"></slot>
<div  v-bind="$attrs">
    <div v-if="isLoading"
    class="loader-wrap" >
        <half-circle-spinner
        :animation-duration="1000"
        :size="60"
        color="#8300BF"
    />
     </div>
    <el-table 
    v-else
    ref="tableInstance"
    :data="TableData" 
    class="table-of-images tw-text-sm"
    highlight-current-row
    @current-change="handleCurrentChange"
    > 
        <el-table-column prop="description" label="Description"  width="200" show-overflow-tooltip/>
        <el-table-column prop="size" label="size" show-overflow-tooltip/>
        <el-table-column prop="age" label="Age"/>
     </el-table>
    </div>

</template>
<script setup>
    import { ref, computed, watch, onMounted } from "vue";
    import {useGlobalVarsStore} from "../stores/globalVars"
    import { useLocationStore } from "../stores/locationSelect";
    import { nextTick } from "process";
    import { HalfCircleSpinner } from 'epic-spinners'
    const GlobalVars = useGlobalVarsStore();
    const LocationStore = useLocationStore();

    defineOptions({
        inheritAttrs: false
    })    
    
    const tableInstance = ref(null)
    const isLoading = computed(() => LocationStore.IsLoading);

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
            loc:img.secondLocation,
            age:img.ageRange,
            id:img.packageId,
            sparcId:img.sparcID,
            size:img.size
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
.loader-wrap {
  display: grid;
  place-items: center;
  min-height: 200px;
}
</style>