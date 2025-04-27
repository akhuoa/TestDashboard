<template>

    <div class="grid-stack-item-content">
        <div class="content-header">
            <h3>{{ navType.replace(/([A-Z])/g, ' $1').trim()}}</h3>
            <div> show/hide</div>
        </div>
        <slot></slot>
    </div>
</template>
<script setup>

const emit = defineEmits([]);

const props = defineProps({
    navType:String
    })

</script>
<style scoped lang="scss">
.content-header{
    justify-content: space-between;
    align-items: center;
    display:flex;
    flex-flow:row;

    h3{
        margin:10px;
    }
}

.grid-stack-item-content {
    border: 1px solid grey; //line color 1
    border-radius: 0.2rem;
    text-align: start;
    background:grey;//line color 2
}
:deep(.fill) {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    img {
    flex-shrink: 1;
    width:100%;
    }
}
</style>