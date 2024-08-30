---
permalink: /cheatsheets
title: "cheatsheets"
redirect_from:
  - /cheatsheets/
---

<ul class="cheatsheets">
{% for cheatsheet in site.data.cheatsheets %}
  <li>
    <a href="{{ cheatsheet.file }}">{{ cheatsheet.name }}</a>
  </li>
{% endfor %}
</ul>