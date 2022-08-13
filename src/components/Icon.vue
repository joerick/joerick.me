<template>
  <a class="icon" :class="{selected, open}" :href="href" @click="click">
    <img :src="iconSrc" class="image">
    <div class="name">
      <span class="bg">
        {{ name }}
      </span>
    </div>

    <svg width="0" height="0" style="position: absolute;">
      <defs>
        <filter id="icon-open-filter" x="0" y="0" width="100%" height="100%">
          <!-- <feGaussianBlur in="SourceGraphic" stdDeviation="5" /> -->
          <feImage :href="openFileTileDeselected" result="tile" width="4" height="2"/>
          <feTile in="tile" x="0" y="0" result="texture" />

          <feMorphology in="SourceAlpha" result="outline" operator="dilate" radius="1"></feMorphology>
          <feMorphology in="SourceAlpha" result="inset" operator="erode" radius="1"></feMorphology>

          <feComposite in="texture" in2="inset" operator="in" result="texturedIcon" />

          <feMerge>
            <feMergeNode in="SourceAlpha" />
            <feMergeNode in="texturedIcon" />
          </feMerge>
        </filter>

        <filter id="icon-open-selected-filter" x="0" y="0" width="100%" height="100%">
          <!-- <feGaussianBlur in="SourceGraphic" stdDeviation="5" /> -->
          <feImage :href="openFileTile" result="tile" width="4" height="2"/>
          <feTile in="tile" x="0" y="0" result="texture" />

          <feMorphology in="SourceAlpha" result="outline" operator="dilate" radius="1"></feMorphology>
          <feMorphology in="SourceAlpha" result="inset" operator="erode" radius="1"></feMorphology>

          <feComposite in="texture" in2="inset" operator="in" result="texturedIcon" />

          <feMerge>
            <feMergeNode in="SourceAlpha" />
            <feMergeNode in="texturedIcon" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  </a>
</template>

<script lang="ts">
import openFileTile from "../assets/open-file-tile.png"
import openFileTileDeselected from "../assets/open-file-tile-deselected.png"
export default {
  props: {
    iconSrc: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: false,
      default: '',
    },
    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
    open: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  data() {
    return {
      openFileTile,
      openFileTileDeselected,
    }
  },
  methods: {
    click(event) {
      if (this.href) {
        event.stopPropagation()
      }
      this.$emit('click', event)
    }
  },
}
</script>

<style scoped>
a.icon {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}
a.icon {
  text-decoration: none;
}
.image {
  width: 32px;
}
.open .image {
  filter: url(#icon-open-filter);
}
.open.selected .image {
  filter: url(#icon-open-selected-filter);
}
.name {
  text-align: center;
  font-size: 11px;
}
.name span.bg {
  background: white;
  padding: 0 2px;
}
.selected .name span.bg {
  background: black;
  color: white;
}
</style>
