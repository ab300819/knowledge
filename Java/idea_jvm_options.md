# IDEA JVM 启动参数

```txt
-Xms128m
-Xmx1024m
-XX:ReservedCodeCacheSize=240m
-XX:+UseCompressedOops
-Dfile.encoding=UTF-8
-XX:+UseG1GC
-XX:SoftRefLRUPolicyMSPerMB=50
-ea
-Dsun.io.useCanonCaches=false
-Djava.net.preferIPv4Stack=true
-Djdk.http.auth.tunneling.disabledSchemes=""
-XX:+HeapDumpOnOutOfMemoryError
-XX:-OmitStackTraceInFastThrow
-Xverify:none

-Dsun.java2d.opengl=true

-XX:ErrorFile=$USER_HOME/java_error_in_idea_%p.log
-XX:HeapDumpPath=$USER_HOME/java_error_in_idea.hprof
```
