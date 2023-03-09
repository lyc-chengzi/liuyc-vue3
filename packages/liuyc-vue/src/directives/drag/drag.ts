import type { Directive, VNode } from 'vue';
import $ from 'jquery';
import { guid2 } from '@liuyc-vue/utils/src/uuid';
import { $log } from '@liuyc-vue/utils/src/log';
import './drag.less';

// 拖动列表样式
const dragBoxClassName = 'lv-drag-list';
// 拖动项样式
const dragItemClassName = 'lv-drag-item';

const dragListMap = new Map();
const dragItemMap = new Map<string, { el: HTMLElement; vnode: VNode }>();

// 指令默认参数
const defaultOptions = {
    delay: 200
};

let mouseDownTimeout = 0;
let bodyMouseMoveBind = false;
// 是否正在拖动
let dragItemDragging = false;
// 正在拖动的html元素
let dragItem: HTMLElement | null = null;
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
};
// 鼠标移动事件
const bodyMouseMove = (e: any) => {
    if (dragItemDragging && $dragItemMask) {
        $log('draging.......');
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
        // $(dragItem).css(style);
    }, defaultOptions.delay);
};

// 鼠标抬起，拖动结束
const bodyMouseUp = (e: any) => {
    window.clearTimeout(mouseDownTimeout);
    if (dragItemDragging) {
        resetSettings();
        $(`.${dragItemClassName}`).removeClass('drag-over');
        $log('item drag end', e);
    }
};

// 可拖动项被拖动到其他项的事件
const bodyMouseOver = (e: any) => {
    if (dragItemDragging) {
        if (e.target && e.currentTarget && e.target === e.currentTarget) {
            $log('drag over .....', e);
            const $target = $(e.currentTarget);
            $(`.${dragItemClassName}`).removeClass('drag-over');
            $target.addClass('drag-over');
        }
    }
};

export const LvDrag: Directive = {
    mounted(el: HTMLElement, bind, vnode) {
        const $el = $(el);
        const uuid = guid2();

        if (!el.classList.contains(dragBoxClassName)) {
            el.classList.add(dragBoxClassName);
        }
        if (!bodyMouseMoveBind) {
            $('body')
                .on('mousemove', bodyMouseMove)
                .on('mousedown', `.${dragItemClassName}`, bodyMouseDown)
                .on('mouseover', `.${dragItemClassName}`, bodyMouseOver)
                .on('mouseup', bodyMouseUp);
            bodyMouseMoveBind = true;
        }
        $el.attr('data-uuid', uuid);
        dragListMap.set(uuid, {
            el,
            vnode
        });
    },
    beforeUnmount(el: HTMLElement) {
        $('body')
            .off('mousemove', bodyMouseMove)
            .off('mousedown', bodyMouseDown)
            .off('mouseup', bodyMouseUp);
        const $el = $(el);
        const uuid = $el.attr('data-uuid') || '';
        if (dragItemMap.has(uuid)) {
            dragItemMap.delete(uuid);
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
        dragItemMap.set(uuid, {
            el,
            vnode
        });
    },
    beforeMount(el: HTMLElement) {
        const $el = $(el);
        const uuid = $el.attr('data-uuid') || '';
        if (dragItemMap.has(uuid)) {
            dragItemMap.delete(uuid);
        }
    }
};
