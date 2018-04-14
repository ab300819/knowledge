### 移除Ubuntu上陈旧的PPA仓库

1. `sudo apt-get update | grep "Failed"`

```
Err http://ppa.launchpad.net trusty/main amd64 Packages 404  Not Found

Err http://ppa.launchpad.net trusty/main i386 Packages  404  Not Found

W: Failed to fetch http://ppa.launchpad.net/finalterm/daily/Ubuntu/dists/trusty/main/binary-amd64/Packages  404  Not Found

W: Failed to fetch http://ppa.launchpad.net/finalterm/daily/ubuntu/dists/trusty/main/binary-i386/Packages  404  Not Found

E: Some index files failed to download. They have been ignored, or old ones used instead.
```

2. `sudo add-apt-repository --remove ppa:finalterm/daily`