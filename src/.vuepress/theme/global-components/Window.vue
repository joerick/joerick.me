<template>
  <div class="window">
    <div class="title-bar">
      <svg class="title-bar-lines" width="100%" height="11" viewBox="0 0 6 11" preserveAspectRatio="none">
        <rect x="0" y="0" width="6" height="1" fill="black" />
        <rect x="0" y="2" width="6" height="1" fill="black" />
        <rect x="0" y="4" width="6" height="1" fill="black" />
        <rect x="0" y="6" width="6" height="1" fill="black" />
        <rect x="0" y="8" width="6" height="1" fill="black" />
        <rect x="0" y="10" width="6" height="1" fill="black" />
      </svg>
      <svg class="title-bar-left" width="13" height="11" viewBox="0 0 13 11">
        <rect x="0" y="0" width="13" height="11" fill="white" />
        <rect x="1" y="0" width="11" height="11" fill="black" />
        <rect x="2" y="1" width="9" height="9" fill="white" />
      </svg>
      <svg class="title-bar-right" width="13" height="11" viewBox="0 0 13 11">
        <rect x="0" y="0" width="13" height="11" fill="white" />
        <rect x="1" y="0" width="11" height="11" fill="black" />
        <rect x="2" y="1" width="9" height="9" fill="white" />
        <rect x="1" y="0" width="6" height="6" fill="black" />
        <rect x="2" y="1" width="4" height="4" fill="white" />
      </svg>

      <div class="title-bar-title">
        <span class="title-bar-title-bg">{{ title }}</span>
      </div>

      <svg class="title-bar-line" height="1" viewBox="0 0 10 1" preserveAspectRatio="none">
        <rect x="0" y="0" width="10" height="1" fill="black" />
      </svg>
    </div>
    <slot />
    <div class="scroll-bar-right">
      <WindowArrow class="up-arrow" direction="up"/>
      <WindowArrow class="down-arrow" direction="down"/>
    </div>
    <div class="scroll-bar-bottom">
      <WindowArrow class="left-arrow" direction="left"/>
      <WindowArrow class="right-arrow" direction="right"/>
    </div>
    <svg class="bottom-left-button" width="16" height="16" viewBox="0 0 16 16">
      <g fill="none" fill-rule="evenodd">
        <rect width="16" height="16" fill="#000"/>
        <rect width="14" height="14" x="1" y="1" fill="#FFF"/>
        <rect width="9" height="9" x="5" y="5" fill="#000"/>
        <rect width="7" height="7" x="6" y="6" fill="#FFF"/>
        <rect width="7" height="7" x="3" y="3" fill="#000"/>
        <rect width="5" height="5" x="4" y="4" fill="#FFF"/>
      </g>
    </svg>

  </div>
</template>

<script>
import ObserveSizeMixin from '../mixins/ObserveSizeMixin'
import WindowArrow from '../components/WindowArrow.vue'

export default {
  props: {
    title: {
      type: String,
      default: 'Window'
    },
  },
  mixins: [ObserveSizeMixin],
  components: {
    WindowArrow,
  },
}
</script>

<style scoped>

.window {
  position: relative;
  border-radius: 2px;
  border: 1px solid black;
  background-color: white;
  box-shadow: 1px 1px 0 black;
  padding: 15px;
  padding-top: 18px;
}

.title-bar {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 18px;

  user-select: none;
}

.title-bar-lines {
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  width: calc(100% - 6px);
}
.title-bar-left {
  position: absolute;
  top: 3px;
  left: 9px;
}
.title-bar-right {
  position: absolute;
  top: 3px;
  right: 9px;
}
.title-bar-title {
  text-align: center;
  font-family: Chicago, serif;
  font-size: 12px;
  letter-spacing: 0.8px;
  position: relative;
  padding-top: 2px;
}
.title-bar-title-bg {
  background: white;
  padding: 0px 5px;
}
.title-bar-line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
}

.scroll-bar-right {
  position: absolute;
  right: 0;
  top: 17px;
  bottom: 14px;
  width: 14px;
  background-color: white;
  border-left: 1px solid black;
}
.scroll-bar-right .up-arrow {
  position: absolute;
  top: 0;
  left: -1px;
}
.scroll-bar-right .down-arrow {
  position: absolute;
  bottom: 0;
  left: -1px;
}

.scroll-bar-bottom {
  position: absolute;
  left: -1px;
  right: 14px;
  bottom: 0;
  height: 14px;
  background-color: white;
  border-top: 1px solid black;
}
.scroll-bar-bottom .left-arrow {
  position: absolute;
  top: -1px;
  left: 0;
}
.scroll-bar-bottom .right-arrow {
  position: absolute;
  top: -1px;
  right: 0;
}
.bottom-left-button {
  position: absolute;
  bottom: -1px;
  right: -1px;
}
</style>
