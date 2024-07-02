---
permalink: /
title: "posts"
redirect_from: 
  - /posts
  - /posts/
---

{% include base_path %}
{% for post in site.posts %}
  {% include archive-single.html %}
{% endfor %}
