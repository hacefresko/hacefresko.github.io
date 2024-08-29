---
permalink: /links
title: "links"
---

<ul class="links">
{% for link in site.data.social_links %}
  <li>
    <a href="{{ link.link }}">{{ link.site }}</a>
  </li>
{% endfor %}
</ul>