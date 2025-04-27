<template>
    <slot :widgetName="widgetName"></slot>
    <div v-bind="$attrs">
        <div class="tw-w-1/2 tw-mx-auto">
            <h2>{{ props.count }}</h2>
        </div>
      </div>
    
    </template>
    <script setup>
      import { ref, inject, onMounted } from "vue";
    
      defineOptions({
          inheritAttrs: false
      })    
      const props = defineProps({
        count:Number
        })

        const widgetName = ref('Count Widget');
    

      const editing = ref(false);
      const textContentInput = ref(null);
    
      function editInput(){
            editing.value=true;
            textContentInput.value ? textContentInput.value.focus(): "";
      }
      function saveInput(){
            editing.value=false;
      }
    </script>
    <style scoped>
      .selector-body{
          
      }
    </style>