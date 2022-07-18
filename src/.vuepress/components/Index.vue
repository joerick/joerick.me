<template>
  <div class="index">
    <div class="bottom-left-icons">
      <Icon :iconSrc="require('../assets/icons/github.png')"
            name="GitHub"
            class="icon github"
            href="https://github.com/joerick/" />

      <Icon :iconSrc="require('../assets/icons/twitter.png')"
            name="Twitter"
            class="icon twitter"
            href="https://twitter.com/joerick/" />

      <Icon :iconSrc="require('../assets/icons/instagram.png')"
            name="Instagram"
            class="icon instagram"
            href="https://instagram.com/joerick/" />
    </div>

    <Window title="Curriculum Vitae"
            class="cv-window"
            :active="false">
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
    </Window>

    <Window title="Photo"
            class="photo-window"
            :active="false">
      <img class="mugshot" src="../assets/mug.png" style="">
    </Window>

    <Window title="Me"
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
    </Window>
  </div>
</template>

<style scoped>
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
}

.me-padding {
  padding: 12px 12px;
  padding-right: 19px;
  padding-bottom: 17px;
}
.me-padding :first-child {
  margin-top: 0;
}

img.mugshot {
  width: 100%;

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
      50vw - 401px,
      60px
    )
  );
  bottom: calc(
    max(
      50vh - 198px,
      60px
    )
  );
}
.icon.github {
  position: absolute;
  left: -25px;
  top: -26px;
  transform: translate(-50%, -50%);
}
.icon.twitter {
  position: absolute;
  left: -19px;
  top: 26px;
  transform: translate(-50%, -50%);
}
.icon.instagram {
  position: absolute;
  left: 41px;
  top: 2px;
  transform: translate(-50%, -50%);
}

</style>
