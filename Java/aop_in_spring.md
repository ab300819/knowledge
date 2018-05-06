# Spring AOP

**这种在运行时，动态地将代码切入到类的指定方法、指定位置上的编程思想就是面向切面的编程**

## Spring AOP 原理总结

### #动态代理

* **JDK动态代理**：只能为接口创建动态代理实例，而不能针对类 。
* **CGLib（Code Generation Library）动态代理**：可以为任何类创建织入横切逻辑代理对象，主要是对指定的类生成一个子类，覆盖其中的方法，因为是继承，所以该类或方法最好不要声明成 `final`。

### #原理对比

* **JDK动态代理**：JDK动态代理技术。通过需要代理的目标类的 `getClass().getInterfaces()` 方法获取到接口信息（这里实际上是使用了Java反射技术。 `getClass()` 和 `getInterfaces()` 函数都在Class类中，Class对象描述的是一个正在运行期间的Java对象的类和接口信息），通过读取这些代理接口信息生成一个实现了代理接口的动态代理Class（动态生成代理类的字节码），然后通过反射机制获得动态代理类的构造函数，并利用该构造函数生成该Class的实例对象（`InvokeHandler` 作为构造函数的入参传递进去），在调用具体方法前调用 `InvokeHandler` 来处理。
* **CGLib动态代理**：字节码技术。利用asm开源包，把代理对象类的class文件加载进来，通过修改其字节码生成子类来处理。采用非常底层的字节码技术，为一个类创建子类，并在子类中采用方法拦截的技术拦截所有父类方法的调用，并顺势织入横切逻辑。 

### #AOP 术语

* **Joinpoint（连接点）**  
程序执行的某个特定位置：如类开始初始化前，类初始化后，类某个方法调用前。一个类或一段代码拥有一些边界性质的特定点，这些代码中的特定点就被称为“连接点”。**Spring仅支持方法的连接点**，既仅能在方法调用前，方法调用后，方法抛出异常时等这些程序执行点进行织入增强。

* **Pointcut（切点）**  
指定在哪些类的哪些方法上织入横切逻辑

* **Advice（增强）**  
描述横切逻辑和方法的具体织入点（方法前、方法后、方法的两端等）

* **Target（目标对象）**  
被AOP框架进行增强处理的对象。如果是动态AOP的框架，则对象是一个被代理的对象。

* **Introduction（引入）**  
引入是一种特殊的增强，它为类添加一些属性和方法。这样，即使一个业务类原本没有实现某个接口，通过AOP的引介功能，我们可以动态的为该事务添加接口的实现逻辑，让业务类成为这个接口的实现类。

* **Weaving（织入）**
织入是将增强添加对目标类具体连接点上的过程

* **代理（Proxy）**
一个类被AOP织入增强后，就产生了一个结果类，它是融合了原类和增前逻辑的代理类。

* **Aspect（切面）**  
将 **Pointcut** 和 **Advice** 两者组装起来。有了 ***Aspect** 的信息，Spring就可以利用JDK或CGLib的动态代理技术采用统一的方式为目标Bean创建织入切面的代理对象了

### #AOP 的动态代理

Spring AOP 基于XML配置的AOP和基于@AspcetJ注解的AOP，这两种方法虽然在配置切面时的表现方式不同，但底层都是使用动态代理技术（JDK代理或CGLib代理）

**Spring可以继承AspcetJ，但AspcetJ本身并不属于Spring AOP的范畴**

* **AspectJ**

AspectJ 在编译时“自动”编译得到了一个新类，这个新类增强了原有的 Hello.java 类的功能，因此 AspectJ 通常被称为编译时增强的 AOP 框架<br>
与 AspectJ 相对的还有另外一种 AOP 框架，它们不需要在编译时对目标类进行增强，而是运行时生成目标类的代理类，该代理类要么与目标类实现相同的接口，要么是目标类的子类——总之，代理类的实例可作为目标类的实例来使用。一般来说，编译时增强的 AOP 框架在性能上更有优势——因为运行时动态增强的 AOP 框架需要每次运行时都进行动态增强。

* **Spring AOP**

与 AspectJ 相同的是，Spring AOP 同样需要对目标类进行增强，也就是生成新的 AOP 代理类；与 AspectJ 不同的是，Spring AOP 无需使用任何特殊命令对 Java 源代码进行编译，它采用运行时动态地、在内存中临时生成“代理类”的方式来生成 AOP 代理。<br>
Spring 允许使用 AspectJ Annotation 用于定义方面（Aspect）、切入点（Pointcut）和增强处理（Advice），Spring 框架则可识别并根据这些 Annotation 来生成 AOP 代理。Spring 只是使用了和 AspectJ 5 一样的注解，但并没有使用 AspectJ 的编译器或者织入器（Weaver），底层依然使用的是 Spring AOP，依然是在运行时动态生成 AOP 代理，并不依赖于 AspectJ 的编译器或者织入器。<br>
简单地说，Spring 依然采用运行时生成动态代理的方式来增强目标对象，所以它不需要增加额外的编译，也不需要 AspectJ 的织入器支持；而 AspectJ 在采用编译时增强，所以 AspectJ 需要使用自己的编译器来编译 Java 文件，还需要织入器。

### #AOP 的使用

##**@AspectJ的使用**

如果不打算使用 Spring 的 XML Schema 配置方式，则应该在 Spring 配置文件中增加如下片段来启用 `@AspectJ` 支持：

```xml
<!-- 启动 @AspectJ 支持 -->
<bean class="org.springframework.aop.aspectj.annotation.AnnotationAwareAspectJAutoProxyCreator"/>
```

上面配置文件中的 `AnnotationAwareAspectJAutoProxyCreator` 是一个 Bean 后处理器（`BeanPostProcessor`），该 Bean 后处理器将会为容器中 Bean 生成 AOP 动态代理。 


使用 `@Aspect` 标注一个 Java 类，该 Java 类将会作为方面 Bean（也是可以被Spring容器管理的Bean），如下面代码片段所示： 

```java
// 使用 @Aspect 定义一个方面类
@Aspect 
public class LogAspect {

    // 定义该类的其他内容
    ... 
}
```

当我们使用 `@Aspect` 来修饰一个 Java 类之后，Spring 将不会把该 Bean 当成组件 Bean 处理，因此负责自动增强的后处理 Bean 将会略过该 Bean，不会对该 Bean 进行任何增强处理。开发时无须担心使用 `@Aspect` 定义的方面类被增强处理，当 Spring 容器检测到某个 Bean 类使用了 `@Aspect` 标注之后，Spring 容器不会对该 Bean 类进行增强。

##**CGLib代理与JDK动态代理**

1. 如果目标对象实现了接口，默认情况下会采用JDK的动态代理实现AOP 
2. 如果目标对象实现了接口，可以强制使用CGLIB实现AOP 
3. 如果目标对象没有实现了接口，必须采用CGLIB库，spring会自动在JDK动态代理和CGLIB之间转换

##**如何强制使用CGLIB实现AOP**

1. 添加CGLIB库
2. 在spring配置文件中加入 `<aop:aspectj-autoproxy proxy-target-class="true"/>`

##**AOP自动代理原理**

Spring提供了自动代理机制，让容器为我们自动生成代理。在内部，Spring使用 `BeanPostProcessor` 自动地完成这项工作。

这些基于 `BeanPostProcessor` 的自动代理创建器的实现类，将根据一些规则自动在容器实例化Bean时为匹配的Bean生成代理实例:

* 基于Bean配置名规则的自动代理创建器：允许为一组特定配置名的Bean自动创建代理实例的代理创建器，实现类为 `BeanNameAutoProxyCreator`
* 基于 **Advisor** 匹配机制的自动代理创建器：它会对容器中所有的 **Advisor** 进行扫描，自动将这些切面应用到匹配的Bean中（即为目标Bean创建代理实例），实现类为 `DefaultAdvisorAutoProxyCreator`
* 基于Bean中 `AspjectJ` 注解标签的自动代理创建器：为包含 `AspectJ` 注解的Bean自动创建代理实例，它的实现类是 `AnnotationAwareAspectJAutoProxyCreator` ，该类是Spring 2.0的新增类。