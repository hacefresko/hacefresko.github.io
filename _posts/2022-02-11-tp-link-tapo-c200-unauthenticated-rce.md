---
title: 'TP-Link Tapo c200 Unauthenticated RCE'
date: 2022-02-11
permalink: /posts/tp-link-tapo-c200-unauthenticated-rce
tags:
  - IoT
  - Command Injection
  - TP-Link
  - CVE
header: 
  tweet-image: 2022-02-11/poc.png
  teaser: 2022-02-11/poc.png
---

{% raw %}
Hello there. Today I would like to share with you my first CVE, which corresponds to a command injection vulnerability found a couple months ago in the [TP-Link Tapo c200 camera](https://www.tp-link.com/us/home-networking/cloud-camera/tapo-c200/), that allows an attacker to take full control of the device with root privileges. It was assigned CVE-2021-4045 by the INCIBE, and you can check the official advisory [here](https://www.incibe-cert.es/en/early-warning/security-advisories/tp-link-tapo-c200-remote-code-execution-vulnerability). The vulnerability affects all firmware versions prior to 1.1.16 Build 211209 Rel. 37726N, so if you own this model, I suggest you update it. 

<img src="/images/2022-02-11/tapo_cam.jpeg" alt="tapo_cam" style="width: 300px;display: block;margin-left: auto;margin-right: auto;"/>

This post will be a summary of my research on this device and how it led to the discovery of this vulnerability. It has been an introduction for me to IoT and hardware hacking, but also to reverse engineering, so please don't be hard on me as there may be some mistakes. I also want to thank the cybersec community, since there was always a video, an article or something else that inspired me to learn or try new things whenever I got stuck. Finally, remember that failure is your best friend, although it sometimes makes you take six months for something you could have done in one or two if you would have read correctly the results of a shell command.

Anyway, let's start with the article. Thanks for reading and I hope you like it.

## Initial recon

Once I got the camera out of the box, I proceeded to configure it with my phone and my WiFi. It was fairly easy to do. I started to play with it and I was surprised that a 30€ IP camera has so many functionalities. It can record video and audio to an SD card, it can be moved almost 360º horizontally and like 90º vertically and it can even reproduce audio in real time from the phone app. 

My initial plan was just to scan some ports and try to find some vulnerabilities, and also to check how the WiFi configuration worked, since I was very interested in WiFi security at that time. I won't talk about the WiFi configuration, because after analyzing it with a custom `hostapd` + `dnsmasq` access point and `Wireshark`, I didn't' find anything interesting beyond common functionalities such as creating a wireless access point or connecting to one.

So, let's talk about the port scanning: 

    $ nmap -sV -p- 192.168.1.81

    Nmap scan report for C200_F81AB2.home (192.168.1.81)
    Host is up (0.022s latency).
    Not shown: 996 closed ports
    PORT     STATE SERVICE
    443/tcp  open  https
    554/tcp  open  rtsp
    2020/tcp open  xinupageserver
    8800/tcp open  sunwebadmin

As you can see, the device has some interesting open ports. First thing I tested was port 443. Although `nmap` clearly indicates that it uses `https`, when I initially did the scan, I just overlooked it and spent quite a long time thinking that port 443 was running `http`. Because of this, I only tested `http://192.168.1.81:443` instead of `https://192.168.1.81:443`, so the only thing I got was 400 responses. As I said in the introduction, this journey was full of failures. Regarding the other ports, the services running on them were totally unknown to me and I didn't find any clear information about them. At this moment, I ran out of known options, so it was time for further investigation.

## Getting a shell

Before buying the camera, I looked online for previous research on the device and, luckily, I found this [Github repository](https://github.com/nervous-inhuman/tplink-tapo-c200-re) where people were collaborating to reverse engineer it. [One of the issues](https://github.com/nervous-inhuman/tplink-tapo-c200-re/issues/1) explains how to get a shell through the [UART port](https://www.embedded.com/understanding-the-uart/), which I knew nothing about at the time. So I learned the basics and bought a [USB to TTL converter](https://www.amazon.es/gp/product/B07CQTC8P2/ref=ppx_yo_dt_b_asin_title_o09_s00?ie=UTF8&psc=1) to connect to it:

<img src="/images/2022-02-11/ARCELI.jpg" alt="USB_to_TTL" style="width: 400px;display: block;margin-left: auto;margin-right: auto;"/>

With the help of the [mentioned issue](https://github.com/nervous-inhuman/tplink-tapo-c200-re), I was able to open the device with a knife and a screwdriver and quickly locate the UART. After a couple of tries and a lot of patience, I finally managed to solder some wires to the pads:

<img src="/images/2022-02-11/first_conn.jpg" alt="first_conn" style="width: 400px;display: block;margin-left: auto;margin-right: auto;"/>

Then, it was time to test if the soldering was good enough for the data to be transmitted. I connected the wires to the USB adapter, taking into account that Rx of the UART goes to Tx of the adapter and vice versa, and connected the adapter to my computer. Again, thanks to the [mentioned issue](https://github.com/nervous-inhuman/tplink-tapo-c200-re), I knew the baud rate for the serial connection was 57600, so I executed `$ sudo screen /dev/tty.usbserial-0001 57600`, where `/dev/tty.usbserial-0001` is the USB port where the adapter is connected to, and powered on the device. I immediately started receiving data, great.

However, I didn't have a shell yet. What I was receiving was just the booting sequence of the device, which actually was the U-Boot bootloader. It looked something like this:

    U-Boot 2014.01-v1.2 (Jul 16 2021 - 18:41:10)

    Board: IPCAM RTS3903 CPU: 500M :rx5281 prid=0xdc02
    force spi nor mode
    DRAM:  64 MiB @ 1066 MHz
    Skipping flash_init
    Flash: 0 Bytes
    flash status is 0, 0, 0
    SF: Detected XM25QH64A with page size 256 Bytes, erase size 64 KiB, total 8 MiB
    Using default environment

    Autobooting in 1 seconds
    copying flash to 0x81500000
    flash status is 0, 0, 0
    SF: Detected XM25QH64A with page size 256 Bytes, erase size 64 KiB, total 8 MiB
    SF: 8388608 bytes @ 0x0 Read: OK

    [...]

By typing enter, we are asked to input an username and password. Again, thanks to that [Github issue](https://github.com/nervous-inhuman/tplink-tapo-c200-re), we know the credentials, so we can successfully login with with user `root` and password `slprealtek` and finally get a shell.

Once I knew the connection worked, I needed to make the soldering less fragile, since it broke twice in the process of actually getting the shell. I applied some hot melt silicone to secure all the wires and closed the device again, disconnecting all motors. Now, my testing unit was ready to go:

<div style="display: inline-block; text-align: center;">
<img src="/images/2022-02-11/definitive_conn.jpg" alt="definitive_conn" style="width: auto;height: 300px;"/>

<img src="/images/2022-02-11/final_device.jpg" alt="final_device" style="width: auto;height: 300px;"/>

<img src="/images/2022-02-11/final_setup.jpg" alt="final_setup" style="width: auto;height: 250;margin-top: 5px;"/>
</div>

## Exploring the device

Now that we have a shell, let's explore the device:

    root@SLP:~# uname -a
    Linux SLP 3.10.27 #1 PREEMPT Wed Nov 11 20:42:05 CST 2020 rlx GNU/Linux

    root@SLP:~# cat /etc/openwrt_version
    12.09-rc1

As we can see, this is an OpenWRT machine running Linux 3.10.27. Now let's check active processes and open ports:

    root@SLP:~# ps
    PID USER       VSZ STAT COMMAND
       1 root      2328 S    init
       2 root         0 SW   [kthreadd]
       3 root         0 SW   [ksoftirqd/0]
       4 root         0 SW   [kworker/0:0]
       5 root         0 SW<  [kworker/0:0H]
       6 root         0 SW   [kworker/u2:0]
       7 root         0 SW   [rcu_preempt]
       8 root         0 SW   [rcu_bh]
       9 root         0 SW   [rcu_sched]
      10 root         0 SW<  [khelper]
      11 root         0 SW<  [writeback]
      12 root         0 SW<  [bioset]
      13 root         0 SW<  [kblockd]
      14 root         0 SW   [khubd]
      15 root         0 SW   [kworker/0:1]
      16 root         0 SW   [kswapd0]
      17 root         0 SW   [fsnotify_mark]
      18 root         0 SW<  [crypto]
      27 root         0 SW   [kworker/u2:1]
      46 root         0 SW<  [deferwq]
      47 root         0 SW<  [kworker/0:1H]
     247 root      2328 S    -ash
     262 root         0 SW   [irq/27-gpio res]
     273 root         0 SW<  [cryptodev_queue]
     282 root       860 S    /sbin/hotplug2 --override --persistent --set-rules-f
     304 root       888 S    /sbin/ubusd
     325 root      8152 S    tp_manage
     357 root      3416 S    /usr/bin/ledd
     361 root      3408 S    /sbin/msglogd
     367 root      3220 S    /usr/sbin/netlinkd
     370 root      5468 S <  /usr/bin/system_state_audio
     379 root     10180 S    /usr/sbin/wlan-manager
     491 root      1636 S    /sbin/netifd
     492 root      1520 S    /usr/sbin/connModed
     494 root     11488 S    /usr/bin/dsd
     496 root      1532 S    /usr/sbin/connModed
     502 root      7640 S    /bin/cloud-service
     520 root      4360 S    /bin/cloud-brd -c /var/etc/cloud_brd_conf
     653 root     15020 S    /bin/cloud-client
     830 root      2320 S    /usr/sbin/telnetd -b 127.0.0.1
     861 root      3852 S    /usr/sbin/uhttpd -f -h /www -T 180 -A 0 -n 8 -R -r C
     870 root      6048 S    /usr/bin/relayd
     872 root      5948 S    /usr/bin/rtspd
     879 root      4612 S    /usr/bin/p2pd
     884 root     11152 S    /bin/dn_switch
     889 root      4180 S    /bin/storage_manager
     920 root     40940 S    /bin/cet
     956 root     32336 S    /bin/vda
     960 root      3808 S    /bin/wtd
     970 root     11288 S    /bin/nvid
    1019 root      2332 S    udhcpc -p /var/run/static-dhcpc.pid -s /lib/netifd/s
    1037 root         0 SW   [RTW_CMD_THREAD]
    1059 root      1212 S    wpa_supplicant -B -Dwext -iwlan0 -P/tmp/supplicant_p
    1089 root      2332 S    /usr/sbin/ntpd -n -p time.nist.gov -p 133.100.9.2 -p
    1103 root      3840 S    /usr/bin/motord
    1447 root      2324 R    ps

    root@SLP:~# netstat -natpu
    Active Internet connections (servers and established)
    Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
    tcp        0      0 0.0.0.0:8800            0.0.0.0:*               LISTEN      920/cet
    tcp        0      0 127.0.0.1:929           0.0.0.0:*               LISTEN      875/p2pd
    tcp        0      0 0.0.0.0:20002           0.0.0.0:*               LISTEN      325/tp_manage
    tcp        0      0 0.0.0.0:2020            0.0.0.0:*               LISTEN      969/nvid
    tcp        0      0 0.0.0.0:554             0.0.0.0:*               LISTEN      920/cet
    tcp        0      0 127.0.0.1:23            0.0.0.0:*               LISTEN      832/telnetd
    tcp        0      0 127.0.0.1:921           0.0.0.0:*               LISTEN      878/relayd
    tcp        0      0 127.0.0.1:922           0.0.0.0:*               LISTEN      877/rtspd
    tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN      863/uhttpd
    tcp        0      0 192.168.1.80:37380      52.19.66.90:443         ESTABLISHED 507/cloud-brd
    udp        0      0 0.0.0.0:20002           0.0.0.0:*                           325/tp_manage
    udp        0      0 0.0.0.0:38000           0.0.0.0:*                           1087/ntpd
    udp        0      0 0.0.0.0:3702            0.0.0.0:*                           969/nvid

We can see the processes behind those open ports seen in the `nmap` scan, such as `uhttpd` or `cet`. I focused specifically on the `uhttpd` process, since it's the one behind the `https` server (which at that point I still thought it was `http`) and I was already very familiar with `http` protocols. 

`uhttpd` is a web server made by OpenWRT to be used in embedded devices running this distribution. At this point, I wanted to know if I could get more information about it, something like the source code or, at least, the routes. I went to the [OpenWRT wiki](https://openwrt.org/) and learnt about `uhttpd` and OpenWRT in general. In OpenWRT machines, there is a system called [Unified Configuration Interface (UCI)](https://openwrt.org/docs/guide-user/base-system/uci), which is basically used to easily configure system services. Using this, we can get the `uhttpd` configuration:

    root@SLP:~# uci show | grep uhttpd
    ucitrack.@uhttpd[0]=uhttpd
    ucitrack.@uhttpd[0].init=uhttpd
    uhttpd.main=uhttpd
    uhttpd.main.listen_https=443
    uhttpd.main.home=/www
    uhttpd.main.rfc1918_filter=1
    uhttpd.main.max_requests=8
    uhttpd.main.cert=/tmp/uhttpd.crt
    uhttpd.main.key=/tmp/uhttpd.key
    uhttpd.main.cgi_prefix=/cgi-bin
    uhttpd.main.lua_prefix=/luci
    uhttpd.main.lua_handler=/usr/lib/lua/luci/sgi/uhttpd.lua
    uhttpd.main.script_timeout=180
    uhttpd.main.network_timeout=180
    uhttpd.main.tcp_keepalive=0
    uhttpd.px5g=cert
    uhttpd.px5g.days=3600
    uhttpd.px5g.bits=1024
    uhttpd.px5g.country=CN
    uhttpd.px5g.state=China
    uhttpd.px5g.location=China
    uhttpd.px5g.commonname=TP-Link
    upnpc.uhttpd=entry
    upnpc.uhttpd.proto=TCP
    upnpc.uhttpd.ext_port=80
    upnpc.uhttpd.desc=uhttpd

There are some interesting parameters here. First, `uhttpd.main.home` points to the server document root, so we may find some web server files. Next, `uhttpd.main.lua_handler` points to Lua handler script used to initialize the Lua runtime on server start, since `uhttpd` supports Lua scripts, so there may be more interesting files there. However, `/www` directory is empty and there is no `sgi` directory in `/usr/lib/lua/luci` nor `uhttpd.lua` file in the system. I kept trying to find anything about how this `uhttpd` instance worked but I found nothing, only configuration parameters pointing to nowhere. 

At this point, I knew that the solution to this was to directly analyze the `uhttpd` binary and reverse engineer it, but before that, I wanted to create a testing environment so I could know what was happening inside the web server when I made the requests, since the way the process was created, there was no output anywhere.

I tried running the command found in the output of the `ps` command for process 861: `/usr/sbin/uhttpd -f -h /www -T 180 -A 0 -n 8 -R -r C`. However, I got a lot of errors and couldn't make it work. Since I wasn't able to create the same `uhttpd` process in a different port, I tried to go after the missing output by checking the `/proc` entry for the process, in order to try to read them if they existed (as explained in [this video from PwnFunction](https://www.youtube.com/watch?v=6SA6S9Ca5-U)). But there was a big problem:

    root@SLP:~#sudo ls -l /proc/864/fd/
    lrwx------    1 root     root            64 Nov 10 22:44 0 -> /dev/null
    lrwx------    1 root     root            64 Nov 10 22:44 1 -> /dev/null
    lrwx------    1 root     root            64 Nov 10 22:44 2 -> /dev/null
    lrwx------    1 root     root            64 Nov 10 22:44 3 -> anon_inode:[eventpoll]
    lrwx------    1 root     root            64 Nov 10 22:44 4 -> socket:[1830]

All file descriptors for `stdin`, `stdout` and `stderr` were redirected to `/dev/null`, which is basically redirecting them to a black hole where they cannot be found. I was stuck and I didn't know what to do. Since I was already in the `/proc` entry, I started looking around as I didn't remember that `/proc` entries had that much information about a process and was curious about it. Thanks to this random curiosity I stumbled across the `environ` entry, which contains all environment variables for that process. One of these environment variables was `UHTTPD_ARGS=-h /www -T 180 -A 0 -n 8 -R -r C200 -C /tmp/uhttpd.crt -K /tmp/uhttpd.key -s 443`. I immediately realized that the command shown by `ps` was not correct and later found that it was because the UART shell didn't have enough width to display all characters. Yet another fail that made me learn new important things: never trust the output given by a UART port.

Now I could finally create another instance of `uhttpd` with the exact same parameters and no pipes to `/dev/null` in order to test the binary while reverse engineering it.

## Reverse engineering uhttpd with Ghidra

This was my first time using Ghidra. I had seen some videos and read some articles about it (thanks [stacksmashing](https://twitter.com/ghidraninja) and [liveoverflow](https://twitter.com/LiveOverflow) for the amazing and easy-to-digest content), but never really played with it, so this was a very good opportunity to learn. 

I opened the `uhttpd` binary and, after some trial and error, figured out that the language was MIPS32, little endian, with mips16e. Some function names came by default with the binary, but others didn’t. I also spent some time renaming functions since, apparently, Ghidra is usually confused with external functions and you get strange wrappers for them like:

<img src="/images/2022-02-11/strange_wrapper.png" alt="strange_wrapper" style="width: 400px;display: block;margin-left: auto;margin-right: auto;"/>

I looked at the `main` function and other important ones to figure out the logic of the binary and how it was structured. I found some interesting ones, already named, among which were `do_login` or `uh_slp_proto_request`. I will talk more about the last one later.

After this initial contact, I started looking for bugs. Since I'm a huge noob with overflow vulnerabilities, the first thing I did was to search for `system`, `exec` and `popen` calls, in order to check if there was any command injection vuln that I could easily exploit. And oh boy, I was lucky.

Function `exec_and_read_json` uses `popen` to execute commands:
 
<img src="/images/2022-02-11/exec_and_get_json.png" alt="exec_and_read_json" style="width: 450px;display: block;margin-left: auto;margin-right: auto;"/>

`exec_and_read_json` is used by 2 unnamed functions, which I named `set_language` and `wifi_connect`. They respectively deal with language and WiFi configuration (obviously). `wifi_connect` seems to parse single quotes (`'`), however, `set_language` doesn't. This means that if we can control the input for the `set_language` function, we can successfully inject our own commands.

<img src="/images/2022-02-11/wifi_connect.png" alt="wifi_connect" style="width: 500px;display: block;margin-left: auto;margin-right: auto;"/>

<img src="/images/2022-02-11/set_language.png" alt="set_language" style="width: 600px;display: block;margin-left: auto;margin-right: auto;"/>

Function `set_language` is used by `uh_slp_proto_request`, the function I mentioned before, which passes as input some parsed data received from the user.

<img src="/images/2022-02-11/main_func_1.png" alt="main_func_1" style="width: 600px;display: block;margin-left: auto;margin-right: auto;"/>

<img src="/images/2022-02-11/main_func_2.png" alt="main_func_2" style="width: 600px;display: block;margin-left: auto;margin-right: auto;"/>

To parse the user data, `uh_slp_proto_request` checks if it is a valid JSON object. Then, it gets a string value identified by key `"method"` and a dictionary value identified by `"params"` (at least that is what I think, since function call could not be resolved by Ghidra but seemed to work this way). Depending on the selected method, `uh_slp_proto_request` selects the function which will be called.

So, by sending `{"method": "setLanguage", "params":{}}` we successfully call the `set_language` function and pass `{}` as `language_json` parameter. Then, inside `set_language`, `language_json` object is converted to string and inserted directly into `"ubus call system_state_audio set_language \'%s\'"` to be executed. 

By submitting `{"method": "setLanguage", "params": {"payload": "'; touch poc;'"}}`, `ubus call system_state_audio set_language '{"payload": "'; touch poc;'"}'` will be executed, which actually contains 3 commands: `ubus call system_state_audio set_language '{"payload": "'`, `touch poc`, and `'"}'`. The second one gives us full code execution.

Now, `uh_slp_proto_request` is used by another unnamed function managing all requests, which I named `main_server_function`. If a request is valid (does not exceed maximum length, uses `http` or `https` depending on the server config, etc.), `main_server_function` checks if the URL contains `/cgi-bin/luci` or `/web-static`. If it doesn't, `uh_slp_proto_request` is called.

<img src="/images/2022-02-11/uh_slp_proto_request_entrypoint.png" alt="uh_slp_proto_request_entrypoint" style="width: 600px;display: block;margin-left: auto;margin-right: auto;"/>

By guessing and sending a couple of requests to the camera, we can check that data used by `uh_slp_proto_request` is regular POST data. So, if we send a POST request to `/` with the previous payload, `uh_slp_proto_request` will process this data, call `set_language` and our payload will be injected in the command executed by `exec_and_get_result`. 

As you can see, I didn't mention anything about authentication, since the `setLanguage` method can be called without login. This allows any user to take full control of the camera with just one unauthenticated request.

## Exploitation

Now, it's time to write the exploit. I spent some time figuring out how to get a reverse shell with `netcat`. It seemed trivial but I couldn't get it to work. I found out that the `netcat` version installed in BusyBox is quite limited in terms of functionality, so regular reverse shells were not valid. However, I found what I was looking for in [
PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Reverse%20Shell%20Cheatsheet.md#ncat) repository (as usual), and got the perfect reverse shell. Since `uhttpd` is running as root (thanks TP-Link), we get a shell with highest privileges just by sending a malicious POST request. The exploit is available at [my Github page](https://github.com/hacefresko/CVE-2021-4045-PoC):

<img src="/images/2022-02-11/poc.png" alt="poc" style="width: 600px;display: block;margin-left: auto;margin-right: auto;"/>

{% endraw %}