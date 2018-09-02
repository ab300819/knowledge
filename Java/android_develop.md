# Android 开发学习

## Activity

### 使用 Menu

1. 在 `src\main\res\menu` 内创建 Menu 资源文件

```xml
<menu xmlns:android="http://schemas.android.com/apk/res/android"
      xmlns:app="http://schemas.android.com/apk/res-auto"
      xmlns:tools="http://schemas.android.com/tools"
      tools:context="com.exercise.demo.MainActivity">
    <item
            android:id="@+id/action_settings"
            android:orderInCategory="100"
            android:title="@string/action_settings"
            app:showAsAction="never"/>
</menu>
```

2. 重写 `onCreateOptionsMenu` 方法

```java
@Override
public boolean onCreateOptionsMenu(Menu menu) {

    getMenuInflater().inflate(R.menu.menu_main, menu);

    return true;
}
```

如果返回值为 `true`，表示允许创建的菜单显示出来，如果 `false`，创建的菜单将无法显示。

3. 重写 `onOptionsItemSelected` 方法，定义菜单响应事件

```java
@Override
public boolean onOptionsItemSelected(MenuItem item) {

    switch (item.getItemId()) {
        case R.id.action_settings:
            Toast.makeText(this, "设置界面", Toast.LENGTH_SHORT).show();
            break;
    }

    return true;
}
```

## 使用 Intent

Intent 可以分为两种：**显式 Intent** 和 **隐式 Intent**

### 显式 Intent

```java
startActivity(new Intent(MainActivity.this,Main2Activity.class));
```

### 隐式 Intent

根据 `action` 和 `category` 等信息来启动

```xml
<activity android:name=". SecondActivity"> 
    <intent-filter> 
        <action android:name=" com.example.activitytest.ACTION_START"/> 
        <category android:name="android.intent.category.DEFAULT"/> 
    </intent-filter> 
</activity>
```

```java
button.setOnClickListener(new View.OnClickListener() {

    @Override 
    public void onClick(View v) { 
        Intent intent = new Intent("com.example.activitytest.ACTION_START"); 
        startActivity(intent); 
    } 

});
```

因为 `android.intent.category.DEFAULT` 是一种默认的 `category`，所以这里不用指定 `category`。

指定自定义 `category`

```java
button.setOnClickListener(new View.OnClickListener() {

    @Override 
    public void onClick(View v) { 
        Intent intent = new Intent("com.example.activitytest.ACTION_START");
        intent.addCategory("com.example.activitytest.MY_CATEGORY");
        startActivity(intent); 
    } 

});
```

### 其他隐式 Intent 的用法

**启动系统内置动作**

```java
Intent intent = new Intent(Intent.ACTION_VIEW);
intent.setData(Uri.parse("http://www.baidu.com"));
startActivity(intent);
```

`Intent.ACTION_VIEW` 是系统内置动作，其值为 `android.intent.action.VIEW`。

也可以在 `<intent-filter>` 标签中配置一个 `<data>` 标签：

* `android:scheme` 定义数据协议部分，如 http;
* `android:host` 用于定义数据的主机部分；
* `android:port` 用于定于数据的端口部分
* `android:path` 用于指定主机名和端口之后的部分，如一段网址中跟在域名之后的内容
* `android:mimeType` 用于指定可以处理的数据类型，允许使用通配符的方式进行指定

通用可以打开拨号程序

```java
intent.setData(Uri.parse("tel:10086"));
```

**向下一个活动传递数据**

```java
intent.putExtra("key","value");
```

**返回数据给上一个活动**
