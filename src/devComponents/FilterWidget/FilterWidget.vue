<template>                  
    <el-row class="filter-wrapper">
        <div class="tw-flex tw-flex-row">
            <div v-for="filterName in filterOrder" class="tw-flex-row tw-ml-2">
                <span class="filter-name" v-if="ActiveFilters.get(filterName)"><b class="color-primary">{{ filterName +": " }}</b><span class="color-secondary">{{ ActiveFilters.get(filterName) }}</span></span>
            </div>
        </div>
        <div class="clear-filter-div">
            <el-tooltip placement="top-start">
                <template #content>Clear All Filters</template>
                <el-icon color="#FFFF" @click="clearAllFilters()"><CircleCloseFilled /></el-icon>
            </el-tooltip>
        </div>
    </el-row>
</template>
<script setup>
    import { ref, watch, computed} from "vue";
    import { useGlobalVarsStore } from '../../stores/globalVars'
    import { Dataset } from "../../assets/Model";
    import { CircleCloseFilled } from "@element-plus/icons-vue";
    import { ElTooltip } from "element-plus";
    const GlobalVars = useGlobalVarsStore();

    defineOptions({
        inheritAttrs: false
    })
    const props = defineProps({
        listening:{
            tyep:Boolean
        }
    })

    const DatasetID = computed(() => GlobalVars.DATASET_ID)
    const FlatmapLocation = computed(() => GlobalVars.FLATMAP_LOCATION) 
    const MBFImageName = computed(() => GlobalVars.MBF_IMAGE_NAME)
    const SelectedSubjects = computed(()=>GlobalVars.SELECTED_SUBJECTS.map((x)=>x.name).join(", "))
    const filterEntries = [
    { label: "Dataset",        value: DatasetID},
    { label: "Vagal Location", value: FlatmapLocation},
    { label: "Selected Image", value: MBFImageName},
    {label: "Subjects",value:SelectedSubjects}
    ];
    const filterOrder = filterEntries.map(e => e.label);
    const ActiveFilters = ref(new Map());

    // Initialize Map
    filterEntries.forEach(({ label, value:entry }) => {
        if(entry.value){
            ActiveFilters.value.set(label, entry);
        }
    });

    function clearAllFilters(){
        GlobalVars.clearAllFilters();
    }

    //watchers
    filterEntries.forEach(({ label, value }) => {
    watch(value, (newVal) => {
        ActiveFilters.value.set(label, newVal);
    });
    });



</script>
<style scoped lang="scss">
@import '../../assets/vars.scss';

    .color-secondary{
        color:grey;//light grey
    }
    .color-primary{
        color:white;
    }
    .filter-wrapper{
        background-color: $secondary;
        height: 33px;
        padding:8px;
        justify-content: space-between;
    }
    .filter-name{
        margin-left:0.5rem;
    }

    .clear-filter-div{
        width:33px;
        height: 33px;
        margin-left: 10px;
    }
</style>