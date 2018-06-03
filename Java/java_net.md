# Java 网络

## Internet 地址









```java
static String numericToTextFormat(byte[] src){
    return (src[0] & 0xff) + "." + (src[1] & 0xff) + "." + (src[2] & 0xff) + "." + (src[3] & 0xff);
}
```