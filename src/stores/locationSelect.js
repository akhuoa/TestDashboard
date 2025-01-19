import { ref, inject } from 'vue'
import { defineStore } from 'pinia'
import { Api } from "../services";
import {useGlobalVarsStore} from "../stores/globalVars"
const GlobalVars = useGlobalVarsStore();

export const useLocationStore = defineStore('locationSelected', () => {
  const emitter = inject('emitter');

  //this was used to add this event listener to a component
    function init(){
      // emitter.on('FlatmapViewer-anatomicalLocationSelected',(location)=>{
      //   if(location && location.min && location.max){
      //     getRegionMinMax(location.min,location.max);
      //   }
      // });
    }

function getLocationFromMinMax(min,max){
  if(min && max){
    getRegionMinMax(min, max);
  }
}
//user has selected a location on the flatmap
//use coord system from 0-1 to call qdb for a list of instances of images within that range 
const getRegionMinMax = async(min, max, subject)=>{
    subject = "sub-f001";
    let _instance_list = {};
    let _response = {};
    try{
        await Api.qdb.getLocationMinMax(min,max,subject).then(response =>{
            _response = response;
        })
        if (_response.status === 200) {
          _instance_list = _response.data.result;
          handleMinMaxRequest(_instance_list);
        }
    }catch(e){
        console.error("couldn't get min max region "+subject+" from QDB /n min: "+min +" max: "+ max);
        console.log(e)
    }
}
function handleMinMaxRequest(results){
    const instances =results.filter(y => y.agg_type ==="instance");
    getPackageIds(instances)
}

//send in instanceIds to get the package Ids associated with them. 
// call only takes 1 instance id at a time currently

const getPackageIds = async(instances)=>{
  let ImagesArray = [];
  for(var i=0;i<instances.length;i++){
      let _image_list = {};
      let _response = {};
      const instance = instances[i].inst || null;
      const dataset = instances[i].dataset || null;
      GlobalVars.DATASET_ID = dataset;
      try{
          await Api.qdb.getImagesByInstance(dataset,instance).then(response =>{
              _response = response;
          })
          if (_response.status === 200) {
            _image_list = _response.data.result;
            ImagesArray = [...ImagesArray, ..._image_list]
          }
      }catch(e){
          console.error("couldn't get images from instance "+instance+" and dataset "+dataset+" from QDB");
          console.log(e)
    }
  }
  ImagesArray = ImagesArray.filter(x=>x.id_type!=="quantdb"&& x.id);
  getMetadataForImages(ImagesArray)
}
//call for actual metadata you can use
const getMetadataForImages= async(images)=>{
  let withMetadata = {};
  let _response = {};
    try{

      var config = { headers: {'Content-Type': 'application/json',}}
      //packageids from image obj
      const packageIdList = images.map(i=>"package:"+i.id);
      var data = JSON.stringify({
        "track_total_hits": true,
        "query": {
          "terms": {
            "path_metadata.remote_id.keyword": 
              //packageIdList
              ["package:e5934c93-244a-4e84-84ec-4a931a30f6a4",  "package:2e294d01-a9d3-4e43-a798-89acb2004a68","package:3d2ff4af-0d5f-40e1-a041-22713ba5f81f","N:package:a1afeb63-073c-462e-9856-ced4e8c57382","N:package:d85f3014-6841-43fe-a173-120b9ac4fff6"]
            
          }
        }
      });
      //call for metadata
      await Api.fli.getFileLevelData(data,config).then(response =>{
          _response = response;
      })
      if (_response.status === 200) {
        withMetadata = _response.data.hits.hits;
        //map to image objectl. include datasetid and packageid
        GlobalVars.MBF_IMAGE_ARRAY = withMetadata;
      }
  }catch(e){
      console.error("couldn't get metadata from list of images from File Level Index");
      console.log(e)
  }

}

  const componentList = ref([""]);
  const navigatorType = ref("LocationNav");//default 
  return { init, navigatorType, getLocationFromMinMax }
})
