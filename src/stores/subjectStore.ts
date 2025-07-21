import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Api } from "../services";
import { useGlobalVarsStore } from './globalVars';

export const useSubjectStore = defineStore('subjectStore', () => {

    const GlobalVars = useGlobalVarsStore();
    const DistinctSubjects = ref([]);

    const GetDistinctSubjects = async()=>{
        if(DistinctSubjects?.value.length){return}
        try{
            await Api.qdb.getSubjects(GlobalVars.DATASET_ID).then(response =>{
                const uniqueSubjects = Array.from(
                     new Set(response.data.result.map(obj => obj.subject))
                  );
                  DistinctSubjects.value = getSubjectMetaData(uniqueSubjects);
            })
        }
        catch(e){
            console.error("could not get distinct subjects",e)
        }
    }
    //Placeholder function for getting metadata from a subject
    const getSubjectMetaData = (subjectArray)=>{
        return subjectArray.map(name => ({
            name,
            sex: "F",  // Hardcoded for now
            age: "50"
          }));
    }

  return { 
    DistinctSubjects,
    GetDistinctSubjects
 }
})
