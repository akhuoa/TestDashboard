import { ref, isReactive, isRef, markRaw, } from 'vue'
import { defineStore } from 'pinia'
import { SparcImageObject } from '../devComponents/ImageSelector/ImageModel';
import { useLocationStore} from "../stores/locationSelect";

export const useGlobalVarsStore = defineStore('globalVars', () => {

  const locationStore = useLocationStore();
  //global objects
  //gridstack.js instance
  const gridInstance = ref(null);
  const componentList = ref([""]);
  const DATASET_ID = ref("");
  const optionsData = ref([])
  const DASHBOARD_ITEMS = ref([]);
  const Services = ref({})
 
  //component objects
    //ImageSelector.vue
  const DASH_IMAGE_ARRAY = ref([]);
    //FlatmapViewer.vue
  const FLATMAP_LOCATION = ref("");
    //FilterWidget.vue
  const MBF_IMAGE_NAME = ref("");

  //filtered metadata

  const SELECTED_SUBJECTS = ref([])
  const MIN_MAX = ref<{min:string,max:string}>()
  const CURRENT_ROW = ref({})
    //BiolucidaViewer.vue
  const SELECTED_IMAGE = ref(null);


  //scaffold
  const SCAFFOLD_URL = ref("https://api.sparc.science//s3-resource/426/files/derivative/sub-M000/L/060-visualization/leftHumanVagus_metadata.json")
  //const SCAFFOLD_URL = ref("https://mapcore-bucket1.s3-us-west-2.amazonaws.com/others/29_Jan_2020/heartICN_metadata.json")

  const clearAllFilters = ()=>{
    DATASET_ID.value = "";
    DASH_IMAGE_ARRAY.value = [];
    FLATMAP_LOCATION.value = "";
    MBF_IMAGE_NAME.value = "";
    SELECTED_SUBJECTS.value = [];
    CURRENT_ROW.value = {};
    SELECTED_IMAGE.value = null;
    SCAFFOLD_URL.value = "";
    saveToLocalStorage()
  }

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
  const setMinMax = (minMax:{min:string,max:string})=>{
     MIN_MAX.value = minMax;
     locationStore.getLocationFromMinMax();
  }
  const setSelectedSubject = (subjectArray:string[])=>{
      SELECTED_SUBJECTS.value = subjectArray;
      locationStore.getLocationFromMinMax();
  }
    const setOptionServices = (services:any)=>{
      const sanitized =sanitizeServices(services);
      Services.value = sanitized;
    } 
    const getServices = ()=>{
      return Services.value;
    }
  
    function sanitizeServices(input: any) {
      const out: Record<string, any> = {};
      if (!input || typeof input !== 'object') return out;
  
      for (const [k, v] of Object.entries(input)) {
        // mark class/SDK instances as raw; copy plain data
        if (v && typeof v === 'object' && !(isRef(v) || isReactive(v))) {
          // heuristic: if it has methods / not a POJO, store raw
          const isPlain = Object.getPrototypeOf(v) === Object.prototype;
          out[k] = isPlain ? { ...v } : markRaw(v);
        } else {
          out[k] = v; // primitives, functions, etc.
        }
      }
      return out;
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
  
  // const setBiolucidaPath = (path: string) => {
  //   if (SELECTED_IMAGE.value) {
  //     SELECTED_IMAGE.value = { ...SELECTED_IMAGE.value, biolucidaPath: path };
  //   } else {
  //     console.warn("No image selected. Cannot set Biolucida path.");
  //   }
  // };

  const toggleWidgetLock = (widgetId: string) => {
    const widget = DASHBOARD_ITEMS.value.find(w => w.id === widgetId);
    if (widget) {
      widget.Props = widget.Props || {};
      widget.Props.locked = !widget.Props.locked;
    }
  }

  const saveToLocalStorage = ()=>{
    const data = {
     // DASHBOARD_ITEMS: DASHBOARD_ITEMS.value,
      MIN_MAX:MIN_MAX.value,
      SELECTED_SUBJECTS: SELECTED_SUBJECTS.value,
      CURRENT_ROW: CURRENT_ROW.value,
      DASH_IMAGE_ARRAY: DASH_IMAGE_ARRAY.value,
      DATASET_ID: DATASET_ID.value,
      FLATMAP_LOCATION: FLATMAP_LOCATION.value,
      MBF_IMAGE_NAME: MBF_IMAGE_NAME.value,
      SELECTED_IMAGE: SELECTED_IMAGE.value,
      optionsData: optionsData.value
    };
  
    localStorage.setItem("dashboard-globalVarsStore", JSON.stringify(data));
  }
  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem("dashboard-globalVarsStore");
    if (!stored) return;
  
    try {
      const data = JSON.parse(stored);
      //if ('DASHBOARD_ITEMS' in data) DASHBOARD_ITEMS.value = data.DASHBOARD_ITEMS;
      if('MIN_MAX' in data) MIN_MAX.value = data.MIN_MAX;
      if('SELECTED_SUBJECTS' in data) SELECTED_SUBJECTS.value = data.SELECTED_SUBJECTS;
      if ('CURRENT_ROW' in data) CURRENT_ROW.value = data.CURRENT_ROW;
      if ('DASH_IMAGE_ARRAY' in data) DASH_IMAGE_ARRAY.value = data.DASH_IMAGE_ARRAY;
      if ('DATASET_ID' in data) DATASET_ID.value = data.DATASET_ID;
      if ('FLATMAP_LOCATION' in data) FLATMAP_LOCATION.value = data.FLATMAP_LOCATION;
      if ('MBF_IMAGE_NAME' in data) MBF_IMAGE_NAME.value = data.MBF_IMAGE_NAME;
      if ('SELECTED_IMAGE' in data) SELECTED_IMAGE.value = data.SELECTED_IMAGE;
      if ('optionsData' in data) optionsData.value = data.optionsData;
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
    SELECTED_SUBJECTS,
    MIN_MAX,
    SELECTED_IMAGE,
    optionsData,
    SCAFFOLD_URL,
    gridInstance,
    getDashItem,
    toggleWidgetLock,
    setMinMax,
    setSelectedSubject,
   // setBiolucidaPath,
    setImageArray,
    setSelectedImage,
    addOptionsDataItems,
    clearOptionsDataItems,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearAllFilters,
    setOptionServices,
    getServices
 }
})
