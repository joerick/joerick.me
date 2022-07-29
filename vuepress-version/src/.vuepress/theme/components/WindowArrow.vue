<template>
  <svg width="16" height="16" viewBox="0 0 16 16">
    <g fill="none" fill-rule="evenodd">
      <rect width="16" height="16" fill="#000"/>
      <rect width="14" height="14" x="1" y="1" fill="#FFF"/>

      <polygon v-if="direction == 'up'" stroke="#000" stroke-linejoin="bevel" points="1.5 8.5 7.5 2.5 13.5 8.5 10.5 8.5 10.5 12.5 4.5 12.5 4.5 8.5"/>
      <polygon v-if="direction == 'down'" stroke="#000" stroke-linejoin="bevel" points="1.5 9.5 7.5 3.5 13.5 9.5 10.5 9.5 10.5 13.5 4.5 13.5 4.5 9.5" transform="rotate(-180 7.5 8.5)"/>
      <polygon v-if="direction == 'left'" stroke="#000" stroke-linejoin="bevel" points=".5 8.5 6.5 2.5 12.5 8.5 9.5 8.5 9.5 12.5 3.5 12.5 3.5 8.5" transform="rotate(-90 6.5 7.5)"/>
      <polygon v-if="direction == 'right'" stroke="#000" stroke-linejoin="bevel" points="3.5 8.5 9.5 2.5 15.5 8.5 12.5 8.5 12.5 12.5 6.5 12.5 6.5 8.5" transform="rotate(90 9.5 7.5)"/>

    </g>
  </svg>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: 'up',
    },
  },
}
</script>
