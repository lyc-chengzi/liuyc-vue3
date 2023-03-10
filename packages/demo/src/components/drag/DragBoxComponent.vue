<template>
    <div class="component-box">
        <ul
            v-lvDrag="{
                key: 'id',
                data: props.data
            }"
        >
            <component
                :is="
                    item.children && item.children.length ? 'drag-box-component' : DragLeafComponent
                "
                :data="item.children && item.children.length ? item.children : item"
                v-for="item in props.data"
                :key="item.id"
                v-lvDragItem="{
                    item: item
                }"
            />
        </ul>
    </div>
</template>
<script lang="ts" setup>
import DragLeafComponent from './DragLeafComponent.vue';
const props = defineProps<{ data: any[] }>();
</script>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'drag-box-component'
});
</script>
