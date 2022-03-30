# 基于 Netty IM 系统

## 服务端启动流程

### 代码示例

```java
public class NettyServer {
    public static void main(String[] args) {
        NioEventLoopGroup bossGroup = new NioEventLoopGroup();
        NioEventLoopGroup workerGroup = new NioEventLoopGroup();

        ServerBootstrap serverBootstrap = new ServerBootstrap();
        serverBootstrap
                .group(bossGroup, workerGroup)
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<NioSocketChannel>() {
                    protected void initChannel(NioSocketChannel ch) {
                    }
                });

        serverBootstrap.bind(8000);
    }
}
```

* `bossGroup` 负责监听和接收连接， `workerGroup` 负责处理具体业务逻辑；
* `serverBootstrap.group()` 配置线程组， `serverBootstrap` 负责启动工作；
* `.channel(NioServerSocketChannel.class)` 用来指定 IO 模型；
* `.childHandler()` 给这个引导类创建一个 `ChannelInitializer`，这里主要就是定义后续每条连接的数据读写，业务处理逻辑;

### 自动绑定递增端口

```java
private static void bind(final ServerBootstrap serverBootstrap, final int port) {
    serverBootstrap.bind(port).addListener(new GenericFutureListener<Future<? super Void>>() {
        public void operationComplete(Future<? super Void> future) {
            if (future.isSuccess()) {
                System.out.println("端口[" + port + "]绑定成功!");
            } else {
                System.err.println("端口[" + port + "]绑定失败!");
                bind(serverBootstrap, port + 1);
            }
        }
    });
}
```

### 服务端启动其他方法

**`handler()` 方法**

```java
serverBootstrap.handler(new ChannelInitializer<NioServerSocketChannel>() {
    protected void initChannel(NioServerSocketChannel ch) {
        System.out.println("服务端启动中");
    }
})
```

`childHandler()` 用于指定处理新连接数据的读写处理逻辑， `handler()` 用于指定在服务端启动过程中的一些逻辑

**`attr()` 方法**

```java
serverBootstrap.attr(AttributeKey.newInstance("serverName"), "nettyServer")
```

`attr()` 方法可以给服务端的 `channel`，也就是 `NioServerSocketChannel` 指定一些自定义属性，然后我们可以通过 `channel.attr()` 取出这个属性

**`childAttr()` 方法**

```java
serverBootstrap.childAttr(AttributeKey.newInstance("clientKey"), "clientValue")
```

`childAttr` 可以给每一条连接指定自定义属性，然后后续我们可以通过 `channel.attr()` 取出该属性

**`option()` 方法**

```java
serverBootstrap.option(ChannelOption.SO_BACKLOG, 1024)
```

给服务端 `channel` 设置一些属性

**`childOption()` 方法**

```java
serverBootstrap
        .childOption(ChannelOption.SO_KEEPALIVE, true)
        .childOption(ChannelOption.TCP_NODELAY, true)
```

`childOption()` 可以给每条连接设置一些TCP底层相关的属性

## 客户端启动流程

### 代码实例

```java
public class NettyClient {
    public static void main(String[] args) {
        NioEventLoopGroup workerGroup = new NioEventLoopGroup();
        
        Bootstrap bootstrap = new Bootstrap();
        bootstrap
                // 1.指定线程模型
                .group(workerGroup)
                // 2.指定 IO 类型为 NIO
                .channel(NioSocketChannel.class)
                // 3.IO 处理逻辑
                .handler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    public void initChannel(SocketChannel ch) {
                    }
                });
        // 4.建立连接
        bootstrap.connect("juejin.cn", 80).addListener(future -> {
            if (future.isSuccess()) {
                System.out.println("连接成功!");
            } else {
                System.err.println("连接失败!");
            }

        });
    }
}
```

### 失败重连

```java
private static void connect(Bootstrap bootstrap, String host, int port, int retry) {
    bootstrap.connect(host, port).addListener(future -> {
        if (future.isSuccess()) {
            System.out.println("连接成功!");
        } else if (retry == 0) {
            System.err.println("重试次数已用完，放弃连接！");
        } else {
            // 第几次重连
            int order = (MAX_RETRY - retry) + 1;
            // 本次重连的间隔
            int delay = 1 << order;
            System.err.println(new Date() + ": 连接失败，第" + order + "次重连……");
            bootstrap.config().group().schedule(() -> connect(bootstrap, host, port, retry - 1), delay, TimeUnit
                    .SECONDS);
        }
    });
}
```