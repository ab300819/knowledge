### 方法返回地址

当一个方法被执行后，有两种方式退出这个方法：

* 第一种是执行引擎遇到任意一个方法返回的字节码指令，这种退出方法的方式称为 **正常完成出口（Normal Method Invocation Completion）**。

* 另外一种是在方法执行过程中遇到了异常，并且这个异常没有在方法体内得到处理（即本方法异常处理表中没有匹配的异常处理器），就会导致方法退出，这种退出方式称为 **异常完成出口（Abrupt Method Invocation Completion）**。
注意：这种退出方式不会给上层调用者产生任何返回值。

**无论采用何种退出方式，在方法退出后，都需要返回到方法被调用的位置，程序才能继续执行**，方法返回时可能需要在栈帧中保存一些信息，用来帮助恢复它的上层方法的执行状态。一般来说，方法正常退出时，调用者的PC计数器的值可以作为返回地址，栈帧中很可能会保存这个计数器值。而方法异常退出时，返回地址是通过异常处理器表来确定的，栈帧中一般不会保存这部分信息。

方法退出的过程实际上等同于把当前栈帧出栈，因此退出时可能执行的操作有：恢复上层方法的局部变量表和操作数栈，把返回值（如果有的话）压入调用者栈帧的操作数栈中，调整PC计数器的值以指向方法调用指令后面的一条指令等。

### 附加信息

虚拟机规范允许虚拟机实现向栈帧中添加一些自定义的附加信息，例如与调试相关的信息等。

## 方法调用

方法调用阶段的目的：确定被调用方法的版本（哪一个方法），不涉及方法内部的具体运行过程，在程序运行时，进行方法调用是最普遍、最频繁的操作。

一切方法调用在Class文件里存储的都只是符号引用，这是需要在类加载期间或者是运行期间，才能确定为方法在实际 运行时内存布局中的入口地址（相当于之前说的直接引用）。

### 解析

“编译期可知，运行期不可变”的方法（静态方法和私有方法），在类加载的解析阶段，会将其符号引用转化为直接引用（入口地址）。这类方法的调用称为“解析（Resolution）”。

在Java虚拟机中提供了5条方法调用字节码指令：

* `invokestatic`: 调用静态方法
* `invokespecial`:调用实例构造器方法、私有方法、父类方法
* `invokevirtual`:调用所有的虚方法
* `invokeinterface`:调用接口方法，会在运行时在确定一个实现此接口的对象
* `invokedynamic`:先在运行时动态解析出点限定符所引用的方法，然后再执行该方法，在此之前的4条调用命令的分派逻辑是固化在Java虚拟机内部的，而`invokedynamic`指令的分派逻辑是由用户所设定的引导方法决定的。

### 分派

**静态分派**

所有依赖静态类型来定位方法执行版本的分派动作，都称为静态分派。静态分派发生在编译阶段。

静态分派最典型的应用就是方法重载。

```java
public class StaticDispatch{

    static abstract class Human{

    }

    static class Man extends Human{

    }

    static class Woman extends Human{

    }

    public void sayHello(Human guy){
        System.out.println("Human guy");
    }

    public void sayHello(Man guy){
        System.out.println("Man guy");
    }

    public void sayHello(Woman gyu){
        System.out.println("Woman guy");
    }

    public static void main(String[] args) {
        Human man=new Man();
        Human woman=new Woman();
        StaticDispatch StaticDispatch=new StaticDispatch();
        staticDispatch.sayHello(man);   // Human guy
        staticDispatch.sayHello(woman); // Human guy
    }
}
```

`Human man = new Man();` 其中的 `Human` 称为变量的静态类型（Static Type）,`Man` 称为变量的实际类型（Actual Type）。两者的区别是：**静态类型在编译器可知，而实际类型到运行期才确定下来**。

在重载时通过参数的静态类型而不是实际类型作为判定依据，因此，在编译阶段，javac 编译器会根据参数的静态类型决定使用哪个重载版本。所以选择了`sayhello(Human)`作为调用目标，并把这个方法的符号引用写到`main()`方法里的两条`invokevirtual`指令的参数中。

**动态分派**

在运行期根据实际类型确定方法执行版本的分派过程称为动态分派。最典型的应用就是方法重写。

```java
public class DynamicDisptch{

    static abstract class Human{
        abstract void sayHello();
    }

    static class Man extends Human{

        @Override
        void sayHello(){
            System.out.println("man");
        }
    }

    static class Woman extends Human{

        @Override
        void sayHello(){
            System.out.println("woman");
        }
    }

    public static void main(String[] args) {
        Human man=new Man();
        Human woman=new Woman();
        man.sayHello(); // man
        woman.sayHello();   // woman
        man=new Woman();
        man.sayHello(); // woman
    }
}
```

**单分派和多分派**

方法的接收者、方法的参数都可以称为方法的宗量。根据分批基于多少种宗量，可以将分派划分为单分派和多分派。**单分派是根据一个宗量对目标方法进行选择的，多分派是根据多于一个的宗量对目标方法进行选择的**。

Java在进行静态分派时，选择目标方法要依据两点：一是变量的静态类型是哪个类型，二是方法参数是什么类型。因为要根据两个宗量进行选择，所以Java语言的静态分派属于多分派类型。

运行时阶段的动态分派过程，由于编译器已经确定了目标方法的签名（包括方法参数），运行时虚拟机只需要确定方法的接收者的实际类型，就可以分派。因为是根据一个宗量作为选择依据，所以Java语言的动态分派属于单分派类型。

注：到JDK1.7时，Java语言还是静态多分派、动态单分派的语言，未来有可能支持动态多分派。

**虚拟机动态分派的实现**

由于动态分派是非常频繁的动作，而动态分派在方法版本选择过程中又需要在方法元数据中搜索合适的目标方法，虚拟机实现出于性能的考虑，通常不直接进行如此频繁的搜索，而是采用优化方法。

其中一种“稳定优化”手段是：在类的方法区中建立一个 **虚方法表**（Virtual Method Table, 也称vtable, 与此对应，也存在接口方法表——Interface Method Table，也称itable）。使用虚方法表索引来代替元数据查找以提高性能。其原理与C++的虚函数表类似。

虚方法表中存放的是各个方法的实际入口地址。如果某个方法在子类中没有被重写，那子类的虚方法表里面的地址入口和父类中该方法相同，都指向父类的实现入口。虚方法表一般在类加载的连接阶段进行初始化。



