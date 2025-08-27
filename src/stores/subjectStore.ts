import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Api } from "../services";
import { useGlobalVarsStore } from './globalVars';
class Subject {
    public name: string;
    public sex: string;
    public age: string | number;
    public datasetUuid: string;
    public id: string;
  
    constructor(
      name: string,
      sex: string | null = null,
      age: string | number | null = null,
      datasetUuid: string | null = null,
      id: string | null = null
    ) {
      this.name = name;
      this.sex = sex ?? "X";            
      this.age = age ?? "Unknown";    
      this.datasetUuid = datasetUuid ?? "";
      this.id = id ?? "";
    }
  }

export const useSubjectStore = defineStore('subjectStore', () => {

    const GlobalVars = useGlobalVarsStore();
    const DistinctSubjects = ref<Subject[]>([]);

    const GetDistinctSubjects = async()=>{
        if(DistinctSubjects.value.length){return}
        try{
            const response = await Api.qdb.getAllInstances(null)
            const uniqueSubjects = extractUniqueSubjects(response)
            const validSubjects = await filterForValidSubs(uniqueSubjects);
            DistinctSubjects.value =validSubjects;
        }
        catch(e){
            console.error("could not get distinct subjects",e)
        }
    }
    function extractUniqueSubjects(rows): Subject[] {
        const seen = new Set<string>();
        const unique: Subject[] = [];

        for (const row of rows) {
            const subj = row.subject?.trim();
            const ds = row.dataset?.trim();
            if (!subj || !ds) continue;

            const key = `${subj}::${ds}`; // composite key
            if (!seen.has(key)) {
            seen.add(key);
            unique.push(new Subject(row.subject,null,null,row.dataset,key));
            }
        }
        return unique;
    }

    //match subject's dataset uuid with valid algolia ids
    const filterForValidSubs = async (uniqueSubjects: any[]) => {
        try {
          const services: any = GlobalVars.getServices();
          const algoliaClient = services?.AlgoliaClient;
          const algoliaConfig = services?.AlgoliaConfig;
      
          if (!algoliaClient || !algoliaConfig?.indexName) {
            return uniqueSubjects; // no filtering if Algolia is not provided
          }
      
          const index = algoliaClient.initIndex(algoliaConfig.indexName);
      
          // Run all requests in parallel and wait for them
          const results = await Promise.all(
            uniqueSubjects.map(async (sub) => {
              try {
                const response = await index.searchForFacetValues(
                  "item.identifier",
                  sub.datasetUuid 
                );
                if (response.facetHits?.length > 0) {
                  return sub;
                }
                return null; 
              } catch (err) {
                console.error("Algolia search failed for", sub, err);
                return null;
              }
            })
          );
      
          // Filter out nulls
          const returnSubArray = results.filter((r) => r !== null);
          return returnSubArray;
        } catch (x) {
          console.error("filterForValidSubs failed:", x);
          return []; 
        }
      };
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
