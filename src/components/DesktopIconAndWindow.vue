<script setup lang="ts">
import { computed, ref, StyleValue } from 'vue';
import { CancellableTask, map } from '../lib/util';
import Vector from '../lib/Vector';
import Window from './Window.vue';
import Icon from './Icon.vue';
import useObserveSize from './mixins/useObserveSize';
import { windowController, WindowModel } from './models';

const props = defineProps<{
  iconSrc: string
  name: string
  containingWindow: WindowModel
}>()

const windowModel = computed<WindowModel>(() => ({
  id: props.name,
  selectedIcon: null,
}))

const NUM_ANIMATION_BOXES = 13
const openAnimationProgress = ref(1)
const iconOffset = ref({x: 0, y: 0})
const openAnimationTask = ref<CancellableTask|null>(null)
const windowElement = ref<HTMLElement>()
const windowSize = useObserveSize(windowElement)
const iconSelected = computed(() => props.containingWindow.selectedIcon?.id === props.name)
const iconOpen = computed(() => openAnimationProgress.value > 0)
const windowActive = computed(() => windowController.activeWindow.id === windowModel.value.id)
const windowIndex = computed(() => {
  const idx = windowController.windowOrder.findIndex(w => w.id === windowModel.value.id)
  if (idx === -1) {
    return null
  }
  return idx
})

function makeWindowActive() {
  windowController.activeWindow = windowModel.value
  // remove self from windowOrder first
  windowController.windowOrder = windowController.windowOrder.filter(w => w.id !== windowModel.value.id)
  // then add self to the end
  windowController.windowOrder.push(windowModel.value)
}


function openAnimationBoxStyle(box: number): StyleValue {
  let p = box / (NUM_ANIMATION_BOXES - 1)
  p = Math.pow(p, 2)
  if (windowSize.value.width == 0 || windowSize.value.height == 0)
    return {}
  const windowCenter = {x: windowSize.value.width / 2, y: windowSize.value.height / 2}
  const startOffset = Vector.add(windowCenter, iconOffset.value)
  const endOffset = windowCenter

  const offset = Vector.interp(startOffset, endOffset, p)
  const size = {
    width: map(p, {to: [32, windowSize.value.width]}),
    height: map(p, {to: [32, windowSize.value.height]}),
  }
  const rect = {
    left: offset.x - size.width / 2,
    top: offset.y - size.height / 2,
    width: size.width,
    height: size.height,
  }

  const visible = openAnimationProgress.value > 0 && Math.abs(p - openAnimationProgress.value) < 0.2

  return {
    position: 'absolute',
    // left: rect.left.toFixed(1) + 'px',
    left: `${rect.left.toFixed(0)}px`,
    top: `${rect.top.toFixed(0)}px`,
    width: `${rect.width.toFixed(0)}px`,
    height: `${rect.height.toFixed(0)}px`,

    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'all' : 'none',

    // transform: `translate(${this.openCloseAnimationOffset.x}px, ${this.openCloseAnimationOffset.y}px)`,
  }
}

function windowStyle(): StyleValue {
  const visible = openAnimationProgress.value == 1
  return {
    opacity: visible ? '1' : '0',
    pointerEvents: visible ? 'auto' : 'none',
  }
}

function titleBarMouseDown(event) {

}

function selectIcon() {
  console.log('click')
  props.containingWindow.selectedIcon = {id: props.name}
}

function windowClosePressed() {
  animateClose()
}

function animateClose() {
  openAnimationProgress.value = 1
  const animationDuration = 500
  const animationStartTime = Date.now()

  openAnimationTask.value?.cancel()
  openAnimationTask.value = new CancellableTask(async task => {
    selectIcon()

    while (!task.isCancelled) {
      await task.nextAnimationFrame()
      openAnimationProgress.value = 1 - (Date.now() - animationStartTime) / animationDuration

      if (openAnimationProgress.value <= 0) {
        openAnimationProgress.value = 0
        break;
      }
    }
  })
}
function animateOpen() {
  openAnimationProgress.value = 0
  const animationDuration = 500
  const animationStartTime = Date.now()

  openAnimationTask.value?.cancel()
  openAnimationTask.value = new CancellableTask(async task => {
    selectIcon()
    makeWindowActive()

    while (!task.isCancelled) {
      await task.nextAnimationFrame()
      openAnimationProgress.value = (Date.now() - animationStartTime) / animationDuration

      if (openAnimationProgress.value >= 1) {
        openAnimationProgress.value = 1
        break;
      }
    }
  })
}
</script>

<template>
  <div class="icon-and-window">
    <Icon class="icon"
          :iconSrc="props.iconSrc"
          :name="props.name"
          :selected="iconSelected"
          :open="iconOpen"
          @mousedown.prevent.stop="selectIcon"
          @click.stop.prevent="animateOpen" />

    <div class="window-container" ref="windowElement" @mousedown.capture="makeWindowActive">
      <div class="open-animation">
        <template v-for="i in NUM_ANIMATION_BOXES" :key="i">
          <div class="outline-box" :style="openAnimationBoxStyle(i-1)"></div>
        </template>
      </div>
      <Window class="window"
              :title="props.name"
              :style="windowStyle()"
              :active="windowActive"
              @title-bar-mousedown="titleBarMouseDown"
              @close="windowClosePressed()">
        <slot />
      </Window>
    </div>
  </div>

</template>

<style>
.window-container {
  position: relative;
  pointer-events: none;
  z-index: v-bind('windowIndex == null ? "auto" : windowIndex');
}
.open-animation {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}
.outline-box {
  border: 1px solid black;
  /* background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23333' stroke-width='3' stroke-dasharray='1%2c1' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e"); */
}
.icon {
  position: absolute;
  left: calc(50% - 16px);
  top: calc(50% - 16px);
}
</style>
