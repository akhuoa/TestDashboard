<template>                  
    <el-row class="filter-wrapper">
        <div v-for="filterName in filterOrder" class="tw-flex-row tw-m-2">
            <span v-if="ActiveFilters.get(filterName)"><b class="color-primary">{{ filterName +": " }}</b><span class="color-secondary">{{ ActiveFilters.get(filterName) }}</span></span>
        </div>
    </el-row>
</template>
<script setup>
  import { ref, watch, computed} from "vue";
  import { useGlobalVarsStore } from '../../stores/globalVars'
import { Dataset } from "../../assets/Model";
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
const filterEntries = [
  { label: "Dataset",        value: DatasetID},
  { label: "Vagal Location", value: FlatmapLocation},
  { label: "Selected Image", value: MBFImageName},
];
const filterOrder = filterEntries.map(e => e.label);
const ActiveFilters = ref(new Map());

// Initialize Map
filterEntries.forEach(({ label, value:entry }) => {
    if(entry.value){
        ActiveFilters.value.set(label, entry);
    }
});


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
    }
</style>