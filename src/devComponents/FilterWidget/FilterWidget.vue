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
    const GlobalVars = useGlobalVarsStore();

    defineOptions({
        inheritAttrs: false
    })
  const props = defineProps({
    listening:{
            tyep:Boolean
    }
  })

const ActiveFilters = ref(new Map());

//watchers
watch(() => GlobalVars.DATASET_ID, (newVal, oldVal) => {
    const orderNum = 0;
    ActiveFilters.value.delete(filterOrder[orderNum])
    ActiveFilters.value.set(filterOrder[orderNum],newVal)
    })
watch(() => GlobalVars.FLATMAP_LOCATION, (newVal, oldVal) => {
    const orderNum = 1;
    ActiveFilters.value.delete(filterOrder[orderNum])
    ActiveFilters.value.set(filterOrder[orderNum],newVal)
})
watch(() => GlobalVars.MBF_IMAGE_NAME, (newVal, oldVal) => {
    const orderNum = 2;
    ActiveFilters.value.delete(filterOrder[orderNum])
    ActiveFilters.value.set(filterOrder[orderNum],newVal)
})

const filterOrder = ["Dataset", "Vagal Location", "Selected Image"]

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