<template>
    <div class="lvDemo">
        <h3>拖动列表项顺序</h3>
        <DragBoxComponent :data="data" />
    </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import DragBoxComponent from '../components/drag/DragBoxComponent.vue';
const data = reactive([
    {
        id: 'node1',
        children: [
            {
                id: 'node1-1',
                children: []
            },
            {
                id: 'node1-2',
                children: []
            }
        ]
    },
    {
        id: 'node2',
        children: [
            {
                id: 'node2-1',
                children: []
            },
            {
                id: 'node2-2',
                children: []
            }
        ]
    }
]);

const list1DragStart = () => {
    console.log('list1 dragStart--------');
};
const list1Draging = () => {
    console.log('list1 draging--------');
};
const list1DragEnd = () => {
    console.log('list1 dragEnd--------');
};
const list1DragIn = () => {
    console.log('list1 dragIn--------');
};
const list1DragFinish = () => {
    console.log('list1 dragFinish--------');
};

const list2DragIn = () => {
    console.log('list2 dragIn--------');
};
</script>
<style lang="less">
.lvDemo {
    h3 {
        text-align: center;
    }
    .component-box {
        margin-bottom: 20px;
        border: 1px solid #aacccc;
        padding-bottom: 30px;
        ul,
        li {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        li {
            height: 30px;
            line-height: 30px;
            border-bottom: 1px solid #aacccc;
            background-color: bisque;
        }
    }
}
</style>
