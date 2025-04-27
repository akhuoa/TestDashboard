import { ref, inject } from 'vue'
import { defineStore } from 'pinia'
import { Api } from "../services";
import {useGlobalVarsStore} from "../stores/globalVars"
import { TableObject} from "../devComponents/ImageSelector/ImageModel"
const GlobalVars = useGlobalVarsStore();

export const useLocationStore = defineStore('locationSelected', () => {

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
  let ImagesArray = results.filter(x=>x.id_type!=="quantdb"&& x.id);
  getMetadataForImages(ImagesArray);
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
        parseDataIntoImageArray(withMetadata);
      }
  }catch(e){
      console.error("couldn't get metadata from list of images from File Level Index");
      console.log(e)
  }
}
  function parseDataIntoImageArray(images){
    try{
      //rename TableObject cuz it doesn't make sense anymore. it's a parsed image array
      const imageArray = new TableObject(images);
      GlobalVars.setImageArray(imageArray.SparcImageArray);
    }catch(ex){
      console.error("error parsing Image Array: "+ex.message)
    }
  }


  const componentList = ref([""]);
  const navigatorType = ref("LocationNav");//default 
  return { navigatorType, getLocationFromMinMax }
})
