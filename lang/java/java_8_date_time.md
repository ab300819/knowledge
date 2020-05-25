### #时间戳和 `LocalDateTime` 互转

#### ##时间戳转 `LocalDateTime`

```java
Instant milliSecond = Instant.ofEpochMilli(1516690512000L);
Instant second = Instant.ofEpochSecond(1516344912L);

LocalDateTime fromMilliSecond = milliSecond
        .atZone(ZoneId.systemDefault())
        .toLocalDateTime();

LocalDateTime fromSecond = second
        .atZone(ZoneId.systemDefault())
        .toLocalDateTime();

System.out.println(fromMilliSecond);
System.out.println(second);
```

#### ## `LocalDateTime` 转时间戳

```java
LocalDateTime dateTime = LocalDateTime.of(2018, 1, 23, 13, 45, 23);
long milliSecond = dateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
long second = dateTime.atZone(ZoneId.systemDefault()).toEpochSecond();
System.out.println(milliSecond);
System.out.println(second);
```