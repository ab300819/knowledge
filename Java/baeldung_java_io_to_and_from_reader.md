### From Reader

#### Reader to String

##### 1. With Java

```java
StringReader reader = new StringReader("With Java");
int intValueOfChar;
String targetString = "";
while ((intValueOfChar = reader.read()) != -1) {
    targetString += (char) intValueOfChar;
}

reader.close();
```

with buffer

```java
Reader initReader = new StringReader("With Java");
char[] arr = new char[8 * 1024];
StringBuilder buffer = new StringBuilder();
int numCharsRead;
while ((numCharsRead = initReader.read(arr, 0, arr.length)) != -1) {
    buffer.append(arr, 0, numCharsRead);
}

initReader.close();
String targetString = buffer.toString();
```

##### 2. With Guava

```java
Reader initReader = CharSource.wrap("With Guava").openStream();
String targetString = CharStreams.toString(initReader);
initReader.close();
```

##### 3. With Commons IO

```java
Reader initReader = new StringReader("With Apache Commons");
String targetString = org.apache.commons.io.IOUtils.toString(initReader);
initReader.close();
```

#### Reader to Byte Array

##### 1. With Java

```java
Reader initReader = new StringReader("With Java");

char[] charArray = new char[8 * 1024];
StringBuilder builder = new StringBuilder();
int numCharsRead;
while ((numCharsRead = initReader.read(charArray, 0, charArray.length)) != -1) {
    builder.append(charArray, 0, numCharsRead);
}

byte[] targetArray = builder.toString().getBytes(StandardCharsets.UTF_8);

initReader.close();
```

##### 2. With Guava

```java
Reader initReader = CharSource.wrap("With Guava").openStream();

byte[] targetArray = CharStreams.toString(initReader).getBytes();

initReader.close();
```

##### 3. With Commons IO

```java
StringReader initReader = new StringReader("With Commons IO");

byte[] targetArray = org.apache.commons.io.IOUtils.toByteArray(initReader);

initReader.close();
```

#### Write a Reader to File

##### 1. With Java

```java
Reader initReader = new StringReader("With Java");

int intValueOfChar;
StringBuilder buffer = new StringBuilder();
while ((intValueOfChar = initReader.read()) != -1) {
    buffer.append((char) intValueOfChar);
}
initReader.close();

File targetFile = new File("src/test/resources/targetFile.txt");
targetFile.createNewFile();

Writer targetFileWriter = new FileWriter(targetFile);
targetFileWriter.write(buffer.toString());
targetFileWriter.close();
```

##### 2. With Guava

```java
Reader initReader = new StringReader("With Guava");

File targetFile = new File("src/test/resources/targetFileGuava.txt");
Files.touch(targetFile);
CharSink charSink = Files.asCharSink(targetFile, Charset.defaultCharset(), FileWriteMode.APPEND);
charSink.writeFrom(initReader);

initReader.close();
```

##### 3. With Apache Commons IO

```java
Reader initReader = new CharSequenceReader("With Apache Commons IO");

File targetFile = new File("src/test/resources/targetFileApache.txt");
FileUtils.touch(targetFile);
byte[] buffer = IOUtils.toByteArray(initReader);
FileUtils.writeByteArrayToFile(targetFile, buffer);

initReader.close();
```

### To Reader

#### String to Reader

```java
// With Plain Java
String initString = "With Java";
Reader targetReader = new StringReader(initString);
targetReader.close();

// With Guava
String initString = "With Guava";
Reader targetReader = CharSource.wrap(initString).openStream();
targetReader.close();

// With Apache Commons IO
String initString = "With Apache Commons IO";
Reader targetReader = new CharSequenceReader(initString);
targetReader.close();
```

#### Byte Array to Reader

```java
// With Plain Java
byte[] initArray = "With JAva".getBytes(StandardCharsets.UTF_8);
Reader targetReader = new StringReader(new String(initArray));
targetReader.close();

// With InputStreamReader , With Plain Java
byte[] initArray = "With Java".getBytes(StandardCharsets.UTF_8);
Reader targetReader = new InputStreamReader(new ByteArrayInputStream(initArray));
targetReader.close();

// With Guava
byte[] initArray = "With Guava".getBytes(StandardCharsets.UTF_8);
String bufferString = new String(initArray);
Reader targetReader = CharSource.wrap(bufferString).openStream();
targetReader.close();

// With Apache Commons IO
byte[] initArray = "With ApacheCommonsIO".getBytes(StandardCharsets.UTF_8);
Reader targetReader = new CharSequenceReader(new String(initArray));
targetReader.close();
```

#### File to Reader

```java
// With Plain Java
File initFile = new File("src/test/resources/targetFile.txt");
initFile.createNewFile();
Reader targetReader = new FileReader(initFile);
targetReader.close();

// With Guava
File initFile=new File("src/test/resources/targetFile.txt");
Files.touch(initFile);
Reader targetReader=Files.newReader(initFile,StandardCharsets.UTF_8);
targetReader.close();

// With Commons IO
File initFile=new File("src/test/resources/targetFile.txt");
FileUtils.touch(initFile);
FileUtils.write(initFile,"With Apache Commons",StandardCharsets.UTF_8);
byte[] buffer=FileUtils.readFileToByteArray(initFile);
Reader targetReader=new CharSequenceReader(new String(buffer));
targetReader.close();
```

#### InputStream to Reader

```java
// With Java
InputStream initStream = new ByteArrayInputStream("With Java".getBytes(StandardCharsets.UTF_8));
Reader targetReader = new InputStreamReader(initStream);
targetReader.close();

// With Guava
InputStream inputStream = ByteSource.wrap("With Guava".getBytes(StandardCharsets.UTF_8)).openStream();
byte[] buffer = ByteStreams.toByteArray(inputStream);
Reader targetReader = CharSource.wrap(new String(buffer)).openStream();
targetReader.close();

// With Commons IO
InputStream initStream = IOUtils.toInputStream("With Commons IO");

byte[] buffer = IOUtils.toByteArray(initStream);
Reader targetReader = new CharSequenceReader(new String(buffer));
targetReader.close();
```