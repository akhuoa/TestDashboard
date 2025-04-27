<template>
    <div class="content-header stick-to-top tw-flex tw-flex-row tw-items-center tw-justify-between tw-h-10 tw-p-1">                    
      <slot></slot>
    </div>
    <div class="fill">
        <img :src=imgPath>
    </div>
    <div @click="selectSubject('./imgs/subInfo2.png')" class="w-80 fill">
        <img :src=imgPath2>
    </div>
    <div @click="selectSubject('./imgs/subInfo.png')" class="w-80 fill">
        <img :src=imgPath3>
    </div>
    <div @click="selectSubject('./imgs/subInfo2.png')" class="w-80 fill">
        <img :src=imgPath2>
    </div>
    <div @click="selectSubject('./imgs/subInfo.png')" class="w-80 fill">
        <img :src=imgPath3>
    </div>
    <div @click="selectSubject('./imgs/subInfo2.png')" class="w-80 fill">
        <img :src=imgPath2>
    </div>
    <div @click="selectSubject('./imgs/subInfo.png')" class="w-80 fill">
        <img :src=imgPath3>
    </div>
</template>
<script setup>
  import { ref} from "vue";

  const emit = defineEmits(['setTitle'])
  emit('setTitle','Navigate by Subject');

  const imgPath = ref("./imgs/filter.png");
  const imgPath2 = ref("./imgs/sub1.png");
  const imgPath3 = ref("./imgs/sub2.png");

function selectSubject(img){


}
</script>
<style scoped lang="scss">


</style>