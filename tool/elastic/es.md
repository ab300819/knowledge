<!-- TOC -->

- [Elasticsearch](#elasticsearch)
    - [基本概念](#基本概念)
        - [集群](#集群)
        - [节点](#节点)
            - [Master-eligible nodes 和 Master Node](#master-eligible-nodes-和-master-node)
            - [Data Node 和 Coordinating Node](#data-node-和-coordinating-node)
                - [Data Node](#data-node)
                - [Coordinating Node](#coordinating-node)
            - [其他的节点类型](#其他的节点类型)
                - [Hot 和 Warm Node](#hot-和-warm-node)
                - [Machine Learning Node](#machine-learning-node)
                - [Tribe Node](#tribe-node)
            - [配置节点类型](#配置节点类型)
        - [分片](#分片)
            - [主分片](#主分片)
            - [副本](#副本)

<!-- /TOC -->

# Elasticsearch

## 基本概念

### 集群

- 不同的集群通过不同的名字来区分，默认名字 “Elasticsearch”；
- 通过配置文件修改，或者在命令行中 `-E cluster.name=test` 进行设定；
- 一个集群可以有一个或者多个节点；

### 节点

- 节点是一个 Elasticsearch 的实例
- 每个节点都有名字，通过配置文件配置，或者启动时候 `-E node.name=node1` 指定
- 每个节点在启动之后，会分配一个 UID，保存在 `data` 目录下

#### Master-eligible nodes 和 Master Node

每个节点启动后，默认就是一个 Master-eligible 节点，可以设置 `node.master:false` 禁止；

Master-eligible 节点可以参加选举流程，成为 Master 节点；

当第一个节点启动时候，它会将自己选举成 Master 节点；

每个节点上都保存了集群的状态，只有 Master 节点才能修改集群的状态信息；

集群状态（Cluster State）,维护了一个集群，必要的信息：

- 所有的节点信息
- 所有的索引和其相关的 Mapping 和 Setting 信息
- 分片的路由信息

**任意节点都能修改信息会导致数据的不一致性**

#### Data Node 和 Coordinating Node

##### Data Node

可以保存数据的节点，负责保存分片数据。

##### Coordinating Node

负责接受 Client 的请求，将请求分发到合适的节点，最终把结果汇集到一起；

#### 其他的节点类型

##### Hot 和 Warm Node

不同硬件配置的 Data Node，用来实现 Hot & Warm 架构，降低集群部署的成本

##### Machine Learning Node

负责跑机器学习的 Job

##### Tribe Node

连接到不同的 es 集群，并且支持将这些集群当成一个单独的集群处理

#### 配置节点类型

节点类型    ｜  配置参数    ｜ 默认值
--- ｜  --- ｜  ---
Master eligible |   `node.master`   |   `true`
data    |   `node.data`   |   `true`
ingest  |   `node.ingest`   |   `true`
coordinating only   |   无  ｜  `true`
machine learning    |   `node.ml`   |   `true`

### 分片

#### 主分片

用以解决数据水平扩展的问题，通过主分片，可以将数据分布到集群内所有节点之上；

一个分片是一个运行的 Lucene 的实例；

主分片数在索引创建时指定，后续不允许修改，除非 Reindex；

#### 副本

用以解决数据高可用的问题，分片是主分片的拷贝；

副本分片数可以动态调整；

增加副本数，还可以在一定程度上提高服务的可用性；

