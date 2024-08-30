---
permalink: /cheatsheets
title: "cheatsheets"
---

{% assign cheatsheets = site.static_files | where: "cheatsheet", true %}

<ul class="cheatsheets">
{% for cheatsheet in cheatsheets %}
  <li>
    <a href="{{ cheatsheet.path }}">{{ cheatsheet.name }}</a>
  </li>
{% endfor %}
</ul>