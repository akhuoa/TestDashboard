import axios from "axios";
const base = "https://services.scicrunch.io/quantdb/api/1/"

const CreateBaseApiService = () => {
  return {
    // qdb graph: initial call is GET list of classes qdb contains. this fills the "metric" dropdown in settings, 
    // right now it consists of fascicle, volume, ect. 
    getClasses: () => axios.get(`${base}classes`),
    // qdb graph: called on metric selection. returns list of aspects to plot on x or y axis 
    getAspectsFromMetric: (metric) => axios.get(`${base}aspects?desc-inst=${metric}`),
    //qdb graph: sends both the metric and aspect up and returns a list of instances that has a value to be plotted.
    getDataByAspect: (metric, aspect)=> axios.get(`${base}values/quant?aspect=${aspect}&desc-inst=${metric}`),
    //flatmap viewer: called on location selection. 0-1 index returns package ids within that index. 
    getLocationMinMax:(min, max, subject)=>axios.get(`${base}objects?aspect=distance-via-reva-ft-sample-id-normalized-v1&subject=${subject}&value-quant-min=${min}&value-quant-max=${max}`),
    //not used in any widget
    getImagesByInstance:(dataset,instance)=>axios.get(`${base}objects?dataset=${dataset}&inst=${instance}`)
  };
};


export const qdb = {
  ...CreateBaseApiService(),
};
