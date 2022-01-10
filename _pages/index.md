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
  {% assign post = site.posts[i] %}
  {% if post %}
    {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
    {% if year != written_year %}
      {% capture written_year %}{{ year }}{% endcapture %}
    {% endif %}
    <img src="{{ post.header }}" alt="header">
    {% include archive-single.html %}
  {% endif %}
{% endfor %}