import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { SparcImageObject } from '../devComponents/ImageSelector/ImageModel';

export const useGlobalVarsStore = defineStore('globalVars', () => {
  //global objects
  const componentList = ref([""]);
  // const navigatorType = ref("LocationNav");//default 
  const DATASET_ID = ref("");
  const optionsData = ref([])
  const DASHBOARD_ITEMS = ref([]);
 
  //component objects
    //ImageSelector.vue
  const DASH_IMAGE_ARRAY = ref([]);
    //FlatmapViewer.vue
  const FLATMAP_LOCATION = ref("");
    //FilterWidget.vue
  const MBF_IMAGE_NAME = ref("");

  //filtered metadata
  const SUBJECT_SEX = ref("");
  const SUBJECT_AGE = ref(null);
  const CURRENT_ROW = ref({})
    //BiolucidaViewer.vue
  const SELECTED_IMAGE = ref(null);

  //remove after adding lock functionality
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
  const setSelectedImage = (selectedImage: SparcImageObject | null, row:Object | null) => {
    if (!selectedImage) {
      console.warn("No valid image selected.");
      return;
    }
    if(row){CURRENT_ROW.value = row}
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
  const saveToLocalStorage = ()=>{
    const data = {
     // DASHBOARD_ITEMS: DASHBOARD_ITEMS.value,
     // componentList: componentList.value,
      CURRENT_ROW: CURRENT_ROW.value,
      DASH_IMAGE_ARRAY: DASH_IMAGE_ARRAY.value,
      DATASET_ID: DATASET_ID.value,
      FLATMAP_LOCATION: FLATMAP_LOCATION.value,
      MBF_IMAGE_NAME: MBF_IMAGE_NAME.value,
      SUBJECT_AGE: SUBJECT_AGE.value,
      SUBJECT_SEX: SUBJECT_SEX.value,
      SELECTED_IMAGE: SELECTED_IMAGE.value,
      optionsData: optionsData.value,
      mbfViewerCount: mbfViewerCount.value
    };
  
    localStorage.setItem("dashboard-globalVarsStore", JSON.stringify(data));
  }
  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem("dashboard-globalVarsStore");
    if (!stored) return;
  
    try {
      const data = JSON.parse(stored);
  
      //if ('DASHBOARD_ITEMS' in data) DASHBOARD_ITEMS.value = data.DASHBOARD_ITEMS;
      //if ('componentList' in data) componentList.value = data.componentList;
      if ('CURRENT_ROW' in data) CURRENT_ROW.value = data.CURRENT_ROW;
      if ('DASH_IMAGE_ARRAY' in data) DASH_IMAGE_ARRAY.value = data.DASH_IMAGE_ARRAY;
      if ('DATASET_ID' in data) DATASET_ID.value = data.DATASET_ID;
      if ('FLATMAP_LOCATION' in data) FLATMAP_LOCATION.value = data.FLATMAP_LOCATION;
      if ('MBF_IMAGE_NAME' in data) MBF_IMAGE_NAME.value = data.MBF_IMAGE_NAME;
      if ('SUBJECT_AGE' in data) SUBJECT_AGE.value = data.SUBJECT_AGE;
      if ('SUBJECT_SEX' in data) SUBJECT_SEX.value = data.SUBJECT_SEX;
      if ('SELECTED_IMAGE' in data) SELECTED_IMAGE.value = data.SELECTED_IMAGE;
      if ('optionsData' in data) optionsData.value = data.optionsData;
      if ('mbfViewerCount' in data) mbfViewerCount.value = data.mbfViewerCount;
    } catch (error) {
      console.error("Failed to parse globalVarsStore from localStorage:", error);
    }
  };
  

  return { 
    DASHBOARD_ITEMS,
    componentList, 
    DASH_IMAGE_ARRAY, 
    CURRENT_ROW,
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
    clearOptionsDataItems,
    saveToLocalStorage,
    loadFromLocalStorage
 }
})
