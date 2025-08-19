<template>                 
    <slot :widgetName="widgetName" ></slot>

    <div ref="instance" class="subject-selector">
        <el-card
        v-for="sub in subjects"
        :key="sub.name"
        class="subject-selector-card"
        :class="{ selected: isSelected(sub) }"
        @click="toggleSelection(sub)"
        >
            <template #header>
                <div class="card-header">
                    <span>{{ sub.name }}</span>
                </div>
            </template>
            <div>Sex: {{ sub.sex }}</div>
            <div>Age: {{ sub.age }}</div>
        </el-card>
    </div>
</template>

<script setup>

  import { ref, watch, computed } from 'vue';
  import {useGlobalVarsStore} from "../stores/globalVars.ts"
  import {useSubjectStore} from "../stores/subjectStore.ts"
import { onBeforeMount } from 'vue';

  defineOptions({
      inheritAttrs: false
  })

  onBeforeMount(async()=>{
    await  SubjectStore.GetDistinctSubjects() 
  })
  const GlobalVars = useGlobalVarsStore();
  const SubjectStore = useSubjectStore();
  const widgetName = ref('Sub Select');
 // const subjects = ref([{name:"Sub-349", sex:"F", age:"49"},{ name:"Sub-18-s", sex:"M", age:"54"},{ name:"Sub-0021", sex:"M", age:"73"},{ name:"Sub-245-0", sex:"F", age:"92"},{name:"Sub-34", sex:"F", age:"49"},{ name:"Sub-18", sex:"M", age:"54"},{ name:"Sub-002", sex:"M", age:"73"},{ name:"Sub-2452", sex:"F", age:"92"}])

 const subjects = computed(()=>SubjectStore.DistinctSubjects)

 const selectedSubjects = computed(()=>GlobalVars.SELECTED_SUBJECTS);


  function isSelected(sub) {
    return selectedSubjects.value.some(s => s.name === sub.name);
    }

    function toggleSelection(sub) {
        const index = selectedSubjects.value.findIndex(s => s.name === sub.name);
        if (index !== -1) {
            selectedSubjects.value.splice(index, 1);
        } else {
            selectedSubjects.value.push(sub);
        }
        GlobalVars.setSelectedSubject(selectedSubjects.value)
    }

</script>
<style scoped lang="scss">
@import "../assets/vars.scss";
    .subject-selector{
        display: flex;
        flex-direction: row;
        overflow-x: scroll;
        .subject-selector-card{
            max-width: 200px;
            min-width: 100px;
            padding: 4px;
            margin:0 5px 0 5px;
        }
        .selected{
            background-color: var(--dash-backgroundBlocked);
        }
    }
    .el-card{
        cursor: pointer;
    }
    :deep(.el-card__header){
        height: 40px;
        padding: 5px;
    }
    .card-header{
        height: 30px;
    }
    :deep(.el-card__body){
        padding: 6px;
    }
</style>