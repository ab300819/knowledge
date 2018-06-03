# Java NIO

## 概述

Java NIO 有三部分组成：

* `Channels`
* `Buffers`
* `Selectors`

![](../resources/overview-channels-buffers.png)

## `Channels` 和 `Buffers`

### 主要实现

`Channels` 主要实现：

* `FileChannel`
* `DatagramChannel`
* `SocketChannel`
* `ServerSocketChannel`

主要对应文件IO、UDP和TCP/IP网络IO <br>

`Buffers` 主要实现：

* `ByteBuffer`
* `CharBuffer`
* `DoubleBuffer`
* `FloatBuffer`
* `IntBuffer`
* `LongBuffer`
* `ShortBuffer`

### 使用方式

```java
FileInputStream fileStream = new FileInputStream(new File("test.txt"));
FileChannel fileChannel = fileStream.getChannel();
// jdk 1.7 以上
// FileChannel.open(Paths.get("test.txt"), StandardOpenOption.WRITE);

ByteBuffer buf = ByteBuffer.allocate(1024);

while (fileChannel.read(buf) != -1) {
    buf.flip();
    while (buf.hasRemaining()) {

        System.out.println(buf.get());

    }

    buf.clear();
}
fileChannel.close();

System.out.println(buf.capacity());
```

使用 `Buffer` 读写数据一般有五个步骤：

1. 分配 `Buffer` 大小
2. 写入数据到 `Buffer`
3. 调用 `flip()` 方法，将 `Buffer` 从写模式切换到读模式
4. 从 `Buffer` 中读取数据
5. 调用 `clear()` 方法或者 `compact()` 方法

一旦读完了所有的数据，就需要清空缓冲区，让它可以再次被写入。有两种方式能清空缓冲区：调用 `clear()` 或 `compact()` 方法。`clear()` 方法会清空整个缓冲区。`compact()` 方法只会清除已经读过的数据。任何未读的数据都被移到缓冲区的起始处，新写入的数据将放到缓冲区未读数据的后面。

### `Buffer`属性

* `capacity` 缓冲区能够容纳的数据元素的最大数量。
* `position` 缓冲区里的数据的总数，代表了当前缓冲区中一共有多少数据。
* `limit` 下一个要被读或写的元素的位置。

![](../resources/buffers-modes.png)

```
0 <= mark <= position <= limit <= capacity
```

### 其他方法

**`rewind()`方法**

`Buffer.rewind()` 将 `position` 设回 `0`，所以你可以重读 `Buffer` 中的所有数据。`limit` 保持不变，仍然表示能从 `Buffer` 中读取多少个元素（`byte`、`char` 等）。

**`mark()` 与 `reset()` 方法**

通过调用 `Buffer.mark()` 方法，可以标记 `Buffer` 中的一个特定 `position`。之后可以通过调用 `Buffer.reset()` 方法恢复到这个 `position`。

## Scatter/Gather

分散（`scatter`）从 `Channel` 中读取是指在读操作时将读取的数据写入多个 `buffer` 中。因此， `Channel` 将从 `Channel` 中读取的数据“分散（`scatter`）”到多个 `Buffer` 中。

![](../resources/scatter.png)

```java
ByteBuffer header = ByteBuffer.allocate(128);
ByteBuffer body   = ByteBuffer.allocate(1024);

ByteBuffer[] bufferArray = { header, body };

channel.read(bufferArray);
```

聚集（`gather`）写入 `Channel` 是指在写操作时将多个 `buffer` 的数据写入同一个 `Channel`，因此，`Channel` 将多个 `Buffer` 中的数据“聚集（`gather` ）”后发送到 `Channel`。

![](../resources/gather.png)

```java
ByteBuffer header = ByteBuffer.allocate(128);
ByteBuffer body   = ByteBuffer.allocate(1024);

//write data into buffers

ByteBuffer[] bufferArray = { header, body };

channel.write(bufferArray);
```

## `Channel` 之间的数据传输

可以通过 `transferFrom()` 或 `transferTo()` 将数据从一个 `Channel` 转移到另一个 `Channel`

**transferFrom()**

```java
RandomAccessFile fromFile = new RandomAccessFile("fromFile.txt", "rw");
FileChannel      fromChannel = fromFile.getChannel();

RandomAccessFile toFile = new RandomAccessFile("toFile.txt", "rw");
FileChannel      toChannel = toFile.getChannel();

long position = 0;
long count    = fromChannel.size();

toChannel.transferFrom(fromChannel, position, count);
```

**transferTo()**

```java
RandomAccessFile fromFile = new RandomAccessFile("fromFile.txt", "rw");
FileChannel      fromChannel = fromFile.getChannel();

RandomAccessFile toFile = new RandomAccessFile("toFile.txt", "rw");
FileChannel      toChannel = toFile.getChannel();

long position = 0;
long count    = fromChannel.size();

fromChannel.transferTo(position, count, toChannel);
```

### 复制文件

**使用 `FileChannel` 配合缓冲区**

```java
FileChannel inChanenl = FileChannel.open(Paths.get("inFile.txt"), StandardOpenOption.READ);
FileChannel outChannel = FileChannel.open(
        Paths.get("outFile.txt"),
        StandardOpenOption.READ,
        StandardOpenOption.WRITE,
        StandardOpenOption.CREATE);

ByteBuffer byteBuffer = ByteBuffer.allocate(1024);

while (inChanenl.read(byteBuffer) != -1) {

    byteBuffer.flip();
    outChannel.write(byteBuffer);
    byteBuffer.clear();

}
```

**使用内存映射文件的方式**

```java
FileChannel inFile = FileChannel.open(Paths.get("inFile.txt"), StandardOpenOption.READ);
FileChannel outFile = FileChannel.open(
        Paths.get("outFile.txt"),
        StandardOpenOption.READ,
        StandardOpenOption.WRITE,
        StandardOpenOption.CREATE);

// 内存映射
MappedByteBuffer inMappedBuf = inFile.map(FileChannel.MapMode.READ_ONLY, 0, inFile.size());
MappedByteBuffer outMappedBuf = outFile.map(FileChannel.MapMode.READ_WRITE, 0, inFile.size());

// 直接对缓冲区进行数据的读写操作
byte[] data = new byte[inMappedBuf.limit()];
inMappedBuf.get(data);
outMappedBuf.put(data);
```

## `Selectors`

![](../resources/overview-selectors.png)

### 创建 `Selectors`

```java
Selector selector = Selector.open();
```

### 向 `Selectors` 注册 Channels

```java
channel.configureBlocking(false);

SelectionKey key = channel.register(selector, SelectionKey.OP_READ);
```

### SelectionKey's

**Interest 集合**

* Connect - `SelectionKey.OP_CONNECT`
* Accept - `SelectionKey.OP_ACCEPT`
* Read - `SelectionKey.OP_READ`
* Write - `SelectionKey.OP_WRITE`

操作 Interest 集合

```java
int interestSet = selectionKey.interestOps();

boolean isInterestedInAccept  = interestSet & SelectionKey.OP_ACCEPT;
boolean isInterestedInConnect = interestSet & SelectionKey.OP_CONNECT;
boolean isInterestedInRead    = interestSet & SelectionKey.OP_READ;
boolean isInterestedInWrite   = interestSet & SelectionKey.OP_WRITE;    
```

**Ready 集合**

* `selectionKey.isAcceptable();`
* `selectionKey.isConnectable();`
* `selectionKey.isReadable();`
* `selectionKey.isWritable();`

操作 Ready 集合

```java
int readySet = selectionKey.readyOps();
```

也可以使用

```java
selectionKey.isAcceptable();
selectionKey.isConnectable();
selectionKey.isReadable();
selectionKey.isWritable();
```

**Channel + Selector**

从 `SelectionKey` 访问 `Channel` 和 `Selector`

```java
Channel  channel  = selectionKey.channel();
Selector selector = selectionKey.selector();    
```

**附加对象**

```java
selectionKey.attach(theObject);
Object attachedObj = selectionKey.attachment();
```

也可以在用 `register()` 方法向 `Selector` 注册 `Channel` 的时候附加对象 

```java
SelectionKey key = channel.register(selector, SelectionKey.OP_READ, theObject);
```

**完整例子**

```java
Selector selector = Selector.open();

channel.configureBlocking(false);

SelectionKey key = channel.register(selector, SelectionKey.OP_READ);

while(true) {

    int readyChannels = selector.select();

    if(readyChannels == 0) continue;

    Set<SelectionKey> selectedKeys = selector.selectedKeys();

    Iterator<SelectionKey> keyIterator = selectedKeys.iterator();

    while(keyIterator.hasNext()) {

    SelectionKey key = keyIterator.next();

    if(key.isAcceptable()) {
        // a connection was accepted by a ServerSocketChannel.

    } else if (key.isConnectable()) {
        // a connection was established with a remote server.

    } else if (key.isReadable()) {
        // a channel is ready for reading

    } else if (key.isWritable()) {
        // a channel is ready for writing
    }

    keyIterator.remove();
    }
}
```

## Pipe

`Pipe` 是2个线程之间的单向数据连接。`Pipe`有一个`source`通道和一个`sink`通道。数据会被写到`sink`通道，从`source`通道读取。

![](../resources/pipe.bmp)

### 创建管道

```java
Pipe pipe = Pipe.open();
```

### 向管道写数据

要向管道写数据，需要访问 `sink` 通道

```java
Pipe.SinkChannel sinkChannel = pipe.sink();
```

```java
String newData = "New String to write to file..." + System.currentTimeMillis();

ByteBuffer buf = ByteBuffer.allocate(48);
buf.clear();
buf.put(newData.getBytes());

buf.flip();

while(buf.hasRemaining()) {
    sinkChannel.write(buf);
}
```

### 从管道读取数据

从读取管道的数据，需要访问`source`通道

```java
Pipe.SourceChannel sourceChannel = pipe.source();
```

```java
ByteBuffer buf = ByteBuffer.allocate(48);

int bytesRead = inChannel.read(buf);
```

## NIO 网络通信

在网络中使用NIO往往是I/O模型的多路复用模型

### NIO 阻塞形态

不使用 `Selector` 就是阻塞形态 <br>

服务端

```java
// 1.获取通道
ServerSocketChannel server = ServerSocketChannel.open();
// 2.得到文件通道，将客户端传递过来的图片写到本地项目下(写模式、没有则创建)
FileChannel saveChannel = FileChannel.open(
        Paths.get("uploadFile.txt"),
        StandardOpenOption.READ,
        StandardOpenOption.WRITE,
        StandardOpenOption.CREATE);
// 3.绑定连接
server.bind(new InetSocketAddress(port));
// 4. 获取客户端的连接(阻塞的)
SocketChannel client = server.accept();

ByteBuffer byteBuffer = ByteBuffer.allocate(1024);

while (client.read(byteBuffer) != -1) {
    byteBuffer.flip();
    saveChannel.write(byteBuffer);
    byteBuffer.clear();
}

// 给客户端返回信息
byteBuffer.put("file is success".getBytes());
byteBuffer.flip();
client.write(byteBuffer);
byteBuffer.clear();

saveChannel.close();
client.close();
server.close();
```

客户端

```java
SocketChannel socketChannel = SocketChannel.open(new InetSocketAddress("localhost", port));

FileChannel outChannel = FileChannel.open(Paths.get("inFile.txt"), StandardOpenOption.READ);

ByteBuffer byteBuffer = ByteBuffer.allocate(1024);

while (outChannel.read(byteBuffer) != -1) {
    byteBuffer.flip();
    socketChannel.write(byteBuffer);
    byteBuffer.clear();
}

// 告诉服务器已经写完了
socketChannel.shutdownOutput();

// 接受服务端返回信息
int len = 0;
while ((len = socketChannel.read(byteBuffer)) != -1) {
    byteBuffer.flip();
    System.out.println(new String(byteBuffer.array(), 0, len));
    byteBuffer.clear();
}

outChannel.close();
socketChannel.close();
```

### NIO 非阻塞形态

服务端

```java
ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
serverSocketChannel.configureBlocking(false);

SocketChannel client = null;

serverSocketChannel.bind(new InetSocketAddress(port));

Selector selector = Selector.open();

serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);

//  轮训地获取选择器上已“就绪”的事件--->只要select()>0，说明已就绪
while (selector.select() > 0) {
    Iterator<SelectionKey> iterator = selector.selectedKeys().iterator();
    while (iterator.hasNext()) {

        SelectionKey selectionKey = iterator.next();

        if (selectionKey.isAcceptable()) {

            client = serverSocketChannel.accept();
            client.configureBlocking(false);
            client.register(selector, SelectionKey.OP_READ);

        } else if (selectionKey.isReadable()) {

            client = (SocketChannel) selectionKey.channel();

            ByteBuffer buffer = ByteBuffer.allocate(1024);

            FileChannel outFile = FileChannel.open(
                    Paths.get("nioFile.txt"),
                    StandardOpenOption.READ,
                    StandardOpenOption.WRITE,
                    StandardOpenOption.CREATE);
            while (client.read(buffer) != -1) {
                buffer.flip();
                outFile.write(buffer);
                buffer.clear();
            }
        }
        iterator.remove();
    }

    ByteBuffer byteBuffer = ByteBuffer.allocate(1024);
    byteBuffer.put("File is finished!".getBytes());
    byteBuffer.flip();
    client.write(byteBuffer);
}
```

客户端

```java
SocketChannel socketChannel = SocketChannel.open(new InetSocketAddress("localhost", port));

socketChannel.configureBlocking(false);

Selector selector = Selector.open();

socketChannel.register(selector, SelectionKey.OP_READ);

FileChannel fileChannel = FileChannel.open(Paths.get("inFile.txt"), StandardOpenOption.READ);

ByteBuffer byteBuffer = ByteBuffer.allocate(1024);

while (fileChannel.read(byteBuffer) != -1) {
    byteBuffer.flip();
    socketChannel.write(byteBuffer);
    byteBuffer.clear();
}

while (selector.select() > 0) {
    Iterator<SelectionKey> iterator = selector.selectedKeys().iterator();

    while (iterator.hasNext()) {

        SelectionKey selectionKey = iterator.next();

        if (selectionKey.isReadable()) {
            SocketChannel channel = (SocketChannel) selectionKey.channel();

            ByteBuffer buffer = ByteBuffer.allocate(1024);

            int readBytes = channel.read(buffer);
            if (readBytes > 0) {
                buffer.flip();
                System.out.println(new String(buffer.array(), 0, readBytes));
            }
        }

    }

    iterator.remove();

}
```
