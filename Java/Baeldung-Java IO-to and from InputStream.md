### From InputStream

#### Java InputStream to String

##### 1. Converting with Guava

```java
String originalString = randomAlphabetic(8);
InputStream inputStream = new ByteArrayInputStream(originalString.getBytes());

ByteSource byteSource = new ByteSource() {
    @Override
    public InputStream openStream() {
        return inputStream;
    }
};

String text = byteSource.asCharSource(Charsets.UTF_8).read();
assertThat(text, equalTo(originalString));
```

* first – we wrap our InputStream a ByteSource – and as far as I’m aware, this is the easiest way to do so
* then – we view our ByteSource as a CharSource with a UTF8 charset.
* finally – we use the CharSource to read it as a String.

```java
String originalString = randomAlphabetic(8);
InputStream inputStream = new ByteArrayInputStream(originalString.getBytes());

String text = null;

// use the try-with-resources syntax
try (final Reader reader = new InputStreamReader(inputStream)) {
    text = CharStreams.toString(reader);
}

assertThat(text, equalTo(originalString));
```

##### 2. Converting with Apache Commons IO


```java
String originalString = randomAlphabetic(8);
InputStream inputStream = new ByteArrayInputStream(originalString.getBytes());

String text = IOUtils.toString(inputStream, StandardCharsets.UTF_8.name());
assertThat(text, equalTo(originalString));

// use a StringWriter to do the conversion
String originalString = randomAlphabetic(8);
InputStream inputStream = new ByteArrayInputStream(originalString.getBytes());

StringWriter writer = new StringWriter();
String encoding = StandardCharsets.UTF_8.name();
IOUtils.copy(inputStream, writer, encoding);

assertThat(writer.toString(), equalTo(originalString));
```

##### 3. Converting with Java – InputStream

```java
String originalString = randomAlphabetic(8);
InputStream inputStream = new ByteArrayInputStream(originalString.getBytes());

StringBuilder textBuilder = new StringBuilder();
try (Reader reader = new BufferedReader(new InputStreamReader(inputStream, Charset.forName(StandardCharsets.UTF_8.name())))) {
    int c = 0;
    while ((c = reader.read()) != -1) {
        textBuilder.append((char) c);
    }
}

assertEquals(textBuilder.toString(), originalString);
```

##### 4. Converting with Java and a Scanner

```java
String originalString = randomAlphabetic(8);
InputStream inputStream = new ByteArrayInputStream(originalString.getBytes());

String text = null;
try (Scanner scanner = new Scanner(inputStream, StandardCharsets.UTF_8.name())) {
    text = scanner.useDelimiter("\\A").next();
}

assertThat(text, equalTo(originalString));
```

##### 5. Converting Using ByteArrayOutputStream

```java
String originalString = randomAlphabetic(8);
InputStream inputStream = new ByteArrayInputStream(originalString.getBytes());

ByteArrayOutputStream buffer = new ByteArrayOutputStream();
int nRead;
byte[] data = new byte[1024];
while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
    buffer.write(data, 0, nRead);
}

buffer.flush();
byte[] byteArray = buffer.toByteArray();

String text = new String(byteArray, StandardCharsets.UTF_8);
assertThat(text, equalTo(originalString));
```

#### Java InputStream to Byte Array

##### 1. Convert using Plain Java

```java
InputStream initialStream = new ByteArrayInputStream(new byte[]{0, 1, 2});

byte[] targetArray = new byte[initialStream.available()];
initialStream.read(targetArray);
```

In the case of a buffered stream

```java
InputStream is = new ByteArrayInputStream(new byte[]{0, 1, 2});

ByteArrayOutputStream buffer = new ByteArrayOutputStream();
int nRead;
byte[] data = new byte[1024];
while ((nRead = is.read(data, 0, data.length)) != -1) {
    buffer.write(data, 0, nRead);
}

buffer.flush();
byte[] byteArray = buffer.toByteArray();
```

##### 2. Convert using Guava

```java
InputStream initialStream = ByteSource
    .wrap(new byte[]{0, 1, 2})
    .openStream();

byte[] targetArray = ByteStreams.toByteArray(initialStream);
```

##### 3. Convert using Commons IO

```java
ByteArrayInputStream initialStream = new ByteArrayInputStream(new byte[]{1, 2, 3});

byte[] targetArray = IOUtils.toByteArray(initialStream);
```

#### Write an InputStream to a File

##### 1. Convert using plain Java

```java
InputStream initialStream = new FileInputStream(new File("src/test/resources/sample.txt"));
byte[] buffer = new byte[initialStream.available()];
initialStream.read(buffer);

File targetFile = new File("src/test/resources/targetFile.tmp");
OutputStream outputStream = new FileOutputStream(targetFile);
outputStream.write(buffer);
```

with buffer

```java
InputStream initialStream = new FileInputStream(new File("src/test/resources/sample.txt"));
File targetFile = new File("src/test/resources/targetFile.tmp");
OutputStream outputStream = new FileOutputStream(targetFile);

byte[] buffer = new byte[8 * 1024];
int bytesRead;
while ((bytesRead = initialStream.read(buffer)) != -1) {
    outputStream.write(buffer, 0, bytesRead);
}

IOUtils.closeQuietly(initialStream);
IOUtils.closeQuietly(outputStream);
```

use java8

```java
InputStream initialStream = new FileInputStream(new File("src/test/resources/sample.txt"));
File targetFile = new File("src/test/resources/targetFile.tmp");

Files.copy(
        initialStream,
        targetFile.toPath(),
        StandardCopyOption.REPLACE_EXISTING);

IOUtils.closeQuietly(initialStream);
```

##### 2. Convert using Guava

```java
InputStream initialStream = new FileInputStream(new File("src/test/resources/sample.txt"));
byte[] buffer = new byte[initialStream.available()];
initialStream.read(buffer);

File targetFile = new File("src/test/resources/targetFile.tmp");
com.google.common.io.Files.write(buffer, targetFile);
```

##### 3. Convert using Commons IO

```java
InputStream initialStream = new FileInputStream(new File("src/test/resources/sample.txt"));
File targetFie = new File("src/test/resources/targetFile.tmp");

FileUtils.copyInputStreamToFile(initialStream, targetFie);
```

#### InputStream to Reader

##### With Java

```java
InputStream initialStream = new ByteArrayInputStream("With Java".getBytes());

Reader targetReader = new InputStreamReader(initialStream);

targetReader.close();
```

##### With Guava

```java
InputStream initialStream = ByteSource
    .wrap("With Guava".getBytes())
    .openStream();

byte[] buffer = ByteStreams.toByteArray(initialStream);
Reader targetReader = CharSource
    .wrap(new String(buffer))
    .openStream();
targetReader.close();
```

##### With Commons IO

```java
InputStream initialStream = IOUtils.toInputStream("With Commons IO");

byte[] buffer = IOUtils.toByteArray(initialStream);
Reader targetReader = new CharSequenceReader(new String(buffer));

targetReader.close();
```

### To InputStream

#### Java String to InputStream


