<script setup lang="ts">
import Window from './Window.vue'
import Icon from './Icon.vue'
import DesktopIconAndWindow from './DesktopIconAndWindow.vue'
import DitherImage from './DitherImage.vue'

import githubIcon from '../assets/icons/github.png'
import twitterIcon from '../assets/icons/twitter.png'
import instagramIcon from '../assets/icons/instagram.png'
import waveIcon from '../assets/icons/wave.png'
import docIcon from '../assets/icons/doc.png'
import photoIcon from '../assets/icons/photo.png'
import folderIcon from '../assets/icons/folder.png'
import mugshot from '../assets/mug.jpg'

import { desktopWindow, windowController } from './models'
import { onMounted } from 'vue'

export interface Props {
  posts: {
    name: string
    url: string
  }[]
}

const props = defineProps<Props>()

const mainWindowModel = {id: 'Me', selectedIcon: null}
windowController.activeWindow = mainWindowModel
windowController.windowOrder = [mainWindowModel]

</script>

<template>
  <div class="index" @click.stop="desktopWindow.selectedIcon = null">
    <div class="bottom-left-icons">
      <Icon :iconSrc="githubIcon"
            name="GitHub"
            class="icon github"
            href="https://github.com/joerick/" />

      <Icon :iconSrc="twitterIcon"
            name="Twitter"
            class="icon twitter"
            href="https://twitter.com/joerick/" />

      <Icon :iconSrc="instagramIcon"
            name="Instagram"
            class="icon instagram"
            href="https://instagram.com/joerick/" />
    </div>


    <DesktopIconAndWindow name="Posts"
                          class="posts-window"
                          :containingWindow="desktopWindow"
                          :iconSrc="folderIcon"
                          :initialIconOffset="{x: 0, y: 50}"
                          :initialWindowOpen="false">
      <div class="folder-contents">
        <Icon v-for="post in props.posts"
              :iconSrc="docIcon"
              :name="post.name"
              class="icon"
              :href="post.url"
              :staticLayout="true" />
      </div>
    </DesktopIconAndWindow>

    <DesktopIconAndWindow name="Curriculum Vitae"
                          class="cv-window"
                          :iconSrc="docIcon"
                          :containingWindow="desktopWindow">
      <div class="cv-padding">
        <div class="cv-table">
          <div class="date">2017-now</div>
          <div class="what">
            Founded <a href="https://nordprojects.co">Nord Projects</a> - a
            design and technology consultancy
          </div>

          <div class="date">2014-2016</div>
          <div class="what">
            Founded and ran <a href="https://getmixim.com">Mixim</a> - a
            software startup building collaboration software for musicians
          </div>

          <div class="date">2013-2018</div>
          <div class="what">
            Software boffin for <a href="https://tingbot.com">Tingbot</a>
            - a Raspberry Pi device that makes writing apps fun and creative
          </div>

          <div class="date">2010-2014</div>
          <div class="what">
            Freelance software engineer and musician/sound engineer
          </div>

          <div class="date">2006-2010</div>
          <div class="what">
            1st class Masters (BA MEng)<br>
            Engineering<br>
            University of Cambridge
          </div>
        </div>
      </div>
    </DesktopIconAndWindow>

    <DesktopIconAndWindow name="Photo"
                          class="photo-window"
                          :containingWindow="desktopWindow"
                          :iconSrc="photoIcon">
      <DitherImage class="mugshot" :imageSrc="mugshot" />
    </DesktopIconAndWindow>

    <DesktopIconAndWindow name="Me"
                          :iconSrc="waveIcon"
                          :containingWindow="desktopWindow"
                          class="me-window">
      <div class="me-padding">
        <h2>Hi! I'm Joe.</h2>
        <p style="margin-bottom: 0.7em">
          I'm a nerd in my 30s living and working in London. I make things with technology. I'm obsessed with the interface—how code talks, how systems work together, but most importantly, the interface between technology and people: the user interface.
        </p>
        <ul>
          <li>I design and make things at <a href="https://nordprojects.co">Nord Projects</a> with my friends Ben Pawle and Mike Colville.</li>
          <li>I write open source code like <a href="https://github.com/pypa/cibuildwheel">cibuildwheel</a> and <a href="https://github.com/joerick/pyinstrument">pyinstrument</a>.</li>
          <li>I play music every now and again.</li>
        </ul>
      </div>
    </DesktopIconAndWindow>

    <div class="scroll-end-marker"></div>
  </div>
</template>

<style scoped lang="scss">
.index {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  @media (max-width: 768px) {
    overflow-y: auto;
  }
}
.photo-window {
  position: absolute !important;
  top: 40px;
  left: 510px;
  top: calc(
    max(
      50vh - 256px,
      20px
    )
  );
  left: calc(
    min(
      50vw + 10px,
      100vw - 255px - 20px
    )
  );
  width: 255px;

  @media (max-width: 768px) {
    top: 20px;
    left: unset;
    right: 10px;
    max-width: 80%;
  }
}
.me-window {
  position: absolute !important;
  top: 160px;
  left: 67px;
  top: calc(
    max(
      50vh - 134px,
      20px
    )
  );
  left: calc(
    max(
      50vw - 424px,
      20px
    )
  );
  width: 450px;
  @media (max-width: 768px) {
    top: 250px;
    left: 20px;
    width: 351px;
    max-width: 90%;
  }
}
.cv-window {
  position: absolute !important;
  bottom: 20px;
  left: 567px;
  bottom: calc(
    max(
      50vh - 251px,
      20px
    )
  );
  left: calc(
    min(
      50vw + 65px,
      100vw - 368px - 20px
    )
  );
  width: 368px;
  @media (max-width: 768px) {
    max-width: 80%;
    bottom: unset;
    top: 580px;
    left: 40px;
  }
}

.posts-window {
  position: absolute !important;
  bottom: calc(
    max(
      50vh - 196px,
      20px
    )
  );
  left: calc(
    min(
      50vw - 255px - 20px,
      100vw - 255px - 20px
    )
  );
  width: 400px;
  @media (max-width: 768px) {
    top: 960px;
    left: 50%;
    bottom: unset;
    transform: translateX(-50%);
    max-width: 90%;
  }
}

.folder-contents {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;
  padding: 10px;

  @media (max-width: 768px) {
    // top: 20px;
    // left: unset;
    // right: 10px;
    grid-template-columns: 1fr 1fr;
    max-width: 80%;
  }
}

.me-padding {
  padding: 12px 12px;
  padding-right: 19px;
  padding-bottom: 17px;
}
.me-padding :first-child {
  margin-top: 0;
}

.mugshot {
  width: 100%;
  padding-bottom: 100%;

  border: 1px solid white;
  display: block;
  box-sizing: border-box;
}
.cv-table {
  padding: 15px 12px;
  font-size: 11px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px 25px;
}
.bottom-left-icons {
  position: absolute;
  bottom: 88px;
  left: 83px;
  left: calc(
    max(
      50vw - 370px,
      60px
    )
  );
  bottom: calc(
    max(
      50vh - 168px,
      90px
    )
  );
  @media (max-width: 768px) {
    bottom: unset;
    top: 980px;
    left: 60px;
    margin-bottom: 200px;
    // right: 10px;
  }
}
.icon.github {
  position: absolute;
  left: -25px;
  top: -26px;
  @media (max-width: 768px) {
    left: 0;
    top: 0;
  }
}
.icon.twitter {
  position: absolute;
  left: -19px;
  top: 26px;
  @media (max-width: 768px) {
    left: 100px;
    top: 0;
  }
}
.icon.instagram {
  position: absolute;
  left: 41px;
  top: 2px;
  @media (max-width: 768px) {
    left: 200px;
    top: 0;
  }
}
.scroll-end-marker {
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 1200px;
    left: 0;
    width: 10px;
    height: 10px;
  }
}


</style>
