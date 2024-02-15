---
permalink: /
title: "Posts"
redirect_from: 
  - /posts/
  - /about/
  - /about.html
---
{% include base_path %}
{% for i in (0..9) %}
  {% if site.posts[i] %}
    {% assign post = site.posts[i] %}
    {% include archive-single.html %}
  {% endif %}
{% endfor %}
