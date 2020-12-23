# 日志接入 ELK

## logstash 配置

## elasticsearch 配置

## kibana 配置

## Spring MVC 配置

### log4j 1.x

#### 依赖

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.30</version>
</dependency>
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>1.7.30</version>
</dependency>
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>
```

### 配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE log4j:configuration PUBLIC "-//log4j/log4j Configuration//EN" "log4j.dtd">
<log4j:configuration>
    <appender name="console" class="org.apache.log4j.ConsoleAppender">
        <layout class="org.apache.log4j.PatternLayout">
            <param name="ConversionPattern" value="%-7p %d [%t] %c %x - %m%n"/>
        </layout>
    </appender>
    <appender name="logstash" class="org.apache.log4j.net.SocketAppender">
        <param name="RemoteHost" value="127.0.0.1"/>
        <param name="Port" value="8082"/>
        <param name="ReconnectionDelay" value="10000"/>
        <param name="LocationInfo" value="true"/>
        <param name="Threshold" value="INFO"/>
        <param name="Application" value="web-api" />
    </appender>
    <root>
        <priority value="INFO"/>
        <appender-ref ref="console" />
        <appender-ref ref="logstash"/>
    </root>
</log4j:configuration>
```

### log4j 2.x

#### 依赖

```xml
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.13.0</version>
</dependency>
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-slf4j-impl</artifactId>
    <version>2.13.0</version>
</dependency>
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-web</artifactId>
    <version>2.13.0</version>
</dependency>
```

#### 配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration>
    <Appenders>
        <Console name="Stdout" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss,SSS}:%5p [%40.40c{1.}:%3L] - %m%n"/>
        </Console>
        <Socket name="Socket" host="127.0.0.1" port="8082">
            <JsonLayout compact="true" eventEol="true" />
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss,SSS}:%5p [%40.40c{1.}:%3L] - %m%n"/>
        </Socket>
    </Appenders>
    <Loggers>
        <Root level="info">
            <AppenderRef ref="Stdout"/>
            <AppenderRef ref="Socket"/>
        </Root>
    </Loggers>
</Configuration>
```

### logstash 配置

```conf
input {
  beats {
    port => 5044
  }

  tcp {
        host => "127.0.0.1"
        port => 8082
        mode => "server"
        ssl_enable => false
        codec => json {
            charset => "UTF-8"
        }
  }
}

output {
  stdout {
      codec => rubydebug
    }
  elasticsearch {
    hosts => "http://localhost:9200"
    index => "spring-mvc-elk"
    codec  => rubydebug
    #user => "elastic"
    #password => "changeme"
  }
}
```

## Spring Boot 配置

### 依赖

```xml
<dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>4.11</version>
</dependency>
```

### logback 配置

### plan A

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true">
    <include resource="org/springframework/boot/logging/logback/base.xml"/>
    <appender name="LOGSTASH" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <destination>127.0.0.1:8082</destination>
        <encoder charset="UTF-8" class="net.logstash.logback.encoder.LogstashEncoder"/>
    </appender>

    <root level="INFO">
        <appender-ref ref="LOGSTASH"/>
        <appender-ref ref="CONSOLE"/>
    </root>
</configuration>
```

#### plan B

```xml
<encoder charset="UTF-8"
    class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
        <providers>
            <timestamp>
                <timeZone>UTC</timeZone>
            </timestamp>
            <pattern>
                <pattern>
                    {
                    "logLevel": "%level",
                    "serviceName": "${springAppName:-}",
                    "pid": "${PID:-}",
                    "thread": "%thread",
                    "class": "%logger{40}",
                    "rest": "%message"
                    }
                </pattern>
            </pattern>
        </providers>
</encoder>
```

### logstash 配置

```conf
input {
  beats {
    port => 5044
  }

  tcp {
        host => "127.0.0.1"
        port => 8082
        mode => "server"
        ssl_enable => false
        codec => json {
            charset => "UTF-8"
        }
  }
}

output {
  stdout {
      codec => rubydebug
    }
  elasticsearch {
    hosts => "http://localhost:9200"
    index => "spring-mvc-elk"
    #user => "elastic"
    #password => "changeme"
  }
}
```
