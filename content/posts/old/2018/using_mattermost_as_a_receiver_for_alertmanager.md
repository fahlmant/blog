---
title: "Using Mattermost as a receiver for Alertmanager"
date: 2018-08-01
---

While working to move to Prometheus and Alertmanager for our monitoring
lately, my team discovered that the generic `webhook_config` in
Alertmanager does not work with a Mattermost webhook. The JSON included
in the POST from Alertmanager causes Mattermost to return a 400, and the
lack of flexibility in Alertmanager leaves a lot to be desired. Luckily,
Mattermost webhooks translate Slack webhooks natively (according to the
documentation
[here](https://docs.mattermost.com/developer/webhooks-incoming.html#slack-compatibility)),
and Alertmanager natively supports Slack with a `slack_config`.

``` {.sourceCode .yaml}
receivers:
  - name: mattermost
    slack_configs:
    - api_url: http://{your-mattermost-site}/hooks/xxx-generatedkey-xxx
```

Then, customize the alert routing and message as much as you want.
Further reading on custom templating which I found helpful is available
on the [Prometheus
Blog](https://prometheus.io/blog/2016/03/03/custom-alertmanager-templates/#customize).
