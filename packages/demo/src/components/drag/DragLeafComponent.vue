<template>
    <li class="component-leaf" v-lvDragItem="{ item: props.data }">
        {{ props.data.id }}
    </li>
</template>
<script lang="ts" setup>
const props = defineProps<{ data: any }>();
</script>
