---
title: 'LiquidJS SSTI to Arbitrary File Read'
date: 2021-10-26
permalink: /posts/liquidjs-ssti-to-arbitrary-file-read
tags:
  - Bug Bounty
  - SSTI
  - LiquidJS
  - Javascript
---

{% raw %}
Hello there. I have been thinking about starting a blog about cybersecurity since the last few months, in order to share my learning process and my experiences as a beginner in this field. I have finally decided to do it, and I thought it would be great to start by writing about my first bug bounty, which I earned a couple of months ago. Since the vulnerability hasn't been disclosed, I won't be able to give as much information as I would like, but I hope you like it anyway :)

This summer, I decided to try my luck with bug bounties as I had already gained a decent ammount of experience with web application vulnerabilities. I spent some days just looking at some public bug bounty programs, until I found one or two that were affordable for me. They offered interesting functionalities to test for bugs (at least more than a simple online shop), didn't pay bounties too big so they were not attracting attention of more experienced hackers and hadn't received a valid report for 9 months. So I opened Burp and started clicking around.

After some hours of figuring out how the applications worked and what was the user workflow, I stumbled upon an interesting feature of one of them. It offered a client and an admin portal, where administrators could manage clients, services provided, etc. One of the functionalities of the administrator panel was to create and edit email templates, so then the admin could use them to communicate with a set of clients all at once. I immediately thought of an old [vulnerability on Uber](https://hackerone.com/reports/125980/) I once read about, where an SSTI was found on the rendering engine of email templates, so I started inspecting that. When I open the template editor, first thing I saw was that the default value for the header was `{{account.logo}}`, so I started to play around.

The email editor had a button to test the template which sent the result directly to the admin email address. This way, I could test easily the editor for any vulnerabilities. I started by submitting `{{account}}`, which produced an email sent to me with `[object Object]`. I was very excited since that meant I was able to execute other code than the one which came with the default template. And it was because of this initial excitement that I made the mistake of assuming the technology behind the template engine without actually checking it. `[object Object]` is the raw representation of a JavaScript object and, as I had recently worked with SSTIs in Nunjucks, I directly assumed it was Nunjucks. I didn't think it twice, it seemed so clear to me. I went to an [article I had recently read about it](http://disse.cting.org/2016/08/02/2016-08-02-sandbox-break-out-nunjucks-template-engine) and started trying to get RCE. I adapted the payload in the article to my case and submitted `{{account.constructor(function(){return 123})()}}` but no email was sent. Also tried `account.constructor.constructor('return 123')()` but again, no email. Then, I started testing a bit more, and found that `{{7*7}}` dind't work either. However, by submitting `{{account.constructor}}` or `{{account.constructor.constructor}}` I was receiving `function Object() { [native code] }` and `function Function() { [native code] }` respectively. It didn't make much sense for me. I could reach objects and functions but I couldn't really execute them? I couldn't perform arithemtic operations either? I left it there and took a small break.

![](/files/2021-10-26-tries_screenshot.png)

After one or two days I suddently thought that I didn't actually check if the template engine was Nunjucks or if it was any other NodeJS template engine. I serched for the most common NodeJS template engines that used `{{ }}` as tags and started testing. However, I was still very nervous and excited and was not thinking clearly. I didn't research too much and none of the engines I found were working either. I tried Mustache, Handlebars, Atpl... I was getting very frustrated and knew that I had to take a bigger break since I was not used to bug hunting. I learnt that this can be way much more frustrating than any CTF or wargame I had played out there.

Summer ended and University started, so I knew I would have less free time in a matter of weeks. And it still annoyed me not having been able to actually find the real bug and exploit it. So one day I just started reading my notes about it, recreating all the steps I took. When I got to the part where I "did some research about NodeJS template engines", I saw that it was very poor research, so I decided to retry again, at least to actually understand what was going on behind that template engine.

This time, I did my research properly by testing each possible option. I finally discarded Nunjuck by testing all syntax it offerede and did the same with other common template engines for NodeJS. At the end, it turned to be [LiquidJS](https://liquidjs.com/), a templte engine similar to [Liquid](https://github.com/Shopify/liquid) used by Shopify or GitHub pages. LiquidJS does not allow real code execution such as other engines. In addition, I couldn't find any example on the Internet about exploiting SSTI on LiquidJS, so I had to find my own way
(in fact, when writing this article I found [this issue](https://github.com/harttle/liquidjs/issues/131) which explains this problematic). Looking at the documentation, I found the deprecated `include` tag, which allows to render predefined templates. However, an attacker can also include another file, even if it's not a real template, giving access to the whole file system of the server. In the end, I just had to submit `{% include '/etc/passwd' %}` in order to receive in my email all the contents of the `/etc/passwd` file.

![](/files/2021-10-26-poc_screenshot.jpeg)

I wasn't able to get RCE, however, I got Arbitrary File Read and a bounty of $1500, which is pretty good for the first time. Thanks for reading it and I hope you liked it :)
{% endraw %}