# Core Java

## 整型
类型  |   存储需求    |   取值范围    |   十六进制
---|---|---|---
`byte`  |   1字节 |   `-2^7` ~ `2^7-1` |   
`short` |   2字节 |   `-2^15` ~ `2^15-1` |   
`int`   |   4字节 |   `-2^31` ~ `2^31-1`  |   `0x80000000` ~ `0x7fffffff`
`long`  |   8字节 |   `-2^63` ~ `2^63-1` |   `0x8000000000000000L` ~ `0x7fffffffffffffffL`
`float` |   4字节 |   |   
`double` |  8字节 |   |
`char` |    2字节 |   `2^16-1` |

## 随机数

```java
long pureRandomLong = new Random().nextLong();
System.out.println(pureRandomLong);

long leftLimit = 1L;
long rightLimit = 10L;
long rangeRandomLong = leftLimit + (long) (Math.random() * (rightLimit - leftLimit));
System.out.println(rangeRandomLong);

//  Apache Commons Math
long leftApacheLimit = 10L;
long rightApacheLimit = 100L;
long rangeApacheRandomLong = new RandomDataGenerator().nextLong(leftApacheLimit, rightApacheLimit);
System.out.println(rangeApacheRandomLong);

float floatLeftLimit = 1F;
float floatRightLimit = 10F;
float floatRandom = new RandomDataGenerator().getRandomGenerator().nextFloat();
float floatGenerate = floatLeftLimit + floatRandom * (floatRightLimit - floatLeftLimit);
System.out.println(floatGenerate);

double doubleLeftLimit = 1D;
double doubleRightLimit = 100D;
double doubleRandom = new RandomDataGenerator().nextUniform(doubleLeftLimit, doubleRightLimit);
System.out.println(doubleRandom);
```

## 产生随机字符串

```java
byte[] array = new byte[10];
new Random().nextBytes(array);
String randomUnboundedString = new String(array, Charset.forName("utf-8"));
System.out.println(randomUnboundedString);

int leftLimit = 97;
int rightLimit = 122;
int targetStringLength = 10;
Random random = new Random();
StringBuilder buffer = new StringBuilder(targetStringLength);
for (int i = 0; i < targetStringLength; i++) {
    int randomLimitedInt = leftLimit + (int) (random.nextFloat() * (rightLimit - leftLimit + 1));
    buffer.append((char) randomLimitedInt);
}
System.out.println(buffer.toString());

// Apache Commons Lang
int lengthRandomString = 10;
boolean userLetters = true;
boolean useNumber = false;
String generateRandomString = RandomStringUtils.random(lengthRandomString, userLetters, useNumber);
System.out.println(generateRandomString);

String generateRandomAlphabetic=RandomStringUtils.randomAlphabetic(lengthRandomString);
System.out.println(generateRandomAlphabetic);

String generateRandomAlphanumeric=RandomStringUtils.randomAlphanumeric(lengthRandomString);
System.out.println(generateRandomAlphanumeric);
```

#### round a number to n decimal

```java
double PI = 3.1415;

System.out.printf("%.3f %n", PI);

DecimalFormat df = new DecimalFormat("###.###");
System.out.println(df.format(PI));

BigDecimal bd = new BigDecimal(PI);
System.out.println(bd.setScale(3, RoundingMode.HALF_UP).doubleValue());

// apache math
System.out.println(Precision.round(PI, 3));

// decimal4j
System.out.println(DoubleRounder.round(PI,3));
```

#### Java 运算问题

```java
double a = 13.22;
double b = 4.88;
double c = 21.45;

// problem
double abc = a + b + c;
System.out.println(abc);

double acb = a + c + b;
System.out.println(acb);

// solution
BigDecimal d = new BigDecimal(String.valueOf(a));
BigDecimal e = new BigDecimal(String.valueOf(b));
BigDecimal f = new BigDecimal(String.valueOf(c));

BigDecimal def = d.add(e).add(f);
BigDecimal dfe = d.add(f).add(e);

System.out.println(def);
System.out.println(dfe);
```

#### Comparing `getPath()`, `getAbsolutePath()`, and `getCanonicalPath()` in Java

```java
File file=new File("test.txt");
        
System.out.println(file.getPath());
System.out.println(file.getAbsolutePath());

// 规范路径名是绝对路径名，并且是惟一的。规范路径名的准确定义与系统有关。
System.out.println(file.getCanonicalPath());
```

#### Add a Single Element to a Stream

```java
Stream<Integer> anStream = Stream.of(1, 2, 3, 4, 5);
Stream<Integer> newStream = Stream.concat(Stream.of(99), anStream);
Assert.assertEquals(newStream.findFirst().get(), (Integer) 99);

//  to append an element to the end of a Stream
Stream<String> anoStream = Stream.of("a", "b", "c", "d", "e");
Stream<String> newAnoStream = Stream.concat(anoStream, Stream.of("A"));
List<String> resultList = newAnoStream.collect(Collectors.toList());
Assert.assertEquals(resultList.get(resultList.size() - 1), "A");

// at a specific index
Stream<Double> anooStream = Stream.of(1.1, 2.2, 3.3);
Stream<Double> newAnooStream = insertInStream(anooStream, 9.9, 3);
List<Double> resultAnoList = newAnooStream.collect(Collectors.toList());
Assert.assertEquals(resultAnoList.get(3), (Double) 9.9);

public <T> Stream<T> insertInStream(Stream<T> stream, T elem, int index) {
    List<T> result = stream.collect(Collectors.toList());
    result.add(index, elem);
    return result.stream();
}
```

#### `ClassNotFoundException` vs `NoClassDefFoundError`

* `ClassNotFoundException`  

ClassNotFoundException is a checked exception which occurs when an application tries to load a class through its fully-qualified name and can not find its definition on the classpath. 

This occurs mainly when trying to load classes using `Class.forName()`, `ClassLoader.loadClass()` or `ClassLoader.findSystemClass()`. Therefore, we need to be extra careful of `java.lang.ClassNotFoundException` while working with reflection.  

```java
@Test(expected = ClassNotFoundException.class)
public void classNotFoundException() throws ClassNotFoundException {
    Class.forName("oracle.jdbc.driver.OracleDriver");
}
```

* `NoClassDefFoundError`  

NoClassDefFoundError is a fatal error. It occurs when JVM can not find the definition of the class while trying to:  

    * Instantiate a class by using the `new` keyword
    * Load a class with a method call    

The error occurs when a compiler could successfully compile the class, but Java runtime could not locate the class file. It usually happens when there is an exception while executing a static block or initializing static fields of the class, so class initialization fails.

```java
public class ClassWithInitErrors {
    static int data = 1 / 0;
}

public class NoClassDefFoundErrorExample {
    public ClassWithInitErrors getClassWithInitErrors() {
        ClassWithInitErrors test;
        try {
            test = new ClassWithInitErrors();
        } catch (Throwable t) {
            System.out.println(t);
        }
        test = new ClassWithInitErrors();
        return test;
    }
}

@Test(expected = NoClassDefFoundError.class)
public void givenInitErrorInClass_whenloadClass_thenNoClassDefFoundError() {
  
    NoClassDefFoundErrorExample sample
     = new NoClassDefFoundErrorExample();
    sample.getClassWithInitErrors();
}
```

#### Iterating over Enum Values

```java
public enum DaysOfWeekEnum {
    SUNDAY("off"),
    MONDAY("working"),
    TUESDAY("working"),
    WEDNESDAY("working"),
    THURSDAY("working"),
    FRIDAY("working"),
    SATURDAY("off");

    private String typeOfDay;

    DaysOfWeekEnum(String day) {
        this.typeOfDay = day;
    }
}


@Test
public void testIterateEnum() {

    // Iterate Using forEach()
    EnumSet.allOf(DaysOfWeekEnum.class).forEach(System.out::println);
    Arrays.asList(DaysOfWeekEnum.class).forEach(System.out::println);

    // Iterate Using for loop
    for (DaysOfWeekEnum day : DaysOfWeekEnum.values()) {
        System.out.println(day);
    }

    // Iterate Using Stream
    // Arrays.stream(DaysOfWeekEnum.values());
    Stream.of(DaysOfWeekEnum.values())
            .filter(d->d.getTypeOfDay().equals("off"))
            .forEach(System.out::println);
}
```

#### Remove the Last Character of a String

```java
// before java 8
public static String removeLastChar(String s) {
    return (s == null || s.length() == 0) ?
            null
            : (s.substring(0, s.length() - 1));
}

// after java 8
public static String removeLastCharOptional(String s) {

    return Optional.ofNullable(s)
            .filter(str -> str.length() != 0)
            .map(str -> str.substring(0, str.length() - 1))
            .orElse(s);
}

// apache common lang
StringUtils.substring(TEST_STRING, 0, TEST_STRING.length() - 1);
StringUtils.chop(TEST_STRING);

// Using Regular Expression
TEST_STRING.replaceAll(".$", "");
```

#### Split a String

```java
// Guava 
List<String> resultList= Splitter
.on(',')
.trimResults()
.omitEmptyStrings()
.splitToList("car,jeep   ,scatter,,leave");
```

#### Double Brace Initialization

##### Using Double Brace

```java
@Test
public void whenInitializeSetWithDoubleBraces_containsElements() {
    Set<String> countries = new HashSet<String>() {
        {
           add("India");
           add("USSR");
           add("USA");
        }
    };
  
    assertTrue(countries.contains("India"));
}
```

* Advantages of Using Double Braces
    * Fewer lines of code compared to the native way of creation and initialisation
    * The code is more readable
    * Creation initialization is done in the same expression
* Disadvantages of Using Double Braces
    * Obscure, not widely known way to do the initialization
    * It creates an extra class every time we use it
    * Doesn’t support the use of the “diamond operator” – a feature introduced in Java 7
    * Doesn’t work if the class we are trying to extend is marked final
    * Holds a hidden reference to the enclosing instance, which may cause memory leaks

##### Stream Factory Methods

```java
@Test
public void whenInitializeUnmodifiableSetWithDoubleBrace_containsElements() {
    Set<String> countries = Stream.of("India", "USSR", "USA")
      .collect(collectingAndThen(toSet(), Collections::unmodifiableSet));
  
    assertTrue(countries.contains("India"));
}
```

##### Java 9 Collections Factory Methods

```java
List<String> list = List.of("India", "USSR", "USA");
Set<String> set = Set.of("India", "USSR", "USA");
```

#### Count Occurrences of a Char in a String

##### Using Core Java Lib

1. Imperative Approach

```java
@Test
public void countCharInString() {
    String testString = "elephant";
    char matchChar = 'e';
    int count = 0;

    for (int i = 0; i < testString.length(); i++) {
        if (testString.charAt(i) == matchChar) {
            count++;
        }
    }

    assertEquals(2, count);
}
```

2. Using Recursion

```java
public static int countOccurences(String someString, char matchChar, int index) {
    if (index >= someString.length()) {
        return 0;
    }

    int count = someString.charAt(index) == matchChar ? 1 : 0;
    return count + countOccurences(someString, matchChar, index + 1);
}
```

3. Using Regular Expressions

```java
Pattern pattern = Pattern.compile("[^e]*e");
Matcher matcher = pattern.matcher("elephant");
int count = 0;
while (matcher.find()) {
    count++;
}

assertEquals(2, count);
```

4. Using Java 8 Features

```java
String someString = "elephant";

long count_1 = someString.chars().filter(ch -> ch == 'e').count();
assertEquals(2, count_1);

long count_2 = someString.codePoints().filter(ch -> ch == 'e').count();
assertEquals(2, count_2);
```

##### Using External Libraries

```java
// Apache Common Lang
int count = StringUtils.countMatches("elephant", "e");

// Guava
int count = CharMatcher.is('e').countIn("elephant");

// Spring 
int count = StringUtils.countOccurrencesOf("elephant", "e");
```

#### Introduction to JDBC

##### Connecting to a Database

1. Registering the Driver

```java
 Class.forName("com.mysql.cj.jdbc.Driver");
```

2. Creating the Connection

```java
Connection con = DriverManager.getConnection("jdbc:mysql://218.94.66.98:53307/meng_test", "root", "qnsoft");
```

##### Executing SQL Statements

1. Statement

```java
Statement stmt = con.createStatement();
String selectSQL = "SELECT * FROM country";
ResultSet resultSet = stmt.executeQuery(selectSQL);
```

* `executeQuery()` for `SELECT` instructions
* `executeUpdate()` for updating the data or the database structure
* `execute()` can be used for both cases above when the result is unknown

> If the `execute()` method is used to update the data, then the `stmt.getUpdateCount()` method returns the number of rows affected.  
> If the result is `0` then either no rows were affected, or it was a database structure update command.  
> If the value is `-1`, then command was a `SELECT` query. The result can then be obtained using `stmt.getResultSet()`.

2. PreparedStatement  

PreparedStatement objects contain precompiled SQL sequences. They can have one or more parameters denoted by a question mark.  

```java
String updatePositionSql = "UPDATE employees SET position=? WHERE emp_id=?";
PreparedStatement pstmt = con.prepareStatement(updatePositionSql);

pstmt.setString(1, "lead developer");
pstmt.setInt(2, 1);

int rowsAffected = pstmt.executeUpdate();
```

3. CallableStatement  

```java
String preparedSql = "{call insertEmployee(?,?,?,?)}";
CallableStatement cstmt = con.prepareCall(preparedSql);

cstmt.setString(2, "ana");
cstmt.setString(3, "tester");
cstmt.setDouble(4, 2000);

// If the stored procedure has output parameters, we need to add them using the registerOutParameter() method
cstmt.registerOutParameter(1, Types.INTEGER);

cstmt.execute();
int new_id = cstmt.getInt(1);
```

##### Parsing Query Results

1. ResultSet Interface

```java
public class Employee {
    private int id;
    private String name;
    private String position;
    private double salary;
  
    // standard constructor, getters, setters
}
```

```java
String selectSql = "SELECT * FROM employees";
ResultSet resultSet = stmt.executeQuery(selectSql);
         
List<Employee> employees = new ArrayList<>();
         
while (resultSet.next()) {
    Employee emp = new Employee();
    emp.setId(resultSet.getInt("emp_id"));
    emp.setName(resultSet.getString("name"));
    emp.setPosition(resultSet.getString("position"));
    emp.setSalary(resultSet.getDouble("salary"));
    employees.add(emp);
}
```

2. Updatable ResultSet

If we want to use the ResultSet to update data and traverse it in both directions, we need to create the Statement object with additional parameters

```java
stmt = con.createStatement(
  ResultSet.TYPE_SCROLL_INSENSITIVE, 
  ResultSet.CONCUR_UPDATABLE
);
```

* `first()`, `last()`, `beforeFirst()`, `beforeLast()` – to move to the first or last line of a ResultSet or to the line before these
* `next()`, `previous()` – to navigate forward and backward in the ResultSet
* `getRow()` – to obtain the current row number
* `moveToInsertRow()`, `moveToCurrentRow()` – to move to a new empty row to insert and back to the current one if on a new row
* `absolute(int row)` – to move to the specified row
* `relative(int nrRows)` – to move the cursor the given number of rows  

To persist the ResultSet changes to the database, we must further use one of the methods

* `updateRow()` – to persist the changes to the current row to the database
* `insertRow()`, deleteRow() – to add a new row or delete the current one from the database
* `refreshRow()` – to refresh the ResultSet with any changes in the database
* `cancelRowUpdates()` – to cancel changes made to the current row

```java
Statement updatableStmt = con.createStatement(
  ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
ResultSet updatableResultSet = updatableStmt.executeQuery(selectSql);
 
updatableResultSet.moveToInsertRow();
updatableResultSet.updateString("name", "mark");
updatableResultSet.updateString("position", "analyst");
updatableResultSet.updateDouble("salary", 2000);
updatableResultSet.insertRow();
```

##### Parsing Metadata

1. DatabaseMetadata

```java
DatabaseMetaData dbmd = con.getMetaData();
ResultSet tablesResultSet = dbmd.getTables(null, null, "%", null);
while (tablesResultSet.next()) {
    LOG.info(tablesResultSet.getString("TABLE_NAME"));
}
```

2. ResultSetMetadata

```java
ResultSetMetaData rsmd = rs.getMetaData();
int nrColumns = rsmd.getColumnCount();
 
IntStream.range(1, nrColumns).forEach(i -> {
    try {
        LOG.info(rsmd.getColumnName(i));
    } catch (SQLException e) {
        e.printStackTrace();
    }
});
```

##### Handling Transactions

This may be necessary in cases when we want to preserve data consistency, for example when we only want to commit a transaction if a previous one has completed successfully.  

First, we need to set the autoCommit property of Connection to false, then use the commit() and rollback() methods to control the transaction.  

Let’s add a second update statement for the salary column after the employee position column update and wrap them both in a transaction. This way, the salary will be updated only if the position was successfully updated:  

```java
String updatePositionSql = "UPDATE employees SET position=? WHERE emp_id=?";
PreparedStatement pstmt = con.prepareStatement(updatePositionSql);
pstmt.setString(1, "lead developer");
pstmt.setInt(2, 1);
 
String updateSalarySql = "UPDATE employees SET salary=? WHERE emp_id=?";
PreparedStatement pstmt2 = con.prepareStatement(updateSalarySql);
pstmt.setDouble(1, 3000);
pstmt.setInt(2, 1);
 
boolean autoCommit = con.getAutoCommit();
try {
    con.setAutoCommit(false);
    pstmt.executeUpdate();
    pstmt2.executeUpdate();
    con.commit();
} catch (SQLException exc) {
    con.rollback();
} finally {
    con.setAutoCommit(autoCommit);
}
```

##### Closing the Connection

```java
con.close();
```

#### Difference Between Wait and Sleep in Java

##### General Differences Between Wait and Sleep

Simply put, **`wait()` is an instance method that’s used for thread synchronization**.

It can be called on any object, as it’s defined right on java.lang.Object, but it can **only be called from a synchronized block**. It releases the lock on the object so that another thread can jump in and acquire a lock.

On the other hand, `Thread.sleep()` is a static method that can be called from any context. **`Thread.sleep()` pauses the current thread and does not release any locks**.

##### Waking up Wait and Sleep

When we use the `sleep()` method, a thread gets started after a specified time interval, unless it is interrupted.  

For `wait()`, the waking up process is a bit more complicated. We can wake the thread by calling either the `notify()` or `notifyAll()` methods on the monitor that is being waited on.  

Use `notifyAll()` instead of `notify()` when you want to wake all threads that are in the waiting state. Similarly to the `wait()` method itself, `notify()`, and `notifyAll()` have to be called from the synchronized context.  

#### Converting a Stack Trace to a String in Java

```java
// core java
StringWriter sw = new StringWriter();
PrintWriter pw = new PrintWriter(sw);
e.printStackTrace(pw);

// Apache Common lang
String stacktrace = ExceptionUtils.getStacktrace(e);
```

#### Period and Duration

##### Period

```java
// 第一种方式
LocalDate startDate = LocalDate.of(2015, 2, 20);
LocalDate endDate = LocalDate.of(2017, 1, 15); 
Period period = Period.between(startDate, endDate);

// If isNegative() returns false, then the startDate is earlier than the endDate value
period.isNegative()

// 第二种方式
Period fromUnits = Period.of(3, 10, 10);
Period fromDays = Period.ofDays(50);
Period fromMonths = Period.ofMonths(5);
Period fromYears = Period.ofYears(10);
Period fromWeeks = Period.ofWeeks(40);

// 第三种，使用表示式: 'PnYnMnD'
Period fromCharYears = Period.parse("P2Y");
assertEquals(2, fromCharYears.getYears());
 
Period fromCharUnits = Period.parse("P2Y3M5D");
assertEquals(5, fromCharUnits.getDays());
```

##### Duration 

```java
// 第一种方式
Instant start = Instant.parse("2017-10-03T10:15:30.00Z");
Instant end = Instant.parse("2017-10-03T10:16:30.00Z");
Duration duration = Duration.between(start, end);

// 第二种方式
LocalTime start = LocalTime.of(1, 20, 25, 1024);
LocalTime end = LocalTime.of(3, 22, 27, 1544);
Duration.between(start, end).getSeconds();

// 第三种方式
Duration fromDays = Duration.ofDays(1);
Duration fromMinutes = Duration.ofMinutes(60);

// 第四次，使用表达式: 'PnDTnHnMn.nS'
Duration fromChar1 = Duration.parse("P1DT1H10M10.5S");
Duration fromChar2 = Duration.parse("PT10M");
```

#### StringTokenizer

```java
public List<String> getTokens(String str) {
    List<String> tokens = new ArrayList<>();
    StringTokenizer tokenizer = new StringTokenizer(str, ",");
    while (tokenizer.hasMoreElements()) {
        tokens.add(tokenizer.nextToken());
    }
    return tokens;
}
```