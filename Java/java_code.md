# Java 代码

**#JDBC**

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

**#动态代理**
##写法一

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

##写法二

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