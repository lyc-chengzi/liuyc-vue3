<template>
    <div class="lvDemo">
        <h3>拖动列表项顺序</h3>
        <div class="drag-list" v-lvDrag>
            <ul>
                <li v-lvDragItem>第1-1项</li>
                <li v-lvDragItem>第1-2项</li>
                <li v-lvDragItem>第1-3项</li>
                <li v-lvDragItem>第1-4项</li>
            </ul>
        </div>
        <div class="drag-list" v-lvDrag>
            <ul>
                <li v-lvDragItem>第2-1项</li>
                <li v-lvDragItem>第2-2项</li>
                <li v-lvDragItem>第2-3项</li>
                <li v-lvDragItem>第2-4项</li>
            </ul>
        </div>
    </div>
</template>

<style lang="less">
.lvDemo {
    h3 {
        text-align: center;
    }
    .drag-list {
        margin-bottom: 20px;
        border: 1px solid #aacccc;
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
            &:last-child {
                border-bottom: 0;
            }
        }
    }
}
</style>
