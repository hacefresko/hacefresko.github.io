---
layout: post
title: 'Unrestricted Access and Arbitrary File Read in Solr endpoint'
date: 2024-04-06
permalink: /posts/unrestricted-access-and-arbitrary-file-read-in-solr-endpoint
tags:
  - Bug Bounty
  - Solr
header:
  tweet-image: 2024-04-06/passwd.png
---

{% raw %}
Hello there. It has been two years since the last blog post, but I've been very busy getting some certs, breaking apart routers and other devices and, most importantly, getting a job :D. This time, I will be writting about my last two bounties, given by a very big company related to videogames that, unfortunately, I cannot disclose.

It all started when I received a mail from a HackerOne private program saying that a new domain was up and running. Given that the program itself is a very old and hardened program, I decided to give it a try since it could be a very good oportunity to hack it. I fired up Burp and started looking around.

## Recon

After some recon and many hours figuring out how to register (it only allowed US citizens but didn't specify it), I found an API endpoint that disclosed many URLs from the admin interface. I inmediately visited some of them and noticed that they were all accesible for regular users, however, the functionalities in them didn't work because the API endpoints they were using were actually restricted. Although this obviously didn't give me ability to do anything as an admin, I visited all of the URLs looking for something interesting to look into. Eventually, I found a dashboard that had a completely different look than the rest of the application:

![](/images/2024-04-06/dashboard.png)

After some googling, I found that it is a fork of Kibana named [Banana](https://github.com/LucidWorks/banana) and is used to work with Apache Solr, which is a search platform written in Java that usually contains a lot of important data and, therefore, is a very juicy target. So, I looked at the endpoints that the dashboard was using and found the Solr endpoint: `/api/solr/banana`. It didn't respond with any data, but it also didn't throw any errors and the response corresponded to that given directly by Solr, so this meant that any user could interact directly with the Solr endpoint. Great, that was worth a look.

After learning about Solr and reading some articles about common vulnerabilities and misconfigurations such as [this one](https://github.com/veracode-research/solr-injection/), I started by trying to get all cores available, which, very roughly, are kind of the different sets of data available in the Solr endpoint. This is done by requesting `/api/solr/admin/cores`, which succesfully gave me more than 100 results such as `User`, `UserLoginHistory`, `EntityPayment`, etc. They could be queried at `/api/solr/<core>/select?q=<query>`. For example, to query all entries in the `User` core, we would request `/api/solr/User/select?q=*`.

## Getting unrestricted access

However, it was not that easy. Although the Solr endpoint could be used by regular users, the information available was restricted to that accessible by each user. As an example, querying *all user data* with `/api/solr/User/select?q=*`, would only gives us **our** user data. This restriction was implemented by using something like a default query that contained default conditions such as `only retrieve user data belonging to this user`, which gets added to the list of queries to be processed at the same time. This behavior could be seen in the raw response from the Solr endpoint, in which the attribute `params` contained a list of queries named `q` with two elements: the default query set by the server (` ( tenantId:1 AND ...`) and the query requested by the user, (`*`):

![](/images/2024-04-06/query-filter.png)

This behavior was not reflected in any post about hacking Solr, and it might even have been custom to this application, so it required some additional thinking.

One of the *classic* ways to trick Solr into doing some nasty things is by using the `qt` parameter. If enabled, it allows to rewrite the request handler, which is what tells the server how to process the request. For example, in the case of `/api/solr/User/select`, the request handler would be `/select`. Other request handlers are `/config`, `/update`, etc. Essentially, this means that the request `/api/solr/User/select?qt=/config` would be rewritten as `/api/solr/User/config`. In fact, sometimes, the rewrite affects everything that the parameter `qt` includes. This means that a request like `/api/solr/User/select?qt=/test-handler?param=1337` would be rewritten to `/api/solr/User/select/test-handler?param=1337`.

>Obviously, I am not a Solr developer so I don't know the inner workings of this feature. Be aware that this behavior may only affect certain versions and configurations and the explanations here may not be as correct as the ones provided by Solr docs.

This way, I played extensively with the `qt` parameter until I found that the request `/api/solr/User/select?qt=/select?hacked&q=*`, would produce the following response:

![](/images/2024-04-06/query-filter-bypass.png)

As you can see, the raw response from the Solr endpoint shows only one parameter `q`, instead of two as before, the parameter `qt` and a new parameter `hacked?q` with the contents of the previous default `q`. What is happening here is something like the following:

1. The server receives the request `/api/solr/User/select?qt=/select?hacked&q=*` and processes the parameters in alphabetical order
2. The server processes parameter `q` and adds the query `*`
3. The server processes parameter `qt` and rewrites the URL from `/api/solr/User/select` to `/api/solr/User/select?hacked`
4. When it has finished processing the parameters supplied by the user, the server appends the default query to restrict access to other user's data to the URL without the parameters: `/api/solr/User/select?hacked?q=<default_query>`
4. Then server processes the resulting parameter `hacked?q`, which does nothing because it is not recognized.

This way, the default query that restricted access to other user's data gets bypassed, allowing the reatrival of all the information available in the Solr endpoint. In the case of the `User` core, which contained all kinds of personal information, there were 796165 entries. Also, there were other cores mentioned before with critical data such as `UserLoginHistory`, `BusinessEntityAccount`, `EntityPayment`, `PasswordHistory`, etc. Here are some examples of retrieved data:

<img src="/images/2024-04-06/login-history.png" alt="tapo_cam" style="width: 500px;display: block;margin-left: auto;margin-right: auto;"/>
<img src="/images/2024-04-06/payments.png" alt="tapo_cam" style="width: 500px;display: block;margin-left: auto;margin-right: auto;"/>

## Reading files in the server


{% endraw %}
