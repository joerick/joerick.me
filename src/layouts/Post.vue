<script setup lang="ts">
import Window from '../components/Window.vue'
const props = defineProps<{title: string}>()

function windowClosePressed() {
  window.location.href = '/'
}
</script>

<template>
  <div class="post-container">
    <div class="post-bg"></div>
    <Window class="window"
            :title="props.title"
            :active="true"
            @close="windowClosePressed()">
      <div class="content-padding">
        <slot />
      </div>
    </Window>
  </div>
</template>

<style scoped lang="scss">
.post-container {
  position: relative;
  padding: 2vw;
  min-height: 100%;

  @media (max-width: 768px) {
    padding: 0.3em 0.3em;
  }
}
.post-bg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, rgba(128, 128, 128, 0.0), rgba(80, 80, 80, 0.6))
}
.window {
  max-width: 840px;
  margin: 0 auto;
}
.content-padding {
  padding: 40px 20px;
  max-width: 700px;
  margin: 0 auto;
  @media (max-width: 768px) {
    padding:10px 15px;
  }
}
</style>
