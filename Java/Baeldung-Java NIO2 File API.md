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
