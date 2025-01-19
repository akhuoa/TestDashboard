import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalVarsStore = defineStore('globalVars', () => {
  //global objects
  const componentList = ref([""]);
  const navigatorType = ref("LocationNav");//default 
  const DATASET_ID = ref("");
 
  //component objects
  const MBF_IMAGE_ARRAY = ref([]);
  const MBF_SHARE_LINK = ref("");
  const FLATMAP_LOCATION = ref("");
  const MBF_IMAGE_NAME = ref("");

  return { 
    componentList, 
    navigatorType, 
    MBF_IMAGE_ARRAY, 
    DATASET_ID, 
    MBF_SHARE_LINK,
    FLATMAP_LOCATION,
    MBF_IMAGE_NAME
 }
})
