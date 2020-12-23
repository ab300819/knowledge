# Java 一些技巧

## 使用JDBC连接数据库

```java
String driver = "com.mysql.cj.jdbc.Driver";
String url = "jdbc:mysql://localhost:3306/meng_test";
String username = "root";
String password = "toor";

Class.forName(driver);

Connection connection = null;
Statement statement = null;
ResultSet resultSet = null;

try {
    connection = DriverManager.getConnection(url, username, password);
    statement = connection.createStatement();

    if (statement.execute("INSERT INTO country (countryname,countrycode) VALUES ('日本','JP')")) {
        System.out.println("执行成功！");
    }

    resultSet = statement.executeQuery("SELECT id,countryname,countrycode FROM country");
    while (resultSet.next()) {
        System.out.println(resultSet.getInt(1) + "    " + resultSet.getString(2) + "  " + resultSet.getString(3));
    }

} catch (SQLException e) {
    e.printStackTrace();
} finally {
    try {

        if (resultSet != null)
            resultSet.close();

        if (statement != null)
            statement.close();

        if (connection != null)
            connection.close();

    } catch (SQLException e) {
        e.printStackTrace();
    }
}
```

## JDK 动态代理

### 写法一

```java
InvocationHandler invocationHandler = (proxy, method, args) -> {

    System.out.println(proxy.getClass().getName());
    System.out.println(method.getName());
    System.out.println(args.length);

    return null;
};

Class proxyClass = Proxy.getProxyClass(
        Subject.class.getClassLoader(),
        Subject.class);

Subject subject = (Subject) proxyClass
        .getConstructor(new Class[]{InvocationHandler.class})
        .newInstance(invocationHandler);

subject.reversalInput("Hello");
```

### 写法二

```java
InvocationHandler invocationHandler = (proxy, method, args) -> {

    System.out.println(proxy.getClass().getName());
    System.out.println(method.getName());
    System.out.println(args.length);

    return null;
};

Subject subject = (Subject) Proxy.newProxyInstance(
        Subject.class.getClassLoader(),
        new Class[]{Subject.class},
        invocationHandler);

subject.reversalInput("hello");
```

## 位运算

### 移位操作

```java
// 左移相当于乘上 2^n
target << n
// 无符号左移
target <<< n

// 右移相当于除以 2^n
target >> n
// 无符号右移
target >>> n
```

### 判断 2 的 n 次幂

```java
public int isPower(int n) {

    if (n < 1) return -1;

    for (int i = 1, j = 0; i <= n; i <<= 1, j++) {
        if (i == n) return j;
    }

    return -1;
}
```

### 返回二进制中 1 的个数

```java
public int checkHighBit1(int target) {

    int count = 0;

    for (; target > 0; target >>= 1) {
        if ((target & 1) == 1) count++;
    }
    return count;
}

public int checkHighBit2(int target) {

    int count = 0;

    for (; target != 0; count++) {
        target &= (target - 1);
    }
    return count;
}
```

## 字符串

### 字符串反转

`how are you` 反转为 `you are how`

**Method A**

```java

```

**Method B**

```java

```

## 不用比较返回最大值或最小值

```java
public int maxWithout(int a, int b) {
    return (int) (((long) a + (long) +b + Math.abs((long) a - (long) b)) / 2);
}

public int minWithout(int a, int b) {
    return (int) (((long) a + (long) +b - Math.abs((long) a - (long) b)) / 2);
}
```

## Tomcat 控制台乱码

编辑 `conf\logging.properties` 文件，添加

```txt
java.util.logging.ConsoleHandler.encoding=utf-8
```
