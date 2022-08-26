<!-- TOC -->

- [Android 开发学习](#android-开发学习)
    - [Activity](#activity)
        - [基本用法](#基本用法)
            - [使用 Menu](#使用-menu)
        - [使用 Intent](#使用-intent)
            - [显式 Intent](#显式-intent)
            - [隐式 Intent](#隐式-intent)
            - [其他隐式 Intent 的用法](#其他隐式-intent-的用法)
                - [启动系统内置动作](#启动系统内置动作)
                - [向下一个活动传递数据](#向下一个活动传递数据)
                - [返回数据给上一个活动](#返回数据给上一个活动)
        - [Activity 最佳实践](#activity-最佳实践)
    - [UI 开发](#ui-开发)
        - [常用控件](#常用控件)
            - [AlertDialog](#alertdialog)
            - [ProgressDialog](#progressdialog)
        - [自定义控件](#自定义控件)
        - [使用 `ListView`](#使用-listview)
        - [使用 `RecyclerView`](#使用-recyclerview)
    - [Fragment](#fragment)
    - [Boardcast](#boardcast)
        - [接受系统广播](#接受系统广播)
            - [动态注册](#动态注册)
            - [静态注册](#静态注册)

<!-- /TOC -->
# Android 开发学习

## Activity

### 基本用法

#### 使用 Menu

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

### 使用 Intent

Intent 可以分为两种：**显式 Intent** 和 **隐式 Intent**

#### 显式 Intent

```java
startActivity(new Intent(MainActivity.this,Main2Activity.class));
```

#### 隐式 Intent

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

#### 其他隐式 Intent 的用法

##### 启动系统内置动作

通用可以打开拨号程序

```java
intent.setData(Uri.parse("tel:10086"));
```

打开网页

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

##### 向下一个活动传递数据

在第一个 Activity 中

```java
intent.putExtra("key","value");
startActivity(intent);
```

在第二个 Activity 中

```java
Intent intent = getIntent();
intent.getStringExtra("back_data");
```

##### 返回数据给上一个活动

使用 `startActivityForResult()` 启动 Activity

```java
startActivityForResult(new Intent(MainActivity.this, SecondActivity.class), 1);
```

并重写 `onActivityResult()` 方法

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    switch (requestCode) {
        case 1:
            if (resultCode == RESULT_OK) {
                String returnData = data.getStringExtra("back_data");
                Log.d("FirstActivity", returnData);
            }
            break;
        default:
            break;
    }
}
```

在新的 Activity 中添加返回数据

```java
@Override
public void onClick(View view) {
    Intent intent = new Intent();
    intent.putExtra("back_data", "Hello SecondActivity");
    setResult(RESULT_OK, intent);
    finish();
}
```

### Activity 最佳实践

创建一个共有的基类，其他 Activity 继承自这个基类

```java
public class BaseActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d("BaseActivity", getClass().getSimpleName());
    }
}
```

## UI 开发

### 常用控件

#### AlertDialog

```java
AlertDialog.Builder alert = new AlertDialog.Builder(getActivity());

alert.setTitle("Test");
alert.setMessage("Are you ok");
alert.setCancelable(false);
alert.setPositiveButton("Ok", (dialog, which) -> {});
alert.setNegativeButton("Cancel", (dialog, which) -> {});
alert.show();
```

#### ProgressDialog

```java
ProgressDialog progressDialog = new ProgressDialog(getActivity());
progressDialog.setTitle("test");
progressDialog.setMessage("please wait");
progressDialog.setCancelable(true);
progressDialog.show();
```

### 自定义控件

布局文件

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <Button
        android:id="@+id/back"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_margin="5dp"
        android:text="@string/back" />

    <TextView
        android:id="@+id/title"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_weight="1"
        android:gravity="center"
        android:text="@string/test_title" />

    <Button
        android:id="@+id/edit"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_margin="5dp"
        android:text="@string/edit" />

</LinearLayout>
```

自定义控件

```java
public class CustomBar extends LinearLayout {

    public CustomBar(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        LayoutInflater.from(context).inflate(R.layout.custom_bar, this);

        findViewById(R.id.back).setOnClickListener(view -> Toast.makeText(getContext(), "back to previous", Toast.LENGTH_SHORT).show());

        findViewById(R.id.edit).setOnClickListener(view -> Toast.makeText(getContext(), "edit this", Toast.LENGTH_SHORT).show());
    }
}
```

### 使用 `ListView`

创建内容实体类

```java
public class Fruit {

    private String name;
    private int imageId;

}
```

创建子项布局

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <TextView
        android:id="@+id/fruit_group"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="10dp"
        android:drawableStart="@drawable/ic_menu_camera"
        android:gravity="center_vertical" />
</LinearLayout>
```

创建适配器 Adapter

```java
public class FruitAdapter extends ArrayAdapter<Fruit> {

    private int resourceId;

    public FruitAdapter(@NonNull Context context, int resource, @NonNull List<Fruit> objects) {
        super(context, resource, objects);
        resourceId = resource;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        Fruit fruit = getItem(position);

        View view;
        ViewHolder viewHolder;

        if (convertView == null) {
            view = LayoutInflater.from(getContext()).inflate(resourceId, parent, false);

            // 缓存已加载控件
            viewHolder = new ViewHolder();
            TextView textView = view.findViewById(R.id.fruit_group);
            viewHolder.setTextView(textView);
            view.setTag(viewHolder);

        } else {
            // 重用已加载 view
            view = convertView;

            viewHolder = (ViewHolder) view.getTag();
        }

        TextView textView = viewHolder.getTextView();
        textView.setText(fruit.getName());

        Drawable drawable = textView.getResources().getDrawable(fruit.getImageId(), null);
        drawable.setBounds(0, 0, drawable.getMinimumWidth(), drawable.getMinimumHeight());
        textView.setCompoundDrawables(drawable, null, null, null);

        return view;
    }


    static class ViewHolder {

        private TextView textView;

        public TextView getTextView() {
            return textView;
        }

        public void setTextView(TextView textView) {
            this.textView = textView;
        }
    }

}
```

创建 `ListView`

```java
final List<Fruit> fruitList = initFruitList();
FruitAdapter adapter = new FruitAdapter(getActivity(), R.layout.fruit_item, fruitList);
ListView listView = getActivity().findViewById(R.id.list_view);
listView.setAdapter(adapter);
listView.setOnItemClickListener((parent, view, position, id) -> {
    Fruit fruit = fruitList.get(position);
    Toast.makeText(getActivity(), fruit.getName(), Toast.LENGTH_SHORT).show();
});
```

### 使用 `RecyclerView`

创建适配器

```java
public class FruitRecyclerAdapter extends RecyclerView.Adapter<FruitRecyclerAdapter.ViewHolder> {

    private List<Fruit> fruitList;

    public FruitRecyclerAdapter(List<Fruit> fruitList) {
        this.fruitList = fruitList;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {

        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.fruit_item_horizontal, viewGroup, false);
        final ViewHolder viewHolder = new ViewHolder(view);

        view.setOnClickListener(viewer -> Toast.makeText(viewGroup.getContext(), "View Group", Toast.LENGTH_SHORT).show());
        viewHolder.getTextView().setOnClickListener(viewer -> {
            int position = viewHolder.getAdapterPosition();
            Fruit fruit = fruitList.get(position);
            Toast.makeText(viewGroup.getContext(), fruit.getName(), Toast.LENGTH_SHORT).show();
        });

        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder viewHolder, int i) {
        Fruit fruit = fruitList.get(i);
        viewHolder.getTextView().setText(fruit.getName());

        Drawable drawable = viewHolder.getTextView().getResources().getDrawable(fruit.getImageId(), null);
        drawable.setBounds(0, 0, drawable.getMinimumWidth(), drawable.getMinimumHeight());
        viewHolder.getTextView().setCompoundDrawables(null, drawable, null, null);

    }

    @Override
    public int getItemCount() {
        return fruitList.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {

        TextView textView;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            textView = itemView.findViewById(R.id.fruit_group);
        }

        public TextView getTextView() {
            return textView;
        }
    }
}
```

创建 `RecyclerView`

```java
final List<Fruit> fruitList = initFruitList();
RecyclerView recyclerView = getActivity().findViewById(R.id.recycler_view);

LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getActivity());

// 横向布局
// LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getActivity());
// linearLayoutManager.setOrientation(LinearLayoutManager.HORIZONTAL);

// 瀑布流
// StaggeredGridLayoutManager linearLayoutManager =
//         new StaggeredGridLayoutManager(3,StaggeredGridLayoutManager.VERTICAL);
recyclerView.setLayoutManager(linearLayoutManager);

FruitRecyclerAdapter fruitRecyclerAdapter = new FruitRecyclerAdapter(fruitList);
recyclerView.setAdapter(fruitRecyclerAdapter);
```

## Fragment

## Boardcast

### 接受系统广播

#### 动态注册

#### 静态注册