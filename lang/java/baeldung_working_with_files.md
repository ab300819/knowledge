#### [How to Read a Large File Efficiently with Java](http://www.baeldung.com/java-read-lines-large-file)

##### Streaming Through the File

```java
FileInputStream inputStream = null;
Scanner sc = null;
try {
    inputStream = new FileInputStream(path);
    sc = new Scanner(inputStream, "UTF-8");
    while (sc.hasNextLine()) {
        String line = sc.nextLine();
        // System.out.println(line);
    }
    // note that Scanner suppresses exceptions
    if (sc.ioException() != null) {
        throw sc.ioException();
    }
} finally {
    if (inputStream != null) {
        inputStream.close();
    }
    if (sc != null) {
        sc.close();
    }
}
```

##### Streaming with Apache Commons IO

```java
LineIterator it = FileUtils.lineIterator(theFile, "UTF-8");
try {
    while (it.hasNext()) {
        String line = it.nextLine();
        // do something with line
    }
} finally {
    LineIterator.closeQuietly(it);
}
```

#### Rename or Move a File

```java
// With JDK 6
File fileToMove=new File("src/main/resources/test.properties");
boolean isMove=fileToMove.renameTo(new File("src/main/resources/rename.properties"));
if (!isMove){
    throw new FileSystemException("src/main/resources/rename.properties");
}

// With JDK 7
Path fileToMovePath= Files.createFile(Paths.get(""+randomAlphabetic(5)+".properties"));
Path targetPath=Paths.get("src/main/resources/");
Files.move(fileToMovePath,targetPath.resolve(fileToMovePath.getFileName()));

// With Guava
File fileToMove=new File("src/main/resources/rename.properties");
File destDir=new File("src/main/resources/");
File targetFile=new File(destDir,fileToMove.getName());
com.google.common.io.Files.move(fileToMove,targetFile);

// With Commons IO
FileUtils.moveFile(
    FileUtils.getFile("src/main/resources/rename.properties"),
    FileUtils.getFile("src/test/resources/rename.properties"));
// automatically create the destination directory if it doesn’t already exist
FileUtils.moveFileToDirectory(
    FileUtils.getFile("src/main/resources/rename.properties"),
    FileUtils.getFile("src/main/resources/"), true);
```

#### Create a File

```java
// With JDK 6
File newFile=new File("src/test/resources/test.txt");
boolean success=newFile.createNewFile();

// With JDK 7
Path newFilePath = Paths.get("src/test/resources/test.txt");
Files.createFile(newFilePath);

// With Guava
com.google.common.io.Files.touch(new File("src/test/resources/test.txt"));

// With Commons IO
FileUtils.touch(new File("src/test/resources/test.txt"));
```

#### Delete a File

```java
// With JDK 6
new File("src/test/resources/test.txt").createNewFile();
File fileToDelete = new File("src/test/resources/test.txt");
boolean success = fileToDelete.delete();

// With JDK 7
// If the file doesn’t exist when the delete operation is triggered – an  NoSuchFileException will be thrown 
Files.createFile(Paths.get("src/test/resources/test.txt"));
Path fileToDeletePath = Paths.get("src/test/resources/test.txt");
Files.delete(fileToDeletePath);

// With Commons IO
FileUtils.touch(new File("src/test/resources/test.txt"));
File fileToDelete = FileUtils.getFile("src/test/resources/test.txt");
boolean success = FileUtils.deleteQuietly(fileToDelete);
// If the file to be deleted doesn’t exist on the filesystem, the API will throw a standard FileNotFoundException
FileUtils.forceDelete(FileUtils.getFile("src/test/resources/fileToDelete.txt"));
```

#### Write to File

##### Write with BufferedWriter

```java
String str = "Hello";
BufferedWriter writer = new BufferedWriter(new FileWriter(fileName));
writer.write(str);
writer.close();

// append a String to the existing file
String str = "World";
BufferedWriter writer = new BufferedWriter(new FileWriter(fileName, true));
writer.append(' ');
writer.append(str);
writer.close();
```

##### Write with PrintWriter

```java
FileWriter fileWriter = new FileWriter(fileName);
PrintWriter printWriter = new PrintWriter(fileWriter);
printWriter.print("Some String");
printWriter.printf("Product name is %s and its price is %d $", "iPhone", 1000);
printWriter.close();
```

##### Write with FileOutputStream

```java
//  use FileOutputStream to write binary data to a file
String str = "Hello";
FileOutputStream outputStream = new FileOutputStream(fileName);
byte[] strToBytes = str.getBytes();
outputStream.write(strToBytes);
outputStream.close();
```

##### Write with DataOutputStream

```java
String value = "Hello";
FileOutputStream fos = new FileOutputStream(fileName);
DataOutputStream outStream = new DataOutputStream(new BufferedOutputStream(fos));
outStream.writeUTF(value);
outStream.close();

// verify the results
String result;
FileInputStream fis = new FileInputStream(fileName);
DataInputStream reader = new DataInputStream(fis);
result = reader.readUTF();
reader.close();

assertEquals(value, result);
```

##### Write with RandomAccessFile

```java
RandomAccessFile writer = new RandomAccessFile(filename, "rw");
writer.seek(position);
writer.writeInt(data);
writer.close();
```

```java
int result = 0;
RandomAccessFile reader = new RandomAccessFile(filename, "r");
reader.seek(position);
result = reader.readInt();
reader.close();
return result;
```

##### Write with FileChannel

```java
RandomAccessFile stream = new RandomAccessFile(fileName, "rw");
FileChannel channel = stream.getChannel();
String value = "Hello";
byte[] strBytes = value.getBytes();
ByteBuffer buffer = ByteBuffer.allocate(strBytes.length);
buffer.put(strBytes);
buffer.flip();
channel.write(buffer);
stream.close();
channel.close();

// verify
RandomAccessFile reader = new RandomAccessFile(fileName, "r");
assertEquals(value, reader.readLine());
reader.close();
```

##### Write to file using Java 7

```java
String str = "Hello";
 
Path path = Paths.get(fileName);
byte[] strToBytes = str.getBytes();

Files.write(path, strToBytes);

String read = Files.readAllLines(path).get(0);
assertEquals(str, read);
```

##### Write to temporary file

```java
String toWrite = "Hello";
File tmpFile = File.createTempFile("test", ".tmp");
FileWriter writer = new FileWriter(tmpFile);
writer.write(toWrite);
writer.close();

BufferedReader reader = new BufferedReader(new FileReader(tmpFile));
assertEquals(toWrite, reader.readLine());
reader.close();
```

##### Lock File Before Writing

```java
RandomAccessFile stream = new RandomAccessFile(fileName, "rw");
FileChannel channel = stream.getChannel();

FileLock lock = null;
try {
    lock = channel.tryLock();
} catch (final OverlappingFileLockException e) {
    stream.close();
    channel.close();
}
stream.writeChars("test lock");
lock.release();

stream.close();
channel.close();
```

#### Read from File

##### 1. Read with BufferedReader

```java
String expectedValue = "Hello world";
String file = "src/test/resources/test.txt";

BufferedReader reader = new BufferedReader(new FileReader(file));
String currentLine = reader.readLine();
reader.close();

assertEquals(expectedValue, currentLine);
```

##### 2. Read with Scanner

```java
String file = "src/test/resources/test.txt";
Scanner scanner = new Scanner(new File(file));
scanner.useDelimiter(" ");

assertTrue(scanner.hasNext());
assertEquals("Hello", scanner.next());
assertEquals("world", scanner.next());
assertEquals(1, scanner.nextInt());

scanner.close();
```

> Note that the default delimiter is the whitespace, but multiple delimiters can be used with a Scanner.

##### 3. Read with StreamTokenizer

The way the tokenizer works is – first, we need to figure out what the next token is – String or number; we do that by looking at the tokenizer.ttype field.  
Then, we’ll read the actual token based on this type:  
* `tokenizer.nval` – if the type was a number
* `tokenizer.sval` – if the type was a String

```java
String file = "src/test/resources/test9.txt";
FileReader reader = new FileReader(file);
StreamTokenizer tokenizer = new StreamTokenizer(reader);

tokenizer.nextToken();
assertEquals(StreamTokenizer.TT_WORD, tokenizer.ttype);
assertEquals("Hello", tokenizer.sval);

tokenizer.nextToken();
assertEquals(StreamTokenizer.TT_NUMBER, tokenizer.ttype);
assertEquals(1, tokenizer.nval, 0.0000001);

tokenizer.nextToken();
assertEquals(StreamTokenizer.TT_EOF, tokenizer.ttype);
reader.close();
```

> Note how the end of file token is used at the end.

##### 4. Read with DataInputStream

```java
String value = "Hello";
String file = "src/test/resources/test8.txt";
DataInputStream reader = new DataInputStream(new FileInputStream(file));
String result = reader.readUTF();
reader.close();

assertEquals(value, result);
```

##### 5. Read with SequenceInputStream

```java
int expectedValue1 = 2000;
int expectedValue2 = 5000;
String file1 = "src/test/resources/test_read1.txt";
String file2 = "src/test/resources/test_read3.txt.txt";

FileInputStream stream1 = new FileInputStream(file1);
FileInputStream stream2 = new FileInputStream(file2);

SequenceInputStream sequence = new SequenceInputStream(stream1, stream2);
DataInputStream reader = new DataInputStream(sequence);

assertEquals(expectedValue1, reader.readInt());
assertEquals(expectedValue2, reader.readInt());

reader.close();
stream2.close();
```

##### 6. Read with FileChannel

```java
String expected_value = "Hello world";
String file = "src/test/resources/test.txt";
RandomAccessFile reader = new RandomAccessFile(file, "r");
FileChannel channel = reader.getChannel();

int bufferSize = 1024;
if (bufferSize > channel.size()) {
    bufferSize = (int) channel.size();
}

ByteBuffer buffer = ByteBuffer.allocate(bufferSize);
channel.read(buffer);
buffer.flip();

assertEquals(expected_value, new String(buffer.array()));
channel.close();
reader.close();
```

##### 7. Read UTF-8 encoded file

```java
String expected_value = "清空";
String file = "src/test/resources/test_read.txt";
BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"));
String currentLine = reader.readLine();
reader.close();

assertEquals(expected_value, currentLine);
```

##### 8. Read a file into a String

```java
String expected_value = "Hello world\n\nTest line\n";
String file = "src/test/resources/test_read3.txt";
BufferedReader reader = new BufferedReader(new FileReader(file));
StringBuilder builder = new StringBuilder();
String currentLine = reader.readLine();
while (currentLine != null) {
    builder.append(currentLine);
    builder.append("\n");
    currentLine = reader.readLine();
}

reader.close();
assertEquals(expected_value, builder.toString());
```

##### 9. Read from File using Java 7

###### 9.1 Read a Small File with Java 7

```java
String expected_value = "Hello world";

Path path = Paths.get("src/test/resources/test_read5.txt");

String read = Files.readAllLines(path).get(0);
assertEquals(expected_value, read);
```

> Note that you can use the readAllBytes() method as well if you need binary data.

###### 9.2 Read a Large File with Java 7

```java
String expected_value = "Hello world";

Path path = Paths.get("src/test/resources/test_read6.txt");

BufferedReader reader = Files.newBufferedReader(path);
String line = reader.readLine();

assertEquals(expected_value, line);
```

#### Directory Size

##### 1. With Java

```java
public long getFolderSize(File folder) {
    long length = 0;
    File[] files = folder.listFiles();

    int count = files.length;
    for (int i = 0; i < count; i++) {
        if (files[i].isFile()) {

            length += files[i].length();
        } else {
            length += getFolderSize(files[i]);
        }
    }
    return length;
}

@Test
public void getFolderSizeWithJava() {
    long expectedSize = 170;

    File folder = new File("src/test/resources");
    long size = getFolderSize(folder);

    assertEquals(expectedSize, size);
}
```

> `listFiles()` is used to list the contents of the given folder

##### 2. With Java 7

```java
long expectedSize = 170;

AtomicLong size = new AtomicLong(0);
Path folder = Paths.get("src/test/resources");

Files.walkFileTree(folder, new SimpleFileVisitor<Path>() {
    @Override
    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {

        size.addAndGet(attrs.size());

        return FileVisitResult.CONTINUE;
    }
});

assertEquals(expectedSize, size.longValue());
```

> Note how we’re leveraging the filesystem tree traversal capabilities here and making use of the visitor pattern to help us visit and calculate the sizes of each file and subfolder.

##### 3. With Java 8

```java
long expectedSize = 170;

Path folder = Paths.get("src/test/resources");
long size = Files.walk(folder)
        .filter(p -> p.toFile().isFile())
        .mapToLong(p -> p.toFile().length())
        .sum();

assertEquals(expectedSize, size);
```

> `mapToLong()` is used to generate a LongStream by applying the length function in each element – after which we can sum and get a final result.

##### 4. With Apache Commons IO

```java
long expectedSize = 170;

File folder = new File("src/test/resources");
long size = FileUtils.sizeOfDirectory(folder);

assertEquals(expectedSize, size);
```

>  the library also provides a FileUtils.sizeOfDirectoryAsBigInteger() method that deals with security restricted directories better.

##### 5. With Guava

```java
long expectedSize = 170;
File folder = new File("src/test/resources");

Iterable<File> files = com.google.common.io.Files.fileTraverser()
        .breadthFirst(folder);

long size = StreamSupport.stream(files.spliterator(), false)
        .filter(f -> f.isFile())
        .mapToLong(File::length)
        .sum();

assertEquals(expectedSize, size);
```

##### 6. Human Readable Size

```java
File folder = new File("src/test/resources");
long size = getFolderSize(folder);

String[] units = new String[]{"B", "KB", "MB", "GB", "TB"};
int unitIndex = (int) (Math.log10(size) / 3);
double unitValue = 1 << (unitIndex * 10);

String readableSize = new DecimalFormat("#,##0.#")
        .format(size / unitValue) + " " + units[unitIndex];

assertEquals("170 B", readableSize);
```