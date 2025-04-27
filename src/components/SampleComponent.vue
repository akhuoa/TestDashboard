<template>                 
      <!-- slot is for header & user can add icons using childIcons-->
      <slot :widgetName="widgetName" :childIcons="childIcons"></slot>


    <div ref="instance">
        <div class="sample-component">this is a sample component
        <div> 
            <p>more of the component goes here</p>
        </div>
        </div>
        <!-- all markup -->
    </div>
</template>
<script setup>

    import { ref, defineEmits, inject, watch, onMounted, onUnmounted } from 'vue';
    import GraphIcon from './icons/GraphIcon.vue';
    //this is included so that your component does not inherit props or attributes that you do not explicitly declare 
    defineOptions({
        inheritAttrs: false
    })

    const widgetName = ref('New Custom Component!');//replace with component name you want shown
    
    //add icon to header. must import your icon as shown above ex: import GraphIcon from './icons/GraphIcon.vue'
    //this is optional and can be deleted
    const childIcons=shallowRef([{"comp":GraphIcon,"event":testIcon}]);
    function testIcon(){alert("test icon function")};


</script>
<style scoped lang="scss">
//import SPARC styles if you want to have access to them. 


//example of class styles
.sample-component{
    height:500px;
    width:400px;
    border: solid purple 1px;
    background-color: lightgray;
}
</style>