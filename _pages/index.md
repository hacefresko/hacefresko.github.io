---
permalink: /
banner: true
title: "Posts"
redirect_from: 
  - /posts
  - /posts/
---
{% include base_path %}
{% for i in (0..9) %}
  {% if site.posts[i] %}
    {% assign post = site.posts[i] %}
    {% include archive-single.html %}
  {% endif %}
{% endfor %}
