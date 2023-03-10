<template>
    <div class="lvDemo">
        <h3>拖动列表项顺序</h3>
        <div
            class="drag-list"
            v-lvDrag="{
                key: 'id',
                data: data1,
                disable: true,
                onDragStart: list1DragStart,
                onDraging: list1Draging,
                onDragEnd: list1DragEnd,
                onDragIn: list1DragIn,
                onDragFinish: list1DragFinish
            }"
        >
            <ul>
                <li v-for="item in data1" :key="item.id" v-lvDragItem>第{{ item.id }}项</li>
            </ul>
        </div>
        <div
            class="drag-list"
            v-lvDrag="{
                onDragIn: list2DragIn
            }"
        >
            <ul>
                <li v-for="item in data2" :key="item.id" v-lvDragItem>第{{ item.id }}项</li>
            </ul>
        </div>

        <div class="drag-list" v-lvDrag>
            <ul v-lvDragItem>
                <div class="drag-list" v-lvDrag>
                    <ul v-lvDragItem>
                        <li v-for="item in data1" :key="item.id" v-lvDragItem>
                            第 1---- {{ item.id }}项
                        </li>
                    </ul>
                </div>
            </ul>
            <ul v-lvDragItem>
                <div class="drag-list" v-lvDrag>
                    <ul v-lvDragItem>
                        <li v-for="item in data1" :key="item.id" v-lvDragItem>
                            第 2---- {{ item.id }}项
                        </li>
                    </ul>
                </div>
            </ul>
            <ul v-lvDragItem>
                <div class="drag-list" v-lvDrag>
                    <ul v-lvDragItem>
                        <li v-for="item in data1" :key="item.id" v-lvDragItem>
                            第 3---- {{ item.id }}项
                        </li>
                    </ul>
                </div>
            </ul>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
const data1 = reactive([{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }]);
const data2 = reactive([{ id: 'b1' }, { id: 'b2' }, { id: 'b3' }]);

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
    .drag-list {
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
        }
    }
}
</style>
