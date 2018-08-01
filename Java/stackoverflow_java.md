# stackoverflow

## 将InputStream转换为String

### 使用 JDk `Scanner`

```java
Scanner s = new Scanner(inputStream).useDelimiter("\\A");
String result = s.hasNext() ? s.next() : "";
```

### 使用 Jdk `InputStreamReader` 和 `StringBuilder`

```java
final int bufferSize = 1024;
final char[] buffer = new char[bufferSize];
final StringBuilder out = new StringBuilder();
Reader in = new InputStreamReader(inputStream, "UTF-8");
for (; ; ) {
    int rsz = in.read(buffer, 0, buffer.length);
    if (rsz < 0)
        break;
    out.append(buffer, 0, rsz);
}
return out.toString();
```

### 使用 JDK `ByteArrayOutputStream` 和 `inputStream.read`

```java
ByteArrayOutputStream result = new ByteArrayOutputStream();
byte[] buffer = new byte[1024];
int length;
while ((length = inputStream.read(buffer)) != -1) {
    result.write(buffer, 0, length);
}
// StandardCharsets.UTF_8.name() > JDK 7
return result.toString("UTF-8");
```

### 使用 JDK `BufferedReader `

```java
String newLine = System.getProperty("line.separator");
BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
StringBuilder result = new StringBuilder();
String line; boolean flag = false;
while ((line = reader.readLine()) != null) {
    result.append(flag? newLine: "").append(line);
    flag = true;
}
return result.toString();
```

> 会将换行符转换为系统默认换行符

### 使用 JDK `BufferedInputStream` 和 `ByteArrayOutputStream`

```java
BufferedInputStream bis = new BufferedInputStream(inputStream);
ByteArrayOutputStream buf = new ByteArrayOutputStream();
int result = bis.read();
while(result != -1) {
    buf.write((byte) result);
    result = bis.read();
}
// StandardCharsets.UTF_8.name() > JDK 7
return buf.toString("UTF-8");
```

### 使用 JDK `inputStream.read()` 和 `StringBuilder`

```java
int ch;
StringBuilder sb = new StringBuilder();
while((ch = inputStream.read()) != -1)
    sb.append((char)ch);
reset();
return sb.toString();
```

> 存在 Unicode 编码问题

### 使用 Java8 Stream

```java
String result = new BufferedReader(new InputStreamReader(inputStream))
    .lines()
    .collect(Collectors.joining("\n"));
```

> 会将不同换行符转换为 `\n`

### 使用 parallel Stream

```java
String result = new BufferedReader(new InputStreamReader(inputStream))
    .lines()
    .parallel()
    .collect(Collectors.joining("\n"));
```

> 会将不同换行符转换为 `\n`

### 使用 Apache Utils

```java
String result = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
```

### 使用 Apache Commons

```java
StringWriter writer = new StringWriter();
IOUtils.copy(inputStream, writer, "UTF-8");
return writer.toString();
```

### 使用 Guava

```java
String result = CharStreams.toString(new InputStreamReader(inputStream, Charsets.UTF_8));
```

> [原问题](http://stackoverflow.com/questions/309424/read-convert-an-inputstream-to-a-string)

## 将 Array 转化为 List

```java
Arrays.asList(array)
```

这种方式有两个问题：

1. `Arrays.asList()` 返回的是 `Arrays` 内部静态类，而不是 `Java.util.ArrayList`的类。这个 `java.util.Arrays.ArrayList` 有 `set()`，`get()` ，`contains()` 方法，但是没有任何 `add()` 方法，所以它是固定大小的，如果你对它做 `add` 或者 `remove` ，都会抛 `UnsupportedOperationException` 。

2. 如果修改数组的值，list中的对应值也会改变

```java
new ArrayList<Element>(Arrays.asList(array));

Collections.addAll(arraylist, array);
```

> [原问题](https://stackoverflow.com/questions/157944/create-arraylist-from-array)

## HashMap 遍历

在Java中有多种遍历HashMAp的方法。让我们回顾一下最常见的方法和它们各自的优缺点。由于所有的Map都实现了Map接口，所以接下来方法适用于所有Map（如：HaspMap，TreeMap,LinkedMap,HashTable,etc）

### 方法1 使用 For-Each 迭代 entries

这是最常见的方法，并在大多数情况下更可取的。当你在循环中需要使用Map的键和值时，就可以使用这个方法

```java
Map<Integer, Integer> map = new HashMap<Integer, Integer>();
for(Map.Entry<Integer, Integer> entry : map.entrySet()){
	System.out.println("key = " + entry.getKey() + ", value = " + entry.getValue())
}
```

> 注意：For-Each 循环是Java5新引入的，所以只能在Java5以上的版本中使用。如果你遍历的 map 是 `null` 的话，For-Each循环会抛出 `NullPointerException` 异常，所以在遍历之前你应该判断是否为空引用。

### 方法2 使用 For-Each 迭代 keys 和 values

如果你只需要用到 map 的 keys 或 values 时，你可以遍历 `KeySet` 或者 `values` 代替 `entrySet`

```java
Map<Integer, Integer> map = new HashMap<Integer, Integer>();

//iterating over keys only
for (Integer key : map.keySet()) {
    System.out.println("Key = " + key);
}

//iterating over values only
for (Integer value : map.values()) {
    System.out.println("Value = " + value);
}
```

这个方法比 `entrySet` 迭代具有轻微的性能优势(大约快10%)并且代码更简洁

### 方法3 使用 Iterator 迭代

使用泛型

```java
Map<Integer, Integer> map = new HashMap<Integer, Integer>();
Iterator<Map.Entry<Integer, Integer>> entries = map.entrySet().iterator();
while (entries.hasNext()) {
	Map.Entry<Integer, Integer> entry = entries.next();
	System.out.println("Key = " + entry.getKey() + ", Value = " + entry.getValue());
}
```

不使用泛型

```java
Map map = new HashMap();
Iterator entries = map.entrySet().iterator();
while (entries.hasNext()) {
    Map.Entry entry = (Map.Entry) entries.next();
    Integer key = (Integer)entry.getKey();
    Integer value = (Integer)entry.getValue();
    System.out.println("Key = " + key + ", Value = " + value);
}
```

你可以使用同样的技术迭代 `keyset` 或者 `values`

这个似乎有点多余但它具有自己的优势。首先，它是遍历老java版本map的唯一方法。另外一个重要的特性是可以让你在迭代的时候从map中删除entries的(通过调用 `iterator.remover()` )唯一方法。如果你试图在For-Each迭代的时候删除entries，你将会得到unpredictable resultes 异常。

从性能方法看，这个方法等价于使用For-Each迭代

### 方法4 迭代keys并搜索values（低效的）

```java
	Map<Integer, Integer> map = new HashMap<Integer, Integer>();
	for (Integer key : map.keySet()) {
    	Integer value = map.get(key);
    	System.out.println("Key = " + key + ", Value = " + value);
	}
```

这个方法看上去比方法1更简洁，但是实际上它更慢更低效，通过 key 得到 value 值更耗时（这个方法在所有实现map接口的map中比方法1慢20%-200%）。如果你安装了 FindBugs，它将检测并警告你这是一个低效的迭代。这个方法应该避免

### 总结

如果你只需要使用key或者value使用方法2，如果你坚持使用java的老版本（java 5 以前的版本）或者打算在迭代的时候移除entries，使用方法3。其他情况请使用1方法。避免使用4方法。

> [原问题](http://stackoverflow.com/questions/1066589/iterate-through-a-hashmap)

## 修饰符作用范围

修饰符  |   当前类  |   同 包   |   子 类   |   其他包
--- |   --- |   --- |   --- |   ---
`public`    |   √   |   √   |   √   |   √
`protected`	|   √   |   √   |   √   |   ×
`default`	|   √   |   √   |   ×   |   ×
`private`	|   √   |   ×   |   ×   |   ×

> [原问题](https://stackoverflow.com/questions/215497/in-java-difference-between-package-private-public-protected-and-private)


## 如何测试一个数组是否包含指定的值

### 使用 JDK

```java
Arrays.asList(test).contains("123");
```

### 使用 Apache Commons Lang 

```java
ArrayUtils.contains(test,"123");
```

### 使用 Java 8

```java
Stream.of(test).anyMatch(x->x=="test");

// 基本类型
IntStream.of(nums).anyMatch(x->x==4);
```

> [原问题](https://stackoverflow.com/questions/1128723/how-can-i-test-if-an-array-contains-a-certain-value)

## 重写（Override） `equals` 和 `hashCode` 方法时应考虑的问题

```java
public class Person {
    private String name;
    private int age;
    // ...

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 31). // two randomly chosen prime numbers
            // if deriving: appendSuper(super.hashCode()).
            append(name).
            append(age).
            toHashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Person))
            return false;
        if (obj == this)
            return true;

        Person rhs = (Person) obj;
        return new EqualsBuilder().
            // if deriving: appendSuper(super.equals(obj)).
            append(name, rhs.name).
            append(age, rhs.age).
            isEquals();
    }
}
```

## 合并两个数组

### 使用 JDK

```java
// 使用非泛型
public Foo[] concat(Foo[] a, Foo[] b) {
    int aLen = a.length;
    int bLen = b.length;
    Foo[] c= new Foo[aLen+bLen];
    System.arraycopy(a, 0, c, 0, aLen);
    System.arraycopy(b, 0, c, aLen, bLen);
    return c;
}
```

```java
// 使用泛型
public <T> T[] concatenate (T[] a, T[] b) {
    int aLen = a.length;
    int bLen = b.length;

    @SuppressWarnings("unchecked")
    T[] c = (T[]) Array.newInstance(a.getClass().getComponentType(), aLen+bLen);
    System.arraycopy(a, 0, c, 0, aLen);
    System.arraycopy(b, 0, c, aLen, bLen);

    return c;
}
```

### 使用 Apache Common Lang

```java
String[] both = ArrayUtils.addAll(first, second);
```

## 通过 String 查找 Enum

定义一个枚举

```java
public enum Blah{
    A, B, C, D
}
```

通过字符串 `A` 获取 `Blah.A`

```java
Blah.valueOf("A");
```

## `finally` 总会被执行？

1. 使用 `System.exit()` ；
2. jvm 崩溃；
3. 其他线程干扰了现在运行的线程（通过 `interrupt` 方法）；

> [原问题](https://stackoverflow.com/questions/65035/does-finally-always-execute-in-java?page=1&tab=votes#tab-top)

## 创建一个文件并写入内容

### 创建文本文件

```java
PrintWriter writer = new PrintWriter("the-file-name.txt", "UTF-8");
writer.println("The first line");
writer.println("The second line");
writer.close();
```

### 创建二进制文件

```java
byte data[] = ...
FileOutputStream out = new FileOutputStream("the-file-name");
out.write(data);
out.close();
```

### 创建文本文件 Java7+

```java
List<String> lines = Arrays.asList("The first line", "The second line");
Path file = Paths.get("the-file-name.txt");
Files.write(file, lines, Charset.forName("UTF-8"));
//Files.write(file, lines, Charset.forName("UTF-8"), StandardOpenOption.APPEND);
```

### 创建二进制文件 Java7+

```java
byte data[] = ...
Path file = Paths.get("the-file-name");
Files.write(file, data);
//Files.write(file, data, StandardOpenOption.APPEND);
```

> [原问题](https://stackoverflow.com/questions/2885173/how-do-i-create-a-file-and-write-to-it-in-java)

## Java `foreach` 工作原理

```java
// add "monkey", "donkey", "skeleton key" to someList
List<String> someList = new ArrayList<String>();

for (String item : someList) {
    System.out.println(item);
}
```

相当于

```java
for (Iterator<String> i = someIterable.iterator(); i.hasNext();) {
    String item = i.next();
    System.out.println(item);
}
```

## 1927 年两个时间相减会得到奇怪结果

```java
public static void main(String[] args) throws ParseException {
    SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
    String str3 = "1927-12-31 23:54:07";  
    String str4 = "1927-12-31 23:54:08";  
    Date sDt3 = sf.parse(str3);  
    Date sDt4 = sf.parse(str4);  
    long ld3 = sDt3.getTime() /1000;  
    long ld4 = sDt4.getTime() /1000;
    System.out.println(ld4-ld3);
}

// 353
```

```java
String str3 = "1927-12-31 23:54:08";  
String str4 = "1927-12-31 23:54:09";  

// 1
```

```
java version "1.6.0_22"
Java(TM) SE Runtime Environment (build 1.6.0_22-b04)
Dynamic Code Evolution Client VM (build 0.2-b02-internal, 19.0-b04-internal, mixed mode)

Timezone(`TimeZone.getDefault()`):

sun.util.calendar.ZoneInfo[id="Asia/Shanghai",
offset=28800000,dstSavings=0,
useDaylight=false,
transitions=19,
lastRule=null]

Locale(Locale.getDefault()): zh_CN
```

因为1927年11月31日上海的时区变了。在1927年12月31日的午夜，时钟回调了5分52秒，所以 `1927-12-31 23:54:08` 这个时间实际上发生了两次。

[原问题](https://stackoverflow.com/questions/6841333/why-is-subtracting-these-two-times-in-1927-giving-a-strange-result)

## 计算 MD5 值

```java
byte[] byteOfData = test.getBytes(Charset.forName("utf-8"));
MessageDigest md = MessageDigest.getInstance("md5");
byte[] md5Value = md.digest(byteOfData);
```

如果需要计算的数据量大，可以先循环调用 `md.update(byteOfData)` 来加载数据，最后调用 `md.digest()` 

## 一种奇怪的内部类定义方法

```java
class A {
    int t() { return 1; }
    static A a =  new A() { int t() { return 2; } };
}
```

**测试了，好像不行**

## 如何创建泛型数组

**检查：强类型**

```java
public class GenSet<E> {

    private E[] a;

    public GenSet(Class<E> c, int s) {
        // Use Array native method to create array
        // of a type only known at run time
        @SuppressWarnings("unchecked")
        final E[] a = (E[]) Array.newInstance(c, s);
        this.a = a;
    }

    E get(int i) {
        return a[i];
    }
}
```

**未检查：弱类型**

```java
public class GenSet<E> {

    private Object[] a;

    public GenSet(int s) {
        a = new Object[s];
    }

    E get(int i) {
        @SuppressWarnings("unchecked")
        final E e = (E) a[i];
        return e;
    }
}
```

上述代码在编译期能够通过，但因为泛型擦除的缘故，在程序执行过程中，数组的类型有且仅有 `Object` 类型存在，这个时候如果我们强制转化为`E`类型的话，在运行时会有 `ClassCastException` 抛出。所以，要确定好泛型的上界。

```java
public class GenSet<E extends Foo> { // E has an upper bound of Foo

    private Foo[] a; // E erases to Foo, so use Foo[]

    public GenSet(int s) {
        a = new Foo[s];
    }

    ...
}
```

[原问题](https://stackoverflow.com/questions/529085/how-to-create-a-generic-array-in-java)

## 获取完整的堆栈信息

```java
Thread.currentThread().getStackTrace();
```

## 一行代码初始化列表

```java
List<String> list =new ArrayList<String>(){{
    add("A");
    add("B");
    add("C");
}};
```

## 初始化静态 Map

```java
public class Test {
    private static final Map<Integer, String> myMap;
    static {
        Map<Integer, String> aMap = ....;
        aMap.put(1, "one");
        aMap.put(2, "two");
        myMap = Collections.unmodifiableMap(aMap);
    }
}
```

**使用 Guava**

```java
static final Map<Integer, String> MY_MAP = ImmutableMap.of(
    1, "one",
    2, "two"
);
```

元素数量较多（超过 5 个）时使用下面方式

```java
static final Map<Integer, String> MY_MAP = ImmutableMap.<Integer, String>builder()
    .put(1, "one")
    .put(2, "two")
    // ... 
    .put(15, "fifteen")
    .build();
```
