---
layout: work
title: Tingbot
description: A fully-integrated app platform for Raspberry Pi
client: Side project with NORD collective
technology: Linux, Raspberry Pi, Python
date: Jan 2016
date_range: Sept 2014 - Ongoing
image: /img/tingbot/tingbot-on-blue.jpg
links:
- name: tingbot.com
  icon: globe
  url: http://tingbot.com/
- name: Documentation
  icon: book
  url: http://docs.tingbot.com/
- name: Github
  icon: github
  url: http://github.com/tingbot/
---

![]({{page.image}})

Tingbot is a creative app platform for the Raspberry Pi.

We are all big fans of the Pi - it's a tiny, inexpensive computer that can be deployed to do any number of amazing things. The problem faced by most Raspberry Pi owners is the learning curve they face when starting a project. After hooking the Pi up to a computer monitor and a USB keyboard and mouse, the user is then faced with desktop Linux - an unfamiliar environment, with different apps to learn and master.

Tingbot's approach is different - we treat the Raspberry Pi as a _target device_ for apps written on the user's computer, allowing the user to remain in a familiar and productive environment and get straight to what matters - [writing the code](/work/tide)!

<div class='gfyitem' data-id='DamagedSecretAmericanindianhorse'></div>

#### Tingbot OS

I am responsible for the software side of Tingbot. Tingbot runs a custom operating system, based on Raspbian. The operating system is responsible for

- setting up on first boot without user interaction
- connecting to wifi
- providing the home screen, a means to navigate between apps and access settings
- keeping one app running at all times
- handling button combos to return to the home screen
- updating itself over the internet

The operating system is available as a prebuilt SD card image and DEB files are available for live system upgrades. The SD card images are built using Travis CI in a QEMU virtual machine.

#### The tingbot-python libraries

To make app development simple to learn, I developed our own Python libraries covering the basic functionality of Tingbot with simple, consistent APIs. Apps run on a simple runloop, handling events and drawing to the screen when required.

```python
import tingbot
from tingbot import *

@every(seconds=1/30.0)
def loop():
    screen.fill(color='white')
    screen.text('Hello, world!')

tingbot.run()
```

Events are handled using decorated functions that are attached to the main run loop, so a drawing app is as simple as:

```python
import tingbot
from tingbot import *

screen.fill(color='white')

@touch()
def on_touch(xy):
    screen.rectangle(xy=xy, size=(6, 6), color='blue')

tingbot.run()
```

More information can be found in the [docs](http://docs.tingbot.com/).

#### Tide (the Tingbot IDE)

A key part of Tingbot is the development experience - for that, we made our own IDE. It's covered in more detail [here](/work/tide).

#### Open source

All of our software on the project is [open source and available on Github](http://github.com/tingbot).
