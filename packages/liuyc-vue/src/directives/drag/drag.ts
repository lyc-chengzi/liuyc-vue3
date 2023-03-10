import type { Directive, DirectiveBinding, VNode } from 'vue';
import $ from 'jquery';
import { guid2 } from '@liuyc-vue/utils/src/uuid';
import { $log } from '@liuyc-vue/utils/src/log';
import './drag.less';

export interface IDragListOptions {
    key: string;
    data: any[];
    disable?: boolean;
    group?: string;
    delay?: number;
    onDragStart?: () => void; // 拖动开始
    onDraging?: () => void; // 正在拖动
    onDragEnd?: () => void; // 拖动结束
    onDragFinish?: () => void; // 有效拖动(拖动对象发生了位置变化)
    onDragIn?: (index: number) => void; // 有效拖动(从其他box的item拖动到目标box)
}

// 拖动列表样式
const dragBoxClassName = 'lv-drag-list';
// 拖动项样式
const dragItemClassName = 'lv-drag-item';

let dragListCount = 0;
const dragListMap = new WeakMap<
    HTMLElement,
    {
        uuid: string;
        options: IDragListOptions;
        vnode: VNode;
    }
>();
const dragItemMap = new WeakMap<
    HTMLElement,
    {
        uuid: string;
        vnode: VNode;
    }
>();

document.body.addEventListener('dblclick', () => {
    $log('--------------', dragListMap, dragItemMap);
});

// 指令默认参数
const defaultOptions: IDragListOptions = {
    delay: 200,
    disable: false,
    key: 'id',
    data: []
};

let mouseDownTimeout = 0;
let bodyMouseMoveBind = false;
// 是否正在拖动
let dragItemDragging = false;
// 正在拖动的html元素
let dragItem: HTMLElement | null = null;
// 拖动的目标元素
let targetItem: HTMLElement | null = null;
// 创建的拖动蒙层jquery对象
let $dragItemMask: any = null;

// 拖动开始时的坐标
const dragStartPosition = {
    targetX: 0,
    targetY: 0,
    mouseX: 0,
    mouseY: 0
};

// 重置所有设置
const resetSettings = () => {
    dragItemDragging = false;
    dragItem = null;
    if ($dragItemMask) {
        $dragItemMask.remove();
        $dragItemMask = null;
    }
    dragStartPosition.targetX = 0;
    dragStartPosition.targetY = 0;
    dragStartPosition.mouseX = 0;
    dragStartPosition.mouseY = 0;
    $(`.${dragItemClassName}`).removeClass('drag-over');
    $(`.${dragBoxClassName}`).removeClass('drag-over');
};
// 鼠标移动事件
const bodyMouseMove = (e: any) => {
    if (dragItemDragging && $dragItemMask) {
        // $log('draging.......');
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        $dragItemMask.css({
            top: dragStartPosition.targetY + (mouseY - dragStartPosition.mouseY) + 'px',
            left: dragStartPosition.targetX + (mouseX - dragStartPosition.mouseX) + 'px'
        });
    }
};

// 鼠标按下，一定延迟后拖动开始
const bodyMouseDown = (e: any) => {
    mouseDownTimeout = window.setTimeout(() => {
        if (
            !e.currentTarget ||
            !(e.currentTarget as HTMLElement).classList.contains(dragItemClassName)
        )
            return false;
        dragItem = e.currentTarget as HTMLElement;
        // 拖动开始
        dragItemDragging = true;
        const clientReact = dragItem.getBoundingClientRect();
        $dragItemMask = $('<div class="lv-drag-mask"></div>');
        const $dragItem = $(dragItem);
        dragStartPosition.targetX = clientReact.x;
        dragStartPosition.targetY = clientReact.y;
        dragStartPosition.mouseX = e.clientX;
        dragStartPosition.mouseY = e.clientY;
        $log('item drag start', e);
        const style = {
            top: clientReact.y + 'px',
            left: clientReact.x + 'px',
            width: $dragItem.width() + 'px',
            height: $dragItem.height() + 'px'
        };
        $dragItemMask.css(style).appendTo('body');

        const $dragList = $dragItem.parents('.lv-drag-list');
        // 触发开始拖动回调函数
        if ($dragList.length && dragListMap.has($dragList[0])) {
            const dragList = dragListMap.get($dragList[0]);
            if (dragList!.options && dragList!.options.onDragStart) {
                dragList!.options.onDragStart();
            }
        }
        // $(dragItem).css(style);
    }, defaultOptions.delay);
};

// 鼠标抬起，拖动结束
const bodyMouseUp = (e: any) => {
    window.clearTimeout(mouseDownTimeout);
    if (dragItemDragging) {
        if (dragItem) {
            // 原始拖动对象
            const $dragItem = $(dragItem);
            // 原始拖动对象所在box
            const $dragList = $dragItem.parents('.lv-drag-list').first();
            // 触发原始拖动对象box 拖动结束 回调函数
            const dragList = dragListMap.get($dragList[0]);
            if (dragList) {
                $log('drag end callback ---------', $dragList, dragList);
                if (dragList.options.onDragEnd) {
                    dragList.options.onDragEnd();
                }
            }
            // 有效拖动
            if (targetItem && dragItem !== targetItem) {
                if (dragList && dragList.options.onDragFinish) {
                    dragList.options.onDragFinish();
                }

                // 目标对象
                const $targetItem = $(targetItem);
                // 找到正确的目标对象所在box
                const $targetList = $targetItem.hasClass(dragBoxClassName)
                    ? $targetItem
                    : $targetItem.parents('.lv-drag-list').first();
                const targetList = dragListMap.get($targetList[0]);
                if (
                    targetList &&
                    dragList &&
                    dragList.uuid !== targetList.uuid &&
                    targetList.options.onDragIn
                ) {
                    targetList.options.onDragIn(1);
                }
            }
        }
        resetSettings();
        $log('item drag end', e);
    }
};

// 可拖动项被拖动到其他项的事件
const bodyMouseOver = (e: any) => {
    if (dragItemDragging) {
        if (e.target && e.currentTarget && e.currentTarget.classList.contains(dragBoxClassName)) {
            targetItem = e.target;
            const $target = $(e.target);
            $log('drag over .....', e, $target);
            // 移动到拖动盒子上
            $(`.${dragBoxClassName}`).removeClass('drag-over');
            $(`.${dragItemClassName}`).removeClass('drag-over');
            $target.addClass('drag-over');
        }
    }
};

export const LvDrag: Directive = {
    mounted(el: HTMLElement, bind: DirectiveBinding<IDragListOptions>, vnode) {
        $log('drag list mounted >>>>>>', bind);
        dragListCount++;
        const $el = $(el);
        const uuid = guid2();

        if (!el.classList.contains(dragBoxClassName)) {
            el.classList.add(dragBoxClassName);
        }
        if (!bodyMouseMoveBind) {
            $('body')
                .on('mousemove', bodyMouseMove)
                .on('mousedown', `.${dragItemClassName}`, bodyMouseDown)
                .on('mouseover', `.${dragBoxClassName}`, bodyMouseOver)
                .on('mouseup', bodyMouseUp);
            bodyMouseMoveBind = true;
        }
        $el.attr('data-uuid', uuid);
        const options = { ...defaultOptions, ...(bind.value || {}) };
        dragListMap.set(el, {
            uuid,
            options: options,
            vnode
        });
    },
    beforeUnmount() {
        dragListCount--;
        if (dragListCount === 0) {
            $('body')
                .off('mousemove', bodyMouseMove)
                .off('mousedown', bodyMouseDown)
                .off('mouseover', bodyMouseOver)
                .off('mouseup', bodyMouseUp);
        }
    }
};

export const LvDragItem: Directive = {
    mounted(el: HTMLElement, bind, vnode) {
        const $el = $(el);
        const uuid = guid2();

        if (!el.classList.contains(dragItemClassName)) {
            el.classList.add(dragItemClassName);
        }
        $el.attr('data-uuid', uuid);
        dragItemMap.set(el, {
            uuid,
            vnode
        });
    }
};
