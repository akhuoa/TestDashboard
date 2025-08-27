
import axios from "axios";

const api = axios.create({
  baseURL: "https://services.scicrunch.io/quantdb/api/1/",
  timeout: 15000,
});

// helper: unwrap common response shapes
function unwrap<T = any>(resp: any): T {
  const d = resp?.data ?? resp;
  return (d?.result ?? d) as T; 
}

export const qdb = {
  // GET /classes 
  async getClasses() {
    const resp = await api.get("classes");
    return unwrap(resp);
  },

  // GET Instances of QDB /values/inst?dataset=<uuid> 
  async getAllInstances(dataset?: string | null) {
    const resp = await api.get("values/inst", {
      params: dataset ? { dataset } : undefined,
    });
    return unwrap(resp);
  },

  // GET /aspects?desc-inst=<metric>
  async getAspectsFromMetric(metric: string) {
    const resp = await api.get("aspects", { params: { "desc-inst": metric } });
    return unwrap(resp);
  },

  // GET /values/quant?aspect=<aspect>&desc-inst=<metric>
  async getDataByAspect(metric: string, aspect: string) {
    const resp = await api.get("values/quant", {
      params: { aspect, "desc-inst": metric },
    });
    return unwrap(resp);
  },

  async getLocationMinMax(
    min: number,
    max: number,
    subject: string | string[]
  ) {
    const params = new URLSearchParams();
    params.set('aspect', 'distance-via-reva-ft-sample-id-normalized-v1');
    params.set('value-quant-min', String(min));
    params.set('value-quant-max', String(max));
  
    (Array.isArray(subject) ? subject : [subject])
      .filter(Boolean)
      .forEach(s => params.append('subject', s));
  
    const resp = await api.get(`objects?${params.toString()}`);
    return unwrap(resp);
  },
  

  // GET /objects?dataset=<uuid>&inst=<instance>
  async getImagesByInstance(dataset: string, instance: string) {
    const resp = await api.get("objects", {
      params: { dataset, inst: instance },
    });
    return unwrap(resp);
  },
};