# Java IO

## Java IO 类结构图

![image](../resources/java_io_struct.svg)

### `Reader`

* `BufferedReader` <br>

从字符输入流中读取文本，缓冲各个字符，从而实现字符、数组和行的高效读取。<br> 

可以指定缓冲区的大小，或者可使用默认的大小。大多数情况下，默认值就足够大了。<br> 

通常，`Reader` 所作的每个读取请求都会导致对底层字符或字节流进行相应的读取请求。因此，建议用 `BufferedReader` 包装所有其 `read()` 操作可能开销很高的 `Reader`（如 `FileReader` 和 `InputStreamReader`）。例如，<br>

```java
BufferedReader in = new BufferedReader(new FileReader("foo.in"));
```

将缓冲指定文件的输入。如果没有缓冲，则每次调用 read() 或 readLine() 都会导致从文件中读取字节，并将其转换为字符后返回，而这是极其低效的。<br>
通过用合适的 `BufferedReader` 替代每个 `DataInputStream`，可以对将 `DataInputStream` 用于文字输入的程序进行本地化。<br>

* `CharArrayReader` <br>

此类实现一个可用作字符输入流的字符缓冲区。 

* `FilterReader` <br>

用于读取已过滤的字符流的抽象类。抽象类 `FilterReader` 自身提供了一些将所有请求传递给所包含的流的默认方法。`FilterReader` 的子类应重写这些方法中的一些方法，并且还可以提供一些额外的方法和字段。 

* `PushbackReader` <br>

允许将字符推回到流的字符流 `Reader`。

* `InputStreamReader` <br>

`InputStreamReader` 是字节流通向字符流的桥梁：它使用指定的 `charset` 读取字节并将其解码为字符。它使用的字符集可以由名称指定或显式给定，或者可以接受平台默认的字符集。<br> 

每次调用 `InputStreamReader` 中的一个 `read()` 方法都会导致从底层输入流读取一个或多个字节。要启用从字节到字符的有效转换，可以提前从底层流读取更多的字节，使其超过满足当前读取操作所需的字节。<br> 

为了达到最高效率，可要考虑在 `BufferedReader` 内包装 `InputStreamReader`。例如： 

```java
BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
```

* `FileReader` <br>

用来读取字符文件的便捷类。此类的构造方法假定默认字符编码和默认字节缓冲区大小都是适当的。要自己指定这些值，可以先在 `FileInputStream` 上构造一个 `InputStreamReader`。<br>

`FileReader` 用于读取字符流。要读取原始字节流，请考虑使用 `FileInputStream`。 

* `PipedReader` <br>

传送的字符输入流。

* `StringReader` <br>

其源为一个字符串的字符流。

### `Reader`

* `BufferedWriter` <br>

将文本写入字符输出流，缓冲各个字符，从而提供单个字符、数组和字符串的高效写入。<br>

可以指定缓冲区的大小，或者接受默认的大小。在大多数情况下，默认值就足够大了。<br> 

该类提供了 `newLine()` 方法，它使用平台自己的行分隔符概念，此概念由系统属性 `line.separator` 定义。并非所有平台都使用新行符 (`'\n'`) 来终止各行。因此调用此方法来终止每个输出行要优于直接写入新行符。<br>

通常 `Writer` 将其输出立即发送到底层字符或字节流。除非要求提示输出，否则建议用 `BufferedWriter` 包装所有其 `write()` 操作可能开销很高的 `Writer`（如 `FileWriters` 和 `OutputStreamWriters`）。例如， 

```java
PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter("foo.out")));
```

将缓冲 `PrintWriter` 对文件的输出。如果没有缓冲，则每次调用 `print()` 方法会导致将字符转换为字节，然后立即写入到文件，而这是极其低效的。 

* `CharArrayWriter` <br>

此类实现一个可用作 `Writer` 的字符缓冲区。缓冲区会随向流中写入数据而自动增长。可使用 `toCharArray()` 和 `toString()` 获取数据。 

> 注：在此类上调用 `close()` 无效，并且在关闭该流后可以调用此类中的各个方法，而不会产生任何 `IOException`。 

* `FilterWriter`

用于写入已过滤的字符流的抽象类。抽象类 `FilterWriter` 自身提供了一些将所有请求传递给所包含的流的默认方法。`FilterWriter` 的子类应重写这些方法中的一些方法，并且还可以提供一些额外的方法和字段。 

* `OutputStreamWriter` <br>

`OutputStreamWriter` 是字符流通向字节流的桥梁：可使用指定的 `charset` 将要写入流中的字符编码成字节。它使用的字符集可以由名称指定或显式给定，否则将接受平台默认的字符集。<br>

每次调用 `write()` 方法都会导致在给定字符（或字符集）上调用编码转换器。在写入底层输出流之前，得到的这些字节将在缓冲区中累积。可以指定此缓冲区的大小，不过，默认的缓冲区对多数用途来说已足够大。注意，传递给 `write()` 方法的字符没有缓冲。<br>

为了获得最高效率，可考虑将 `OutputStreamWriter` 包装到 `BufferedWriter` 中，以避免频繁调用转换器。例如： 

```java
Writer out = new BufferedWriter(new OutputStreamWriter(System.out));
```

代理对 是一个字符，它由两个 `char` 值序列表示：高 代理项的范围为 `'\uD800'` 到 `'\uDBFF'`，后跟范围为 `'\uDC00'` 到 `'\uDFFF'` 的低代理项。<br>

错误代理元素 指的是后面不跟低代理项的高代理项，或前面没有高代理项的低代理项。<br>

此类总是使用字符集的默认替代序列 替代错误代理元素和不可映射的字符序列。如果需要更多地控制编码过程，则应该使用 CharsetEncoder 类。

* `FileWriter` <br>

用来写入字符文件的便捷类。此类的构造方法假定默认字符编码和默认字节缓冲区大小都是可接受的。要自己指定这些值，可以先在 `FileOutputStream` 上构造一个 `OutputStreamWriter`。<br>

文件是否可用或是否可以被创建取决于底层平台。特别是某些平台一次只允许一个 `FileWriter`（或其他文件写入对象）打开文件进行写入。在这种情况下，如果所涉及的文件已经打开，则此类中的构造方法将失败。<br>

`FileWriter` 用于写入字符流。要写入原始字节流，请考虑使用 `FileOutputStream`。 

* `PipedWriter` <br>

传送的字符输出流。

* `PrintWriter` <br>

向文本输出流打印对象的格式化表示形式。此类实现在 `PrintStream` 中的所有 `print` 方法。它不包含用于写入原始字节的方法，对于这些字节，程序应该使用未编码的字节流进行写入。<br> 

与 `PrintStream` 类不同，如果启用了自动刷新，则只有在调用 `println`、`printf` 或 `format` 的其中一个方法时才可能完成此操作，而不是每当正好输出换行符时才完成。这些方法使用平台自有的行分隔符概念，而不是换行符。<br> 

此类中的方法不会抛出 I/O 异常，尽管其某些构造方法可能抛出异常。客户端可能会查询调用 `checkError()` 是否出现错误。 

* `StringWriter` <br>

一个字符流，可以用其回收在字符串缓冲区中的输出来构造字符串。<br>

关闭 `StringWriter` 无效。此类中的方法在关闭该流后仍可被调用，而不会产生任何 `IOException`。

### `InputStream`

* `ByteArrayInputStream` <br>

`ByteArrayInputStream` 包含一个内部缓冲区，该缓冲区包含从流中读取的字节。内部计数器跟踪 `read` 方法要提供的下一个字节。<br>

关闭 `ByteArrayInputStream` 无效。此类中的方法在关闭此流后仍可被调用，而不会产生任何 `IOException`。 

* `FileInputStream` <br>

`FileInputStream` 从文件系统中的某个文件中获得输入字节。哪些文件可用取决于主机环境。 <br>

`FileInputStream` 用于读取诸如图像数据之类的原始字节流。要读取字符流，请考虑使用 `FileReader`。

* `FilterInputStream` <br>

`FilterInputStream` 包含其他一些输入流，它将这些流用作其基本数据源，它可以直接传输数据或提供一些额外的功能。`FilterInputStream` 类本身只是简单地重写那些将所有请求传递给所包含输入流的 InputStream 的所有方法。`FilterInputStream` 的子类可进一步重写这些方法中的一些方法，并且还可以提供一些额外的方法和字段。 

* `BufferedInputStream` <br>

`BufferedInputStream` 为另一个输入流添加一些功能，即缓冲输入以及支持 `mark` 和 `reset` 方法的能力。在创建 `BufferedInputStream` 时，会创建一个内部缓冲区数组。在读取或跳过流中的字节时，可根据需要从包含的输入流再次填充该内部缓冲区，一次填充多个字节。`mark` 操作记录输入流中的某个点，`reset` 操作使得在从包含的输入流中获取新字节之前，再次读取自最后一次 `mark` 操作后读取的所有字节。 

* `DataInputStream` <br>

数据输入流允许应用程序以与机器无关方式从底层输入流中读取基本 Java 数据类型。应用程序可以使用数据输出流写入稍后由数据输入流读取的数据。 
`DataInputStream` 对于多线程访问不一定是安全的。 线程安全是可选的，它由此类方法的使用者负责。 

* `PushbackInputStream` <br>

`PushbackInputStream` 为另一个输入流添加性能，即“推回 (push back)”或“取消读取 (unread)”一个字节的能力。在代码片段可以很方便地读取由特定字节值分隔的不定数量的数据字节时，这很有用；在读取终止字节后，代码片段可以“取消读取”该字节，这样，输入流上的下一个读取操作将会重新读取被推回的字节。例如，表示构成标识符字符的字节可能由表示操作符字符的字节终止；用于读取一个标识符的方法可以读取到遇到操作符为止，然后将该操作符推回以进行重读。 

* `ObjectInputStream` <br>

`ObjectInputStream` 对以前使用 `ObjectOutputStream` 写入的基本数据和对象进行反序列化。<br>

`ObjectOutputStream` 和 `ObjectInputStream` 分别与 `FileOutputStream` 和 `FileInputStream` `一起使用时，可以为应用程序提供对对象图形的持久存储。ObjectInputStream` 用于恢复那些以前序列化的对象。其他用途包括使用套接字流在主机之间传递对象，或者用于编组和解组远程通信系统中的实参和形参。<br>

`ObjectInputStream` 确保从流创建的图形中所有对象的类型与 Java 虚拟机中显示的类相匹配。使用标准机制按需加载类。<br>

只有支持 `java.io.Serializable` 或 `java.io.Externalizable` 接口的对象才能从流读取。<br>

`readObject` 方法用于从流读取对象。应该使用 Java 的安全强制转换来获取所需的类型。在 Java 中，字符串和数组都是对象，所以在序列化期间将其视为对象。读取时，需要将其强制转换为期望的类型。<br>

可以使用 `DataInput` 上的适当方法从流读取基本数据类型。<br>

默认情况下，对象的反序列化机制会将每个字段的内容恢复为写入时它所具有的值和类型。反序列化进程将忽略声明为瞬态或静态的字段。对其他对象的引用使得根据需要从流中读取这些对象。使用引用共享机制能够正确地恢复对象的图形。反序列化时始终分配新对象，这样可以避免现有对象被重写。 <br>

读取对象类似于运行新对象的构造方法。为对象分配内存并将其初始化为零 (`NULL`)。为不可序列化类调用无参数构造方法，然后从以最接近 `java.lang.object` 的可序列化类开始和以对象的最特定类结束的流恢复可序列化类的字段。<br>

例如，要从由 `ObjectOutputStream` 中的示例写入的流读取：

```java
FileInputStream fis = new FileInputStream("t.tmp");
ObjectInputStream ois = new ObjectInputStream(fis);

int i = ois.readInt();
String today = (String) ois.readObject();
Date date = (Date) ois.readObject();

ois.close();
```

类控制实现 `java.io.Serializable` 或 `java.io.Externalizable` 接口时的序列化方式。<br>

实现 `Serializable` 接口允许对象序列化，以保存和恢复对象的全部状态，并且允许类在写入流时的状态和从流读取时的状态之间变化。它自动遍历对象之间的引用，保存和恢复全部图形。<br>

在序列化和反序列化进程中需要特殊处理的 `Serializable` 类应该实现以下方法：

```java
private void writeObject(java.io.ObjectOutputStream stream) throws IOException;
private void readObject(java.io.ObjectInputStream stream) throws IOException, ClassNotFoundException; 
private void readObjectNoData() throws ObjectStreamException;
```

`readObject` 方法负责使用通过对应的 `writeObject` 方法写入流的数据，为特定类读取和恢复对象的状态。该方法本身的状态，不管是属于其超类还是属于其子类，都没有关系。恢复状态的方法是，从个别字段的 `ObjectInputStream` 读取数据并将其分配给对象的适当字段。`DataInput` 支持读取基本数据类型。<br>

尝试读取由对应的 `writeObject` 方法写入的超出自定义数据边界的对象数据将导致抛出 `OptionalDataException`（`eof` 字段值为 `true`）。超出已分配数据末尾的非对象读取以指示流末尾的方式反映数据结束：按位读取与字节读取或字节数读取一样，将返回 `-1`，基元读取将抛出 `EOFException`。如果不存在对应的 `writeObject` 方法，则默认的序列化数据的末尾标记已分配数据的末尾。<br>

从 `readExternal` 方法发出的基元和对象读取调用的行为方式一样：如果流已经定位在由相应 `writeExternal` 方法写入的数据末尾，则对象读取将抛出 `OptionalDataException`（其 `eof` 设置为 `true`），按位读取将返回 `-1`，基元读取将抛出 `EOFException`。注意，此行为不适用于使用旧 `ObjectStreamConstants.PROTOCOL_VERSION_1` 协议写入的流，在这些流中，没有划分出由 `writeExternal` 方法写入的数据末尾，因此无法检测。<br>

如果序列化流没有将给定类列为要反序列化的对象的超类，则 `readObjectNoData` 方法负责初始化其特定类的对象状态。在接收方使用的反序列化实例类的版本不同于发送方，并且接收者版本扩展的类不是发送者版本扩展的类时，此事可能发生。如果序列化流已经被篡改，也会发生这种情况；因此，不管源流是“敌意的”还是不完整的，`readObjectNoData` 方法都可以用来正确地初始化反序列化的对象。<br>

对于没有实现 `java.io.Serializable` 接口的任何对象，序列化不会对其字段进行读取或赋值。非 `serializable` 的 `Object` 的子类可以为 `serializable`。在此情况下，非 `serializable` 类必须具有无参数的构造方法以允许其字段能被初始化。在此情况下，子类负责保存和恢复非 `serializable` 类的状态。经常出现的情况是，该类的字段是可访问的（`public`、`package` 或 `protected`），或者存在可用于恢复状态的 `get` 和 `set` 方法。<br>

反序列化对象进程中发生的所有异常将由 `ObjectInputStream` 捕获并将中止读取进程。<br> 

实现 `Externalizable` 接口允许对象假定可以完全控制对象的序列化形式的内容和格式。调用 `Externalizable` 接口的方法（`writeExternal` 和 `readExternal`）来保存和恢复对象状态。当这两种方法被某个类实现时，它们可以使用 `ObjectOutput` 和 `ObjectInput` 的所有方法读写其本身的状态。对象负责处理出现的任何版本控制。<br>

`Enum` 常量的反序列化不同于普通的 `serializable` 或 `externalizable` 对象。`Enum` 常量的序列化形式只包含其名称；不传送常量的字段值。要反序列化 `enum` 常量，`ObjectInputStream` 需要从流中读取常量的名称；然后将 `enum` 常量的基本类型和接收到的常量名称作为参数，调用静态方法 `Enum.valueOf(Class, String)` 获取反序列化的常量。与其他 `serializable` 或 `externalizable` 对象一样，`enum` 常量可以作为序列化流中随后出现的反向引用的目标。不可以自定义 `enum` 常量的反序列化进程：在反序列化期间，`enum` 类型所定义的任何与类有关的 `readObject`、`readObjectNoData` 和 `readResolve` 方法都将被忽略。类似地，任何 `serialPersistentFields` 或 `serialVersionUID` 字段声明也将被忽略（所有 `enum` 类型都有一个固定的 `0L` 的 `serialVersionUID`）。 

* `PipedInputStream` <br>

管道输入流应该连接到管道输出流；管道输入流提供要写入管道输出流的所有数据字节。通常，数据由某个线程从 `PipedInputStream` 对象读取，并由其他线程将其写入到相应的 `PipedOutputStream`。不建议对这两个对象尝试使用单个线程，因为这样可能死锁线程。管道输入流包含一个缓冲区，可在缓冲区限定的范围内将读操作和写操作分离开。 如果向连接管道输出流提供数据字节的线程不再存在，则认为该管道已损坏。 

* `SequenceInputStream` <br>

`SequenceInputStream` 表示其他输入流的逻辑串联。它从输入流的有序集合开始，并从第一个输入流开始读取，直到到达文件末尾，接着从第二个输入流读取，依次类推，直到到达包含的最后一个输入流的文件末尾为止。 

### `OutputStream`

* `ByteArrayOutputStream` <br>

此类实现了一个输出流，其中的数据被写入一个 byte 数组。缓冲区会随着数据的不断写入而自动增长。可使用 `toByteArray()` 和 `toString()` 获取数据。<br>

关闭 `ByteArrayOutputStream` 无效。此类中的方法在关闭此流后仍可被调用，而不会产生任何 `IOException`。

* `FileOutputStream` <br>

文件输出流是用于将数据写入 `File` 或 `FileDescriptor` 的输出流。文件是否可用或能否可以被创建取决于基础平台。特别是某些平台一次只允许一个 `FileOutputStream`（或其他文件写入对象）打开文件进行写入。在这种情况下，如果所涉及的文件已经打开，则此类中的构造方法将失败。<br>

`FileOutputStream` 用于写入诸如图像数据之类的原始字节的流。要写入字符流，请考虑使用 `FileWriter`。 

* `FilterOutputStream` <br>

此类是过滤输出流的所有类的超类。这些流位于已存在的输出流（基础 输出流）之上，它们将已存在的输出流作为其基本数据接收器，但可能直接传输数据或提供一些额外的功能。<br>

`FilterOutputStream` 类本身只是简单地重写那些将所有请求传递给所包含输出流的 `OutputStream` 的所有方法。`FilterOutputStream` 的子类可进一步地重写这些方法中的一些方法，并且还可以提供一些额外的方法和字段。

* `BufferedOutputStream` <br>

该类实现缓冲的输出流。通过设置这种输出流，应用程序就可以将各个字节写入底层输出流中，而不必针对每次字节写入调用底层系统。 

* `DataOutputStream` <br>

数据输出流允许应用程序以适当方式将基本 Java 数据类型写入输出流中。然后，应用程序可以使用数据输入流将数据读入。 

* `PrintStream` <br>

`PrintStream` 为其他输出流添加了功能，使它们能够方便地打印各种数据值表示形式。它还提供其他两项功能。与其他输出流不同，`PrintStream` 永远不会抛出 `IOException`；而是，异常情况仅设置可通过 `checkError` 方法测试的内部标志。另外，为了自动刷新，可以创建一个 `PrintStream`；这意味着可在写入 `byte` 数组之后自动调用 `flush` 方法，可调用其中一个 `println` 方法，或写入一个换行符或字节 (`'\n'`)。 <br>

`PrintStream` 打印的所有字符都使用平台的默认字符编码转换为字节。在需要写入字符而不是写入字节的情况下，应该使用 `PrintWriter` 类。 

* `ObjectOutputStream` <br>

`ObjectOutputStream` 将 Java 对象的基本数据类型和图形写入 `OutputStream`。可以使用 `ObjectInputStream` 读取（重构）对象。通过在流中使用文件可以实现对象的持久存储。如果流是网络套接字流，则可以在另一台主机上或另一个进程中重构对象。<br>

只能将支持 `java.io.Serializable` 接口的对象写入流中。每个 `serializable` 对象的类都被编码，编码内容包括类名和类签名、对象的字段值和数组值，以及从初始对象中引用的其他所有对象的闭包。<br>

只能将支持 `java.io.Serializable` 接口的对象写入流中。每个 `serializable` 对象的类都被编码，编码内容包括类名和类签名、对象的字段值和数组值，以及从初始对象中引用的其他所有对象的闭包。 <br>

还可以使用 `DataOutput` 中的适当方法将基本数据类型写入流中。还可以使用 `writeUTF` 方法写入字符串。 <br>

对象的默认序列化机制写入的内容是：对象的类，类签名，以及非瞬态和非静态字段的值。其他对象的引用（瞬态和静态字段除外）也会导致写入那些对象。可使用引用共享机制对单个对象的多个引用进行编码，这样即可将对象的图形恢复为最初写入它们时的形状。 <br>

例如，要写入可通过 `ObjectInputStream` 中的示例读取的对象，请执行以下操作：

```java
FileOutputStream fos = new FileOutputStream("t.tmp");
ObjectOutputStream oos = new ObjectOutputStream(fos);

oos.writeInt(12345);
oos.writeObject("Today");
oos.writeObject(new Date());

oos.close();
```

在序列化和反序列化过程中需要特殊处理的类必须实现具有下列准确签名的特殊方法：

```java
private void readObject(java.io.ObjectInputStream stream) throws IOException, ClassNotFoundException;
private void writeObject(java.io.ObjectOutputStream stream) throws IOException
private void readObjectNoData() throws ObjectStreamException;
```

`writeObject` 方法负责写入特定类的对象状态，以便相应的 readObject 方法可以恢复它。该方法本身不必与属于对象的超类或子类的状态有关。状态是通过使用 `writeObject` 方法或使用 `DataOutput` 支持的用于基本数据类型的方法将各个字段写入 `ObjectOutputStream` 来保存的。 <br>

序列化操作不写出没有实现 `java.io.Serializable` 接口的任何对象的字段。不可序列化的 `Object` 的子类可以是可序列化的。在此情况下，不可序列化的类必须有一个无参数构造方法，以便允许初始化其字段。在此情况下，子类负责保存和恢复不可序列化的类的状态。经常出现的情况是，该类的字段是可访问的（`public`、`package` 或 `protected`），或者存在可用来恢复状态的 `get` 和 `set` 方法。 <br>

在 `writeObject` 和 `readObject` 方法的实现中抛出 `NotSerializableException`，可以阻止对象的序列化。`ObjectOutputStream` 将捕获异常并中止序列化进程。<br>

实现 `Externalizable` 接口允许对象假定可以完全控制对象的序列化形式的内容和格式。调用 `Externalizable` 接口的方法（`writeExternal` 和 `readExternal`）来保存和恢复对象的状态。通过类实现时，它们可以使用 `ObjectOutput` 和 `ObjectInput` 的所有方法读写它们自己的状态。对象负责处理出现的任何版本控制。<br>

`Enum` 常量的序列化不同于普通的 `serializable` 或 `externalizable` 对象。`enum` 常量的序列化形式只包含其名称；常量的字段值不被传送。为了序列化 `enum` 常量，`ObjectOutputStream` 需要写入由常量的名称方法返回的字符串。与其他 `serializable` 或 `externalizable` 对象一样，`enum` 常量可以作为序列化流中后续出现的 `back` 引用的目标。用于序列化 `enum` 常量的进程不可定制；在序列化期间，由 `enum` 类型定义的所有类特定的 `writeObject` 和 `writeReplace` 方法都将被忽略。类似地，任何 `serialPersistentFields` 或 `serialVersionUID` 字段声明也将被忽略，所有 `enum` 类型都有一个 `0L` 的固定的 `serialVersionUID`。<br>

基本数据（不包括 `serializable` 字段和 `externalizable` 数据）以块数据记录的形式写入 `ObjectOutputStream` 中。块数据记录由头部和数据组成。块数据部分包括标记和跟在部分后面的字节数。连续的基本写入数据被合并在一个块数据记录中。块数据记录的分块因子为 `1024` 字节。每个块数据记录都将填满 `1024` 字节，或者在终止块数据模式时被写入。调用 `ObjectOutputStream` 方法 `writeObject`、`defaultWriteObject` 和 `writeFields` 最初只是终止所有现有块数据记录。<br> 

* `PipedOutputStream` <br>

可以将管道输出流连接到管道输入流来创建通信管道。管道输出流是管道的发送端。通常，数据由某个线程写入 `PipedOutputStream` 对象，并由其他线程从连接的 `PipedInputStream` 读取。不建议对这两个对象尝试使用单个线程，因为这样可能会造成该线程死锁。如果某个线程正从连接的管道输入流中读取数据字节，但该线程不再处于活动状态，则该管道被视为处于毁坏状态。 

## Java IO 按操作方式

### 操作方式（类结构）

* **字节流和字符流**
    * 字节流：以字节为单位，每次次读入或读出是8位数据。可以读任何类型数据。
    * 字符流：以字符为单位，每次次读入或读出是16位数据。其只能读取字符类型数据。
* **输入流和输出流**
    * 输入流：从内存读出到文件。只能进行写操作。
    * 输入流：从文件读入到内存。只能进行读操作。

> 这里出和入都是相对系统内存而言

* **节点流和处理流**
    * 节点流：直接与数据源相连，读入或读出。
    * 处理流：与节点流一块使用，在节点流的基础上，再套接一层，套接在节点流上的就是处理流。

**为什么要有处理流？** 直接使用节点流，读写不方便，为了更快的读写文件，才有了处理流。

![image](../resources/java_io_operate.svg)

**1） 输入字节流 `InputStream`**

* `ByteArrayInputStream`、`StringBufferInputStream`、`FileInputStream` 是三种基本的介质流，它们分别从 `Byte` 数组、`StringBuffer` 和本地文件中读取数据。
* `PipedInputStream` 是从与其它线程共用的管道中读取数据。`PipedInputStream` 的一个实例要和 `PipedOutputStream` 的一个实例共同使用，共同完成管道的读取写入操作。主要用于线程操作。
* `DataInputStream` 将基础数据类型读取出来
* `ObjectInputStream` 和所有 `FilterInputStream` 的子类都是装饰流（装饰器模式的主角）。

**2）输出字节流 `OutputStream`**

* `ByteArrayOutputStream`、`FileOutputStream` 是两种基本的介质流，它们分别向 `Byte` 数组和本地文件中写入数据。
* `PipedOutputStream` 是向与其它线程共用的管道中写入数据。
* `DataOutputStream` 将基础数据类型写入到文件中
* `ObjectOutputStream` 和所有 `FilterOutputStream` 的子类都是装饰流。

### 操作方式（对照）

![image](../resources/java_io_stream.svg)

**1）字符输入流 `Reader`**

* `FileReader`、`CharReader`、`StringReader` 是三种基本的介质流，它们分在本地文件、`Char` 数组、`String` 中读取数据。
* `PipedReader` 是从与其它线程共用的管道中读取数据
* `BufferedReader`  加缓冲功能，避免频繁读写硬盘
* `InputStreamReader` 是一个连接字节流和字符流的桥梁，它将字节流转变为字符流。

**2）字符输出流 `Writer`**

* `StringWriter` 向 `String` 中写入数据。
* `CharArrayWriter` 实现一个可用作字符输入流的字符缓冲区
* `PipedWriter` 是向与其它线程共用的管道中写入数据
* `BufferedWriter`  增加缓冲功能，避免频繁读写硬盘。
* `PrintWriter` 和 `PrintStream` 将对象的格式表示打印到文本输出流。 极其类似，功能和使用也非常相似
* `OutputStreamWriter` 是 `OutputStream` 到 `Writer` 转换的桥梁，它的子类 `FileWriter` 其实就是一个实现此功能的具体类（具体可以研究一SourceCode）。功能和使用和 `OutputStream` 极其类似，后面会有它们的对应图。

## Java IO 操作对象

![image](../resources/java_io_object.svg)

除文件操作、管道操作和数组操作之外，都是处理流

**`Buffered`缓冲流（处理流）** 带缓冲区的处理流，缓冲区的作用的主要目的是：避免每次和硬盘打交道，提高数据访问的效率。

* `BufferedInputStream`
* `BufferedOutputStream`
* `BufferedReader`
* `BufferedWriter`

**转化流（处理流）**

* `InputStreamReader` 把字节转化成字符；
* `OutputStreamWriter` 把字节转化成字符

**基本类型数据流（处理流）：用于操作基本数据类型值**

因为平时若是我们输出一个8个字节的long类型或4个字节的float类型，那怎么办呢？可以一个字节一个字节输出，也可以把转换成字符串输出，但是这样转换费时间，若是直接输出该多好啊，因此这个数据流就解决了我们输出数据类型的困难。数据流可以直接输出float类型或long类型，提高了数据读写的效率。

* `DataInputStream`
* `DataOutputStream`

**打印流（处理流）**

* `PrintStream`
* `PrintWriter`

**对象流（处理流）**

把封装的对象直接输出，而不是一个个在转换成字符串再输出

* `ObjectInputStream` 对象反序列化
* `ObjectOutputStream` 对象序列化

**合并流（处理流）**

`SequenceInputStream` 可以认为是一个工具类，将两个或者多个输入流当成一个输入流依次读取。

> 参考：<br>
> [Java IO，硬骨头也能变软](https://zhuanlan.zhihu.com/p/28286559)