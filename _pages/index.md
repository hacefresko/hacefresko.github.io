---
permalink: /
title: "Recent Posts"
excerpt: "Recent posts in the blog"
author_profile: true
redirect_from: 
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