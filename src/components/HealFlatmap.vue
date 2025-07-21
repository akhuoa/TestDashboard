<template>                  
    <slot :widgetName="widgetName"></slot>
    <div id="map-container"></div>

</template>
<script setup>
  import { ref, onMounted} from "vue";
  

defineOptions({
        inheritAttrs: false
    })
const widgetName = "Heal Flatmap"
// Use production SPARC maps

const MAP_SERVER = ref('https://mapcore-demo.org/current/flatmap/v3/')

onMounted(async () => {
  const { MapViewer } = await import('https://cdn.jsdelivr.net/npm/@abi-software/flatmap-viewer/+esm')

  const viewer = new MapViewer(MAP_SERVER.value)

  const mapList = await viewer.allMaps()

  await viewer.loadMap(
    {
      taxon: 'NCBITaxon:9606',
      biologicalSex: 'PATO:0000383'
    },
    (type, data) => {
      // console.log(type, data)
    },
    {
      container: 'map-container',
      pathsDisabled: true
    }
  )
})


</script>
<style>
/* this cannot be scoped while still working as designed. Style leak exists reardless of this line */
        /* @import "@abi-software/flatmapvuer/dist/style.css"; */
</style>
<style scoped lang="scss">
@import "../assets/vars.scss";

#map-container{
    border: 3px solid green;
    height: 100%;
    width: 100%;
}

</style>