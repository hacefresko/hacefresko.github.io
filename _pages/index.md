---
permalink: /
title: "posts"
redirect_from: 
  - /posts
  - /posts/
---

{% for post in site.posts %}
  {% include post_link.html %}
{% endfor %}
