---
title: "Graphing SNMP data with Prometheus and Grafana"
date: 2017-08-04
---


Graphing SNMP data with Prometheus and Grafana
==============================================

This summer, I\'ve been an intern on the Infrastructure team at CoreOS,
and this week marks the halfway point. I\'ve been learning lots and
doing some really interesting work. My latest project revolves around
getting some metrics about the office network set up, using SNMP,
Prometheus and Grafana.

SNMP
----

The first step was learning about SNMP. For those of you who haven\'t
heard of SNMP before, it\'s a protocol that came about in the late
80\'s, used for getting and modifying information about a managed
device. It uses OIDs, which are allocated to different organizations,
such as Cisco, who then in turn define their subset of OIDs in a MIB,
which SNMP uses to know how to parse the information. Here\'s an example
of a request to a host with some OID

``` {.sourceCode .bash}
$ snmpget -v 2c -c public hostname 1.3.6.1.2.1.2.2.1.10.21
IF-MIB::ifInOctets.21 = Counter32: 17202468
```

Using snmpget (from the net-snmp package), version 2c of SNMP and the
community string \'public\', we request information associated with the
OID 1.3.6.1.2.1.2.2.1.10.21. I had to look up this OID, and I\'m just
using it as an example of what an OID looks like. Usually, the string of
the OID is easier for individual requests. But you can see below the
command, in the response, what that OID resolved to.
IF-MIB::ifInOctets.21 breaks down to the Interface MIB, or IF-MIB, then
using that MIB, to the number of octets on some interface, in this case
physical port 21 (this particular host is a switch). If you have some
host that supports SNMP version 2 or 3, try the following command to see
most of the OIDs your host knows about, assuming that the default
community string is \'public\' (which is standard):
snmpwalk -v 2c -c public hostname.

Prometheus
----------

With a base of SNMP understanding, now we can start getting some
metrics. We\'ll need Prometheus and the Prometheus SNMP Exporter. I want
to run them in docker, and have them talk to each other. This is simple
with something like Kubernetes, but for my proof-of-concept, I set up a
docker bridge network, and put both containers on it.

``` {.sourceCode .yaml}
$ docker network create --driver bridge prometheus
$ docker run --network=prometheus -d -p 9116:9116 quay.io/taylor_fahlman/prom_snmp_exporter
$ docker run --network=prometheus -d -p 9090:9090 -v /etc/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
```

And here\'s the \`prometheus.yml\`:

``` {.sourceCode .yaml}
global:
  scrape_interval: 10s
  evaluation_interval: 10s

scrape_configs:
  - job_name: 'snmp'
    static_configs:
      - targets:
        - hostname # Target SNMP device.
    metrics_path: /snmp
    params:
      module: [default]
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: 172.18.0.3:9116  # Docker IP with SNMP exporter.
```

I found the correct bridge IP for the SNMP exporter container by running
docker network inspect prometheus. Just replace 172.18.0.3 whatever the
IP is. Now I could see info about the scrapes Prometheus was making at
http://dockerhostname:9090/consoles/snmp.html. It showed the device,
which should be the same as the host or IP under targets, if it was up,
Ports Up, Ports Total, Mb/s in, out, discard and errors. That\'s a lot
of metrics just from a default setup! There\'s a great tool that goes
along with SNMP exporter that generates the config so if you want to
make your own module that handles certain Cisco MIBs and Supermicro
MIBs, its easy. You can find that tool
[here](https://github.com/prometheus/snmp_exporter/tree/master/generator).

Now I have metrics about the target host in a time series. What better
way to analyze that data then by graphing it?

Grafana
-------

This part is super easy. Spin up a Grafana container on the same bridge:

``` {.sourceCode .bash}
$ docker run --network=prometheus -d -p 3000:3000 grafana/grafana
```

Follow the docs to log in and set up a Prometheus data source. Then,
import [this](https://grafana.com/dashboards/1124) as a Dashboard.
Assuming everything was set up right, there should be a graph for each
port on your device, automatically labeled, and probably a few data
points already graphed. In my case, it worked out of the gate for most
hosts, but I had a few that required SNMP v1 for some reason so I had to
tinker. But for SNMP 2 and 3, that template just works at time of
writing.

Conclusion
----------

SNMP is actually really useful, even if most people think its old. Using
that data, I can now easily tell when certain ports on a switch are
spiking in traffic, which ones get more inbound traffic, which get more
outbound traffic, and in general make better hypothesis about network
issues in the office. Prometheus and Grafana were a breeze to set up,
and are incredibly powerful tools that I\'ve barely scratched the
surface of.
