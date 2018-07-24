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

```Dockerfile
FROM busybox

ENV foo=bar
```

创建一个名为 busybox2 镜像

```shell
docker build -t busybox2
```

### 使用两个链接在一起的容器运行 WordPress 博客程序

拉取 mysql 和 wordpress 镜像

```shell
docker pull wordpress:latest

docker pull mysql:latest
```

启动 mysql 容器并设置密码，`--name` 为容器指定名称，`-d` 为后台运行

```shell
docker run --name mysqlwp -e MYSQL_ROOT_PASSWORD=110119 -d mysql
```

启动 worpress 容器，并通过 `--link` 连接 mysql 容器

```shell
docker run --name wordpress --link mysqlwp:mysql -p 80:80 -d wordpress
```

为 wordpress 创建数据库，并为其创建一个用户

```shell
docker run --name mysqlwp -e MYSQL_ROOT_PASSWORD=test123456 \ 
                            -e MYSQL_DATABASE=wordpress \ 
                            -e MYSQL_USER=wordpress \ 
                            -e MYSQL_PASSWORD=wordpresspwd \ 
                            -d mysql

```

启动 wordpress 容器

```shell
docker run --name wordpress --link mysqlwp:mysql -p 80:80 \
                            -e WORDPRESS_DB_NAME=wordpress \ 
                            -e WORDPRESS_DB_USER=wordpress \ 
                            -e WORDPRESS_DB_PASSWORD=wordpresspwd \ 
                            -d wordpress
```

删除所有容器，通过 `-v` 删除 mysql 镜像中定义的数据卷

```shell
docker stop $(docker ps -q) 
docker rm -v $(docker ps -aq)
```

### 备份在容器中运行的数据库

* 将 Docker 主机上的卷挂载到 MySQL 容器中
* 使用 `docker exec` 命令执行 `mysqldump`

```shell
docker run --name mysqlwp -e MYSQL_ROOT_PASSWORD=wordpressdocker \ 
                            -e MYSQL_DATABASE=wordpress \ 
                            -e MYSQL_USER=wordpress \ 
                            -e MYSQL_PASSWORD=wordpresspwd \
                            -v /home/docker/mysql:/var/lib/mysql \ 
                            -d mysql
```

```shell
docker exec mysqlwp mysqldump --all-databases \ 
                                --password=wordpressdocker > wordpress.backup
```
