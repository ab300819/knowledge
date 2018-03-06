### Introduction to the Java NIO2 File API

#### 1. Checking a File or Directory

```java
Path p = Paths.get(home);

// 判断文件或目录存在
Files.exists(p);

// 判断文件或目录不存在
Files.notExists(p);

// 判断是否常规文件或目录
Files.isRegularFile(p);

// 判断是否可读
Files.isReadable(p);

// 判断是否可写
Files.isWritable(p);

// 判断是否可执行
Files.isExecutable(p);

Files.isSameFile(p1, p2);
```
#### 2. Creating Files

```java
// 创建文件
String fileName = "testFile_" + UUID.randomUUID().toString() + ".txt";
Path p = Paths.get("src/test/resources/" + fileName);
Files.createFile(p);

// 创建目录
String dirName = "test";
Path p = Paths.get("src/test/resources/" + dirName);
Files.createDirectory(p);
// 递归创建目录
Files.createDirectories(p);
```

#### 3. Creating Temporary Files

```java
// 指定目录、前缀和后缀
String prefix = "log_";
String suffix = ".txt";
Path p = Paths.get("src/test/resources/");
Files.createTempFile(p, prefix, suffix);

// 指定目录，不指定前缀和后缀，文件名类似8600179353689423985.tmp
Files.createTempFile(p, null, null);

// 什么都不指定，会在系统默认的临时文件目录
// C:\Users\user\AppData\Local\Temp\6100927974988978748.tmp
Files.createTempFile(null, null);
```

#### 4. Deleting a File

```java
Path p = Paths.get("src/test/resources/test.txt");
// 会抛出 NoSuchFileException
Files.delete(p);

// 静默删除
Files.deleteIfExists(p);

// 默认非递归删除，如果目录不为空会抛出 DirectoryNotEmptyException
Files.delete(p);
```

#### 5. Copying Files

```java
Files.copy(file1, file2);

// 如果目标文件存在可使用
Files.copy(file1, file2, StandardCopyOption.REPLACE_EXISTING);

// 如果复制目录，目录内容不会递归复制，仅复制目录
```

#### 5. Moving Files

和复制文件类似

```java
Files.move(file1, file2);

// 如果目标文件存在
Files.move(file1, file2, StandardCopyOption.REPLACE_EXISTING);
```

### Java NIO2 Path API

#### 1. Normalizing a Path

```java
Path p = Paths.get("/home/./baeldung/articles");
Path cleanPath = p.normalize();
assertEquals("\\home\\baeldung\\articles", cleanPath.toString());

Path p = Paths.get("/home/baeldung/../articles");
Path cleanPath = p.normalize();
assertEquals("\\home\\articles", cleanPath.toString());
```

#### 2. Path Conversion

```java
// 转化为浏览器中路径
Path p = Paths.get("/home/baeldung/articles.html");
URI uri = p.toUri();
assertEquals("file:///E:/home/baeldung/articles.html", uri.toString());

// 转为绝对路径
Path absPath = p.toAbsolutePath();
```

#### 3. Joining Paths

```java
Path p = Paths.get("/baeldung/articles"); 
Path p2 = p.resolve("java");  
assertEquals("\\baeldung\\articles\\java", p2.toString());

Path p = Paths.get("/baeldung/articles");
Path p2 = p.resolve("C:\\baeldung\\articles\java");
assertEquals("C:\\baeldung\\articles\\java", p2.toString());

Path p = Paths.get("/baeldung/articles");
Path p2 = p.resolve("/java");
assertEquals("\\java", p2.toString());
```

#### 4. Relativizing Paths

```java
Path p1 = Paths.get("articles");
Path p2 = Paths.get("authors");

Path p1_rel_p2 = p1.relativize(p2);
Path p2_rel_p1 = p2.relativize(p1);

assertEquals("..\\authors", p1_rel_p2.toString());
assertEquals("..\\articles", p2_rel_p1.toString());
```

```java
Path p1 = Paths.get("/baeldung");
Path p2 = Paths.get("/baeldung/authors/articles");

Path p1_rel_p2 = p1.relativize(p2);
Path p2_rel_p1 = p2.relativize(p1);

assertEquals("authors\\articles", p1_rel_p2.toString());
assertEquals("..\\..", p2_rel_p1.toString());
```

#### Introduction to the Java NIO Selector

##### 1. Creating a Selector

```java
Selector selector = Selector.open();
```

##### 2. Registering Selectable Channels

```java
channel.configureBlocking(false);
SelectionKey key = channel.register(selector, SelectionKey.OP_READ);
```

有四种不同事件:  
* `SelectionKey.OP_CONNECT` - 当客户端试图连接服务端
* `SelectionKey.OP_ACCEPT` - 当服务端接收客户端连接
* `SelectionKey.OP_READ` - 当服务端准备读取 `channel`
* `SelectionKey.OP_WRITE` - 当服务端准备写入 `channel`

##### 3. The SelectionKey Object

###### 3.1 The Interest Set

```java
int interestSet = selectionKey.interestOps();
 
boolean isInterestedInAccept  = interestSet & SelectionKey.OP_ACCEPT;
boolean isInterestedInConnect = interestSet & SelectionKey.OP_CONNECT;
boolean isInterestedInRead    = interestSet & SelectionKey.OP_READ;
boolean isInterestedInWrite   = interestSet & SelectionKey.OP_WRITE;
```

通过 `&` 两个值，判断事件是否被监视

###### 3.2 The Ready Set

```java
selectionKey.isAcceptable();
selectionKey.isConnectable();
selectionKey.isReadable();
selectionKey.isWriteable();
```

###### 3.3 The Channel

```java
Channel channel = key.channel();
```

###### 3.4 The Selector

```java
Selector selector = key.selector();
```

###### 3.5 Attaching Objects

```java
key.attach(Object);
Object object = key.attachment();
```

或者在注册 `channel` 时

```java
SelectionKey key = channel.register(selector, SelectionKey.OP_ACCEPT, object);
```

###### 4. Channel Key Selection

```java
// 此方法会造成阻塞
int channels = selector.select();
```

```java
Set<SelectionKey> selectedKeys = selector.selectedKeys();
```

##### Complete Example

* Server

```java
public class EchoServer {

    private static final String POISON_PILL = "POISON_PILL";

    public static void main(String[] args) throws IOException {
        Selector selector = Selector.open();
        ServerSocketChannel serverSocket = ServerSocketChannel.open();

        serverSocket.bind(new InetSocketAddress("localhost", 5454));
        serverSocket.configureBlocking(false);
        serverSocket.register(selector, SelectionKey.OP_ACCEPT);

        ByteBuffer buffer = ByteBuffer.allocate(256);

        while (true) {
            selector.select();
            Set<SelectionKey> selectionKeys = selector.selectedKeys();
            Iterator<SelectionKey> iter = selectionKeys.iterator();
            while (iter.hasNext()) {
                SelectionKey key = iter.next();
                if (key.isAcceptable()) {
                    register(selector, serverSocket);
                }

                if (key.isReadable()) {
                    answerWithEcho(buffer, key);
                }
                iter.remove();
            }
        }
    }

    private static void answerWithEcho(ByteBuffer buffer, SelectionKey key) throws IOException {

        SocketChannel client = (SocketChannel) key.channel();
        client.read(buffer);
        if (new String(buffer.array()).trim().equals(POISON_PILL)) {
            client.close();
            System.out.println("Not accepting client message anymore");
        }

        buffer.flip();
        client.write(buffer);
        buffer.clear();
    }

    private static void register(Selector selector, ServerSocketChannel serverSocket) throws IOException {
        SocketChannel client = serverSocket.accept();
        client.configureBlocking(false);
        client.register(selector, SelectionKey.OP_READ);
    }

    public static Process start() throws IOException, InterruptedException {
        String javaHome = System.getProperty("java.home");
        String javaBin = javaHome + File.separator + "bin" + File.separator + "java";
        String classpath = System.getProperty("java.class.path");
        String className = EchoServer.class.getCanonicalName();

        ProcessBuilder builder = new ProcessBuilder(javaBin, "-np", classpath, className);
        return builder.start();
    }

}
```

* Client

```java
public class EchoClient {

    private static SocketChannel client;
    private static ByteBuffer buffer;
    private static EchoClient instance;

    public static EchoClient start() {
        if (instance == null) {
            instance = new EchoClient();
        }
        return instance;
    }

    public static void stop() throws IOException {
        client.close();
        buffer = null;
    }

    private EchoClient() {
        try {
            client = SocketChannel.open(new InetSocketAddress("localhost", 5454));
            buffer = ByteBuffer.allocate(256);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String sendMessage(String msg) {
        buffer = ByteBuffer.wrap(msg.getBytes());
        String response = null;
        try {
            client.write(buffer);
            buffer.clear();
            client.read(buffer);
            response = new String(buffer.array()).trim();
            System.out.println("response=" + response);
            buffer.clear();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }
}
```

* Test

```java
public class EchoTest {

    Process server;
    EchoClient client;

    @Before
    public void setUp() throws IOException, InterruptedException {
        server = EchoServer.start();
        client = EchoClient.start();
    }

    @Test
    public void givenServerClientWhenServerEchoMessageThenCorrect() {
        String resp1 = client.sendMessage("hello");
        String resp2 = client.sendMessage("world");

        assertEquals("hello", resp1);
        assertEquals("world", resp2);
    }

    @After
    public void tearDown() throws IOException {
        server.destroy();
        EchoClient.stop();
    }
}
```