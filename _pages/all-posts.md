---
layout: archive
permalink: /posts/
title: "Blog posts"
excerpt: "All posts in the blog"
author_profile: true
redirect_from:
  - /wordpress/blog-posts/
---

{% include base_path %}
{% for post in site.posts %}
  {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
  {% if year != written_year %}
    {% capture written_year %}{{ year }}{% endcapture %}
  {% endif %}
  <img src="{{ post.header }}" alt="header">
  {% include archive-single.html %}
{% endfor %}