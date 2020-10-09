# linux kernel note

## Page Cache

### 系统 load 飙高分析

#### 直接内存回收

观察：`sar -B` 中 `pgscank/s` 、 `pgscand/s` 表示扫描的页面数量，前者表示 `kswapd` 扫描结果，后者表示直接扫描。需要让直接扫描越小越好。

解决：设置 `vm.min_free_kbytes`，尽早开始后台回收。

#### 脏页积压

观察：`sar -r` 中 `kbdirty` 即是脏页大小。

解决：设置

```plain
vm.dirty_background_bytes = 0
vm.dirty_background_ratio = 10
vm.dirty_bytes = 0
vm.dirty_expire_centisecs = 3000
vm.dirty_ratio = 20
```

控制脏页个数在合理范围内。

#### NUMA 设置不合理

观察：`numactl --hardware` 查看是否还有一半内存空闲，但是还是频频发生 direct reclaim。

解决：`vm.zone_reclaim_mode = 0`
