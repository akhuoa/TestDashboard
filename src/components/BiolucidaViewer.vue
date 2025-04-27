<template>
          
    <slot :widgetName="widgetName"></slot>
    
    <div v-bind="$attrs"  class="tw-flex tw-flex-col tw-h-full">
        <div v-if="selectedImage" class="bv-metadata tw-text-left tw-p-1 tw-text-sm meta-container">
          <div class="meta-item">Sex: {{ selectedImage.sex }}</div>
          <div class="meta-item">Age: {{ selectedImage.ageRange }}</div>
          <div class="meta-item">
          <a :href="selectedImage.urlPath" target="_blank" rel="noopener noreferrer">
            Pennsieve Link       
            <el-icon color="#8300BF"></el-icon>
          </a>
        </div>
        </div>
        <div class="tw-h-screen tw-flex tw-justify-center">
            <iframe class="tw-p-1 tw-w-screen" :src="selectedImage.biolucidaPath" ></iframe>
        </div>
    </div>
</template>
<script setup>
  import {ref, onMounted, onUnmounted, inject,watch} from "vue";
  import {useGlobalVarsStore} from "../stores/globalVars"
  import { Api } from "../services";

  const widgetName = ref('MBF Image Viewer');
  const emit = defineEmits(['selectWidget']);

  const props = defineProps({
    imageID:0,
    listening:{
            type:Boolean
    }
  })

  const GlobalVars = useGlobalVarsStore();
  const selectedImage = ref("");

  //instead listen for image selected instead of just the link
  watch(() => GlobalVars.SELECTED_IMAGE, (newVal, oldVal) => {
    selectedImage.value = newVal
    if(!newVal?.biolucidaPath){
      getBiolucidaLink()
    }
},{deep:true})

//get Biolucida url on update
//this will only happen if the url is not provided by the FLI
//The link will then need to be called using the sparc id and package id
const getBiolucidaLink = async ()=>{
  console.log(selectedImage.value)
  const sparcId = selectedImage.value.sparcID;
  const packageId = selectedImage.value.packageId;

  let share_link = "";
  let _response = {};
  try{
      await Api.biolucida.getShareLink(packageId,sparcId).then(response =>{
          _response = response;
      })
      if (_response.status === 200) {
          share_link= _response.data.share_link;
          GlobalVars.setBiolucidaPath(share_link);
      }
  }catch(e){
      console.error("couldn't fetch biolucida link: "+e);
  }
}
  onMounted(() => {
    GlobalVars.mbfViewerCount++;
  });
  onUnmounted(()=>{
    GlobalVars.mbfViewerCount--;
  })

</script>
<style scoped lang="scss">
.bv-metadata{
  border: solid #ebedf0 2px;
    padding-left:10px;
    span{
        font-weight: bold;
    }
}
.hightlight{
        border:solid purple 2px !important; //light purple
    }
    iframe{padding:0; border:none;}

.meta-item {
  width: 100%
}

.meta-container {
  display: flex;
  flex-wrap: wrap;
  background:white;
}

.meta-container > div {
  flex: 30%; /* or - flex: 0 50% - or - flex-basis: 50% - */
  /*demo*/
  margin: 2px;
  
}
</style>