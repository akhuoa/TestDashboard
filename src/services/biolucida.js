import axios from "axios";
const base = 'https://sparc.biolucida.net/api/v1/';
const sparcBase = 'https://api.sparc.science/';

const CreateBaseApiService = (resource) => {
  return {
    // Get a list of resources
    getShareLink: (packageID, id) => axios.get(`${base}imagemap/sharelink/N:package:${packageID}/${id}`),
    getShareLinkByID:(id)=>axios.get(`${sparcBase}image_blv_link/${id}`)
  };
};


export const biolucida = {
  ...CreateBaseApiService("users"),
  //custom: axios.get(`${base}/some/custom/route`, config),
};

  
  const getThumbnail = async (id) => {
    const { $portalApiClient } = useNuxtApp()
    return $portalApiClient.get('thumbnail/' + id)
  }
  
  export default {

    getThumbnail,

  }