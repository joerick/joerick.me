<template>
  <a class="icon" :href="href">
    <img :src="iconSrc" class="image">
    <div class="name">
      <span class="bg">
        {{ name }}
      </span>
    </div>
  </a>
</template>

<script>
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
    }
  }
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
  height: 32px;
}
.name {
  text-align: center;
  font-size: 11px;
}
.name span.bg {
  background: white;
  padding: 0 2px;
}
</style>
