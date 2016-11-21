---
layout: work
title: Tide
description: The Python IDE for Tingbot
client: Tingbot
technology: Javascript, Electron, Python, Mac, Windows
date: Jan 2016
date_range: Feb 2016 - Ongoing
image: /img/tide/tide-and-simulator.png
links:
- name: Tide download
  icon: globe
  url: http://tingbot.com/tide
- name: Github
  icon: github
  url: http://github.com/tingbot/tide-electron
---

![]({{page.image}})

Software development is notoriously difficult to get started. On top of new concepts, peculiar syntax, and pedantic compilers, beginners often also have to deal with unfamiliar workflows on the command line. It's a hell of a steep learning curve, and it means that only the most determined get a chance to do the fun bit - making something!

With [Tingbot](/work/tingbot/), we wanted to improve this experience. Taking inspiration from Arduino (a platform where many artists make a programming debut) we created a really simple Python IDE.

Tide lets you get straight to the code - the installation is self-contained, and each document starts as a functional 'Hello World' Tingbot app written in 5 lines of Python code.

These apps run immediately on the built-in simulator. Alternatively, if a Tingbot is nearby, it can be selected from the dropdown menu and the app will run there. No terminal, no SSH, just coding!

We've still got a long way to go, but we're well on the way to building a great beginner IDE for a great beginner language - Python.

---

Tide was originally a Cocoa app for macOS, but it was subsequently ported to **Javascript** using the **Electron** framework so that it could be cross-platform.

It is built using the excellent Vue.js framework.

Tide is developed with the help of some of our Kickstarter backers on [Github](http://github.com/tingbot/tide-electron).
