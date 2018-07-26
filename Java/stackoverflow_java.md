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

