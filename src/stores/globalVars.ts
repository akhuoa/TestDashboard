import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { SparcImageObject } from '../devComponents/ImageSelector/ImageModel';

export const useGlobalVarsStore = defineStore('globalVars', () => {
  //global objects
  const componentList = ref([""]);
  const navigatorType = ref("LocationNav");//default 
  const DATASET_ID = ref("");
  const optionsData = ref([])
  const DASHBOARD_ITEMS = ref([]);
 
  //component objects
  const DASH_IMAGE_ARRAY = ref([]);
  const FLATMAP_LOCATION = ref("");
  const MBF_IMAGE_NAME = ref("");

  //filtered metadata
  const SUBJECT_SEX = ref("");
  const SUBJECT_AGE = ref(null);
  const SELECTED_IMAGE = ref(null);

  const selectibleWidgets=["BiolucidaViewer"];
  const mbfViewerCount = ref(0);

  //GETTERS
  const getDashItem =(widgetId:string)=>{
    return DASHBOARD_ITEMS.value.find(item => item.id===widgetId);
  }
  //SETTERS
  const addOptionsDataItems = (name:string,value:any)=>{
      optionsData.value.push({name,value})
  }
  const clearOptionsDataItems = ()=>{
    optionsData.value = [];
  }
  const setImageArray = (newArray: SparcImageObject[]) => {
    if (!Array.isArray(newArray)) {
      console.error("setImageArray expects an array.");
      return;
    }
    DASH_IMAGE_ARRAY.value = [...newArray]; 
  };
  const setSelectedImage = (selectedImage: SparcImageObject | null) => {
    if (!selectedImage) {
      console.warn("No valid image selected.");
      return;
    }
    SELECTED_IMAGE.value = selectedImage;
    MBF_IMAGE_NAME.value = selectedImage.packageId || "";
  };
  
  const setBiolucidaPath = (path: string) => {
    if (SELECTED_IMAGE.value) {
      SELECTED_IMAGE.value = { ...SELECTED_IMAGE.value, biolucidaPath: path };
    } else {
      console.warn("No image selected. Cannot set Biolucida path.");
    }
  };
  

  return { 
    DASHBOARD_ITEMS,
    componentList, 
    navigatorType, 
    DASH_IMAGE_ARRAY, 
    DATASET_ID, 
    FLATMAP_LOCATION,
    MBF_IMAGE_NAME,
    selectibleWidgets,
    mbfViewerCount,
    SUBJECT_AGE,
    SUBJECT_SEX,
    SELECTED_IMAGE,
    optionsData,
    getDashItem,
    setBiolucidaPath,
    setImageArray,
    setSelectedImage,
    addOptionsDataItems,
    clearOptionsDataItems
 }
})
