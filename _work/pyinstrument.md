---
title: Pyinstrument
description: A Python call-stack profiler for performance debugging
client: Open source
technology: Python
date: Apr 2014
date_range: Apr 2014 - Ongoing
image: /img/pyinstrument/screenshot.jpg
---

![]({{page.image}})

While working on the API server for Mixim, I needed to investigate why a certain call was slow. I fired up cProfile, which is Python’s built-in profiler and recorded the request. The output I got was essentially useless - firstly, it lists the functions deep inside the libraries I was using, requiring me to guess about the call tree that led to that point, and secondly, it records CPU time, so missing any time that is waiting on database or other web requests. Given Python excels at being a ‘glue’ language, wall clock time was much more useful to me.

Pyinstrument is my answer to this. Pyinstrument is a statistical profiler, it samples the entire call stack every 1ms. This allows the developer to see performance problems with the whole call tree, rather than just the final function. It also provides a much clearer UI that lets the developer drill down to a slow section of code in a visual way.

Pyinstrument is open source software, and development happens on Github.
