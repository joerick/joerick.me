<template>
  <div class="theme-container">
    <div class="bg"></div>
    <div class="theme-content">
      <Content />
    </div>
  </div>
</template>

<style scoped>
@import '../assets/chicago-webfont/stylesheet.css';

.theme-content {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 13px;
  letter-spacing: 0.038em;
  color: black;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-image: url(../assets/bg-tile.png);
  background-size: 2px 2px;
  background-repeat: repeat;
}
.theme-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

<style>
ul {
  margin: 0.5em 0;
  padding-left: 1em;
}
li {
  margin: 0.5em 0;
}
p {
  margin: 0.5em 0;
}
</style>
