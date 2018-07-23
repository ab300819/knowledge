# Docker 笔记

## 安装方式

1. [官方安装方式](https://docs.docker.com/install/linux/docker-ce/debian/)

2. 省事方法，生产环境不建议使用

```bash
curl -fsSL get.docker.com -o get-docker.sh
```

## 基本操作

### 在交互方式中运行容器

```bash
docker run -t -i ubuntu:18.04
```

### 后台方式运行 Docker 容器

```bash
docker run -d ...
```

再次进入已运行容器

```bash
docker exec -t -i [容器ID] /bin/bash
```

### 容器生命周期

**create**

创建一个新容器

```bash
docker create -P --expose=1234 python:2.7 python -m SimpleHTTPServer 1234
```

**start**

启动容器

```bash
docker start 容器id
```

**restart**

重启容器

```bash
docker restart 容器id
```

**stop**

停止正在运行的容器，这个命令会发送 `SIGTERM` 到容器，如果在一定时间内容器还没有停止，则会再发送 `SIGKILL` 信号强制停止

```bash
docker stop 容器id
```

**kill**

停止正在运行的容器，这个命令会发送 `SIGKILL` 信号强制停止

```bash
docker kill 容器id
```

**rm**

移除容器

```bash
docker rm 容器id
```

批量移除容器

```bash
docker rm $(docker ps -a -q)
```

### 使用 Dockerfile 构建 Docker 镜像
