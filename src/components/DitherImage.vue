<template>
  <div class="dither-image" ref="container">
    <img :src="imageSrc" @load="draw" ref="image" />
    <canvas ref="canvas" />
  </div>
</template>

<script lang="ts">
import ObserveSizeMixin from './mixins/ObserveSizeMixin'
import {colorDither, colorDitherAtkinson16Bit} from './dithering'

export default {
  props: {
    imageSrc: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.draw()
  },
  methods: {
    draw: function () {
      const canvas = this.$refs.canvas
      const width = this.$refs.canvas.offsetWidth
      const height = this.$refs.canvas.offsetHeight

      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr

      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const image = this.$refs.image
      if (!image.complete) return

      ctx.drawImage(this.$refs.image, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      if (window.devicePixelRatio == 1) {
        colorDitherAtkinson16Bit(imageData, {exposureAdjust: 1.2, contrastAdjust: 1.1})
      } else {
        colorDither(imageData, 127, "atkinson", 2, 1)
      }
      ctx.putImageData(imageData, 0, 0)
    }
  },
  watch: {
    elementSize() {
      this.draw()
    }
  },
  mixins: [ObserveSizeMixin],
}
</script>

<style scoped>
.dither-image {
  position: relative;
}
.dither-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.dither-image canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
