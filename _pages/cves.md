---
permalink: /cves
title: "cves"
redirect_from:
  - /cve
---

<ul class="cves">
{% for cve in site.data.cves %}
  <li>
    <a href="{{ cve.url }}">[{{ cve.cve }}] - {{ cve.title }}</a>
  </li>
{% endfor %}
</ul>
