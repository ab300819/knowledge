### #网络接口

#### 1. 检索网络接口

```java
NetworkInterface nif = NetworkInterface.getByName("lo");

byte[] ip = new byte[] { 127, 0, 0, 1 };
NetworkInterface nif = NetworkInterface.getByInetAddress(InetAddress.getByAddress(ip));

NetworkInterface nif = NetworkInterface.getByInetAddress(InetAddress.getByName("localhost"));

NetworkInterface nif = NetworkInterface.getByInetAddress(InetAddress.getLocalHost());

NetworkInterface nif = NetworkInterface.getByInetAddress(InetAddress.getLoopbackAddress());

// java7
NetworkInterface nif = NetworkInterface.getByIndex(int index);

Enumeration<NetworkInterface> nets = NetworkInterface.getNetworkInterfaces();
for (NetworkInterface nif: Collections.list(nets)) {
    //do something with the network interface
}
```

#### 2. 网络接口参数

获取 ip 地址

```java
NetworkInterface nif = NetworkInterface.getByName("lo");
Enumeration<InetAddress> addressEnum = nif.getInetAddresses();
InetAddress address = addressEnum.nextElement();

assertEquals("127.0.0.1", address.getHostAddress());
```

通过 `getInterfaceAddresses()` 获取 `InterfaceAddress` 实例列表

```java
NetworkInterface nif = NetworkInterface.getByName("lo");
List<InterfaceAddress> addresses = nif.getInterfaceAddresses();
InterfaceAddress address = addresses.get(0);

InetAddress localAddress = address.getAddress();
InetAddress broadCastAddress = address.getBroadcast();

assertEquals("127.0.0.1", localAddress.getHostAddress());
assertEquals("127.255.255.255", broadCastAddress.getHostAddress());
```

### #16进制和ASCII互转

* ASCII To Hex
```java
private  String asciiToHex(String asciiStr) {
    char[] chars = asciiStr.toCharArray();
    StringBuilder hex = new StringBuilder();
    for (char ch : chars) {
        hex.append(Integer.toHexString((int) ch));
    }

    return hex.toString();
}
```

* Hex To ASCII
```java
public  String hexToAscii(String hexStr) {
    StringBuilder output = new StringBuilder("");

    for (int i = 0; i < hexStr.length(); i += 2) {
        String str = hexStr.substring(i, i + 2);
        output.append((char) Integer.parseInt(str, 16));
    }

    return output.toString();
}
```

### #截图

```java
Rectangle rec = new Rectangle(Toolkit.getDefaultToolkit().getScreenSize());
Robot robot = new Robot();
BufferedImage img = robot.createScreenCapture(rec);
ImageIO.write(img, "jpg", new File("src/test/resources/test.jpg "));
```

### #UDP

UDP 分为两大类：
* `DatagramPacket` - 将数据字节填充到UDP包
* `DatagramSocket` - 发送包

服务端
```java
public class EchoServerUDP extends Thread {

    private DatagramSocket socket;
    private boolean running;
    private byte[] buf = new byte[256];

    public EchoServerUDP() throws SocketException {
        socket = new DatagramSocket(4445);
    }

    @Override
    public void run() {
        running = true;
        while (running) {
            DatagramPacket packet = null;
            packet = new DatagramPacket(buf, buf.length);

            try {
                socket.receive(packet);
            } catch (IOException e) {
                e.printStackTrace();
            }

            InetAddress address = packet.getAddress();
            int port = packet.getPort();
            packet = new DatagramPacket(buf, buf.length, address, port);
            String received = new String(packet.getData(), 0, packet.getLength());

            if (received.equals("end")) {
                running = false;
                continue;
            }
            try {
                socket.send(packet);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        socket.close();
    }
}
```

客户端
```java
public class EchoClientUDP {

    private DatagramSocket socket;
    private InetAddress address;

    private byte[] buf;

    public EchoClientUDP() throws SocketException, UnknownHostException {
        socket = new DatagramSocket();
        address = InetAddress.getByName("localhost");
    }

    public String sendEcho(String msg) throws IOException {
        buf = msg.getBytes();
        DatagramPacket packet = new DatagramPacket(buf, buf.length, address, 4445);
        socket.send(packet);
        packet = new DatagramPacket(buf, buf.length);
        socket.receive(packet);
        String received = new String(packet.getData(), 0, packet.getLength());
        return received;
    }

    public void close() {
        socket.close();
    }

}
```

测试
```java
public class EchoUDPTest {

    EchoClientUDP client;

    @Before
    public void setUp() throws Exception {
        new EchoServerUDP().start();
        client = new EchoClientUDP();
    }

    @Test
    public void sendAndReceivePacket() throws Exception {
        String echo = client.sendEcho("hello server");
        assertEquals("hello server", echo);
        echo = client.sendEcho("server is working");
        assertFalse(echo.equals("hello server"));
    }

    @After
    public void tearDown() throws Exception {
        client.sendEcho("end");
        client.close();
    }
}
```

### #获取运行中方法的名称

* 使用 `getEnclosingMethod()`
```java
String methodName = new Object() {
}
        .getClass()
        .getEnclosingMethod()
        .getName();
assertEquals("giveObject", methodName);
```

* 使用 `Throwable` Stack Trace
```java
StackTraceElement[] stackTrace = new Throwable().getStackTrace();
assertEquals("usingThrowableStackTrace", stackTrace[0].getMethodName());
```

* 使用 `Thread` Stack Trace
```java
StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
assertEquals("usingThreadStackTrace", stackTrace[1].getMethodName());
```

### #[How to Find all Getters Returning Null](http://www.baeldung.com/java-getters-returning-null)

### #[Changing Annotation Parameters At Runtime](http://www.baeldung.com/java-reflection-change-annotation-params)

* 注解
```java
@Retention(RetentionPolicy.RUNTIME)
public @interface Greeter {
    String greet() default "";
}
```

* 测试类
```java
@Greeter(greet = "Good morning")
public class Greetings {
}
```

* 封装方法
```java
public class DynamicGreeter implements Greeter {

    private String greet;

    public DynamicGreeter(String greet) {
        this.greet = greet;
    }

    @Override
    public Class<? extends Annotation> annotationType() {
        return DynamicGreeter.class;
    }

    @Override
    public String greet() {
        return greet;
    }
}
```

* 运行时更改注解值
```java
public class GreetingAnnotation {

    private static final String ANNOTATION_METHOD = "annotationData";
    private static final String ANNOTATION_FIELDS = "declaredAnnotations";
    private static final String ANNOTATIONS = "annotations";

    public static void main(String... args) {
        Greeter greetings = Greetings.class.getAnnotation(Greeter.class);
        System.err.println("Hello there, " + greetings.greet() + " !!");

        Greeter targetValue = new DynamicGreeter("Good evening");
        alterAnnotationValueJDK8(Greetings.class, Greeter.class, targetValue);
//        alterAnnotationValueJDK7(Greetings.class, Greeter.class, targetValue);

        greetings = Greetings.class.getAnnotation(Greeter.class);
        System.err.println("Hello there, " + greetings.greet() + " !!");
    }

    @SuppressWarnings("unchecked")
    public static void alterAnnotationValueJDK8(Class<?> targetClass, Class<? extends Annotation> targetAnnotation, Annotation targetValue) {
        try {
            Method method = Class.class.getDeclaredMethod(ANNOTATION_METHOD, null);
            method.setAccessible(true);

            Object annotationData = method.invoke(targetClass);

            Field annotations = annotationData.getClass().getDeclaredField(ANNOTATIONS);
            annotations.setAccessible(true);

            Map<Class<? extends Annotation>, Annotation> map = (Map<Class<? extends Annotation>, Annotation>) annotations.get(annotationData);
            map.put(targetAnnotation, targetValue);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @SuppressWarnings("unchecked")
    public static void alterAnnotationValueJDK7(Class<?> targetClass, Class<? extends Annotation> targetAnnotation, Annotation targetValue) {
        try {
            Field annotations = Class.class.getDeclaredField(ANNOTATIONS);
            annotations.setAccessible(true);

            Map<Class<? extends Annotation>, Annotation> map = (Map<Class<? extends Annotation>, Annotation>) annotations.get(targetClass);
            System.out.println(map);
            map.put(targetAnnotation, targetValue);
            System.out.println(map);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### #合并 Java `Stream`

#### 1. Using Plain Java

```java
// 合并两个流
Stream<Integer> stream1 = Stream.of(1, 2, 3);
Stream<Integer> stream2 = Stream.of(4, 5, 6);
Stream<Integer> resultStream = Stream.concat(stream1, stream2);
assertEquals(Arrays.asList(1, 2, 3, 4, 5, 6)
        , resultStream.collect(Collectors.toList()));

// 合并多个流
Stream<Integer> stream1 = Stream.of(1, 3, 5);
Stream<Integer> stream2 = Stream.of(2, 4, 6);
Stream<Integer> stream3 = Stream.of(18, 15, 36);
Stream<Integer> stream4 = Stream.of(99);
Stream<Integer> resultStream = Stream
        .of(stream1, stream2, stream3, stream4)
        .flatMap(i -> i);
assertEquals(Arrays.asList(1, 3, 5, 2, 4, 6, 18, 15, 36, 99), resultStream.collect(Collectors.toList()));
```

#### 2. Using StreamEx

```java
// 合并多个流
Stream<Integer> resultingStream = StreamEx.of(stream1)
    .append(stream2)
    .append(stream3)
    .append(stream4);

// 在元素前添加元素
Stream<String> stream1 = Stream.of("foo", "bar");
Stream<String> openingBracketStream = Stream.of("[");
Stream<String> closingBracketStream = Stream.of("]");

Stream<String> resultingStream = StreamEx.of(stream1)
    .append(closingBracketStream)
    .prepend(openingBracketStream);

assertEquals(
  Arrays.asList("[", "foo", "bar", "]"),
  resultingStream.collect(Collectors.toList()));
```

#### 3. Using jOOλ

```java
// 合并多个流
Stream<Integer> seq1 = Stream.of(1, 3, 5);
Stream<Integer> seq2 = Stream.of(2, 4, 6);

Stream<Integer> resultingSeq = Seq.ofType(seq1, Integer.class)
    .append(seq2);

assertEquals(
    Arrays.asList(1, 3, 5, 2, 4, 6),
    resultingSeq.collect(Collectors.toList()));

// 在元素前添加元素
Stream<String> seq = Stream.of("foo", "bar");
Stream<String> openingBracketSeq = Stream.of("[");
Stream<String> closingBracketSeq = Stream.of("]");

Stream<String> resultingStream = Seq.ofType(seq, String.class)
    .append(closingBracketSeq)
    .prepend(openingBracketSeq);

Assert.assertEquals(
    Arrays.asList("[", "foo", "bar", "]"),
    resultingStream.collect(Collectors.toList()));
```

### #[The Difference Between `map()` and `flatMap()`](http://www.baeldung.com/java-difference-map-and-flatmap)

### #获取 `Stream` 中的最后一个元素

* 使用 `reduce()`
```java
List<String> valueList = new ArrayList<>();
valueList.add("Joe");
valueList.add("Think");
valueList.add("Test");
valueList.add("Hong");
valueList.add("Kong");

Stream<String> stream = valueList.stream();
String result = stream
        .reduce((first, second) -> second)
        .orElse(null);
```

* 使用 `skip()` (可能会影响性能)
```java
List<String> valueList = new ArrayList<>();
valueList.add("Joe");
valueList.add("Think");
valueList.add("Test");
valueList.add("Hong");
valueList.add("Kong");

long count = valueList.stream().count();
Stream<String> stream = valueList.stream();

String result = stream.skip(count - 1).findFirst().get();
```

* 获取无限流最后一个元素
```java
Stream<Integer> stream = Stream.iterate(0, i -> i + 1);
stream.reduce((first, second) -> second).orElse(null);
```

### #将字符串转化为字符流

* 使用 `chars()`

```java
String testString = "String";
Stream<Character> characterStream = testString
        .chars()
        .mapToObj(c -> (char) c);
```

* 使用 `codePoints()`

```java
String testString = "String";
Stream<Character> characterStream = testString
        .codePoints()
        .mapToObj(c -> (char) c);
```

### #获得两个日期之间的所有日期

* Using Java 7
```java
public List<Date> getDatesBetweenUsingJava7(Date startDate, Date endDate) {

    List<Date> datesInRange = new ArrayList<>();
    Calendar startCalendar = new GregorianCalendar();
    startCalendar.setTime(startDate);
    Calendar endCalendar = new GregorianCalendar();
    endCalendar.setTime(endDate);

    while (startCalendar.before(endCalendar)) {
        Date result = startCalendar.getTime();
        datesInRange.add(result);
        startCalendar.add(Calendar.DATE, 1);
    }
    return datesInRange;
```

* Using Java 8
```java
public List<LocalDate> getDatesBetweenUsingJava8(LocalDate startDate, LocalDate endDate) {
    long numOfDayBetween = ChronoUnit.DAYS.between(startDate, endDate);
    return IntStream.iterate(0, i -> i + 1)
            .limit(numOfDayBetween)
            .mapToObj(i -> startDate.plusDays(i))
            .collect(Collectors.toList());
}
```

* Using Java 9
```java
public List<LocalDate> getDatesBetweenUsingJava9(LocalDate startDate, LocalDate endDate) {
  
    return startDate
            .datesUntil(endDate)
            .collect(Collectors.toList());
}
```

### #[Guide to Escaping Characters in Java RegExps](http://www.baeldung.com/java-regexp-escape-char)