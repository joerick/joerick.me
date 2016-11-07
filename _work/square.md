---
layout: work
title: Square
description: A Mac-based hotel TV system, providing a standard lean-back interface alongside the ability for the guest to browse the web or use Mac apps.
client: Square [i] International (now RoomNetTV)
technology: Cocoa, CoreAnimation, Objective-C, Mac, Smalltalk, Django
date: feb 2012
date_range: Feb 2012 - Feb 2014
image: /img/square/in-hotel-room.jpg
---

![]({{page.image}})

The Square [i] system is a premium hotel TV solution - with the standard features of a ‘smart’ TV system (welcome screen, TV, radio, movie rental) alongside a fully-featured guest account on Mac OS X, so the guest can browse the web and use apps, such as Skype.

The technology of this project is particularly interesting. This was a v2.0 ground-up rewrite, mainly because v1.0 had stability issues caused by the video decoder. This led to a two-process design - a backend, holding all the state of the system, communicating with a stateless UI process via unidirectional JSON messages. The UI process presented content to the screen using CoreAnimation, so all graphics were GPU accelerated and ran at 1080p, 60fps.

<div style='position:relative;padding-bottom:57%'><iframe src='https://gfycat.com/ifr/DenseAstonishingBullmastiff' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' allowfullscreen></iframe></div>

---

I was part of this project through the whole development cycle. I was involved with the UI design, UI implementation in Objective-C, integration of the VLC video player, and implementation of the backend. I also wrote a CMS in Django for hotel management to customise the system, or adapt the branding and content for conferences.
