---
permalink: /
title: "posts"
redirect_from: 
  - /posts
  - /posts/
---

{% include base_path %}
{% for post in site.posts %}
  {% include post_link.html %}
{% endfor %}
