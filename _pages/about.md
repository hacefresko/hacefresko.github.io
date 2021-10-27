---
permalink: /
title: "Recent Posts"
excerpt: "Home"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% include base_path %}
{% for post in site.posts %}
  {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
  {% if year != written_year %}
    {% capture written_year %}{{ year }}{% endcapture %}
  {% endif %}
  {% include archive-single.html %}
{% endfor %}