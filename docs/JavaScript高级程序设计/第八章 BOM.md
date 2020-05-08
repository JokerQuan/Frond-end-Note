---
title: 【JavaScript 高级程序设计】第八章 BOM
date: 2020-01-15
categories:
 - JavaScript
tags:
 - JavaScript
 - BOM
 - 读书笔记
---

## window 对象

​			BOM 的核心对象是 window，它表示浏览器的一个实例。浏览器中，window 既是通过 JavaScript 访问浏览器窗口的一个接口，又是 ES 规定的 Global 对象。

### 全局作用域

​		在全局作用域中声明的属性和方法，都会变成window对象的属性和方法。全局变量不能通过 delete 操作符删除（因为var 语句添加的属性，Configurable特性为false），而在window对象上添加的属性，可以删除。

### 窗口关系及框架

​		若页面中包含框架，则每个框架都拥有自己的 window 对象，并保存在 frames 集合中，可以通过数值索引（从 0 开始，从左到右，从上到下），或框架名称来访问相应的 window 对象。

​		**top 对象始终指向最高层的框架，即浏览器窗口**。

​		**parent 对象始终指向当前框架的直接上层框架**。没有框架的情况下，parent 等于 top。

​		**self 对象始终指向当前 window对象**。

### 窗口位置

​		由于浏览器实现不一致，下方代码可获取浏览器窗口左边和上边的位置：

```javascript
var leftPos = (typeof window.screenLeft == "number") ? 
    window.screenLeft : window.screenX;
var topPos = (typeof window.screenTop == "number") ? 
    window.screenTop : window.screenY;
```

​		可以用下列方法将浏览器窗口移动到指定位置：

```javascript
//将窗口移动到200,300位置，单位px
window.moveTo(200, 300)

//将窗口向左移动50px
window.moveBy(-50, 0)
```

### 窗口大小

​		IE9+、Safari、FireFox中，outerWidth、outerHeight返回浏览器窗口本身的尺寸。

​		Chrome 中，outerWidth、outerHeight与innerWidth、innerHeight 值相同，都是viewport的大小。

​		大部分浏览器中，document.documentElement.clientWidth 和 clientHeight 中保存了 viewport 的信息。

​		可以用下列方法改变浏览器大小，但也可能被浏览器禁用：

```javascript
//调整至固定大小
window.resizeTo(100, 200);

//接收新窗口-老窗口的差值
window.resizeBy(100, 50); //200, 250
```

### 导航和打开窗口

​		window.open()，可以导航到指定url，或打开新窗口。接收4个参数：

- 要加载的 URL

- 窗口目标

- 特性字符串

- 新页面是否取代浏览器历史记录中当前加载页面

    通常只传递第一个参数，最后一个参数只在不打开新窗口的情况下使用。

​		若传入第二个参数，则会在具有该名称的窗口或框架中加载第一个参数指定的url。第二个参数也可以是下列任何一个特殊窗口名称：\_self、\_parent、\_top、\_blank。

​		若指定的第二个参数不是已存在窗口或框架，则会根据第三个参数打开新窗口，第三个参数是一个逗号分隔的设置字符串，表示新窗口的特性。

​		window.open() 会返回一个指向新窗口的引用（类似window对象），可对新窗口进行操作。

​		使用 try catch 语句可以检测弹窗是否被浏览器禁用。

### setTimeout 和 setInterval

​		严格模式下，内部函数的 this 值为 undefined。否则 this 指向 window。

### 系统对话框

- alert()：点击 x 返回 false，点击确认返回 true。

- confirm()：点击 x 或 取消返回 false，点击确认返回 true。
- prompt()：输入文字并点击确认返回输入的字符串，否则返回 null。



## location 对象

​		location 既是 window 的属性，又是 document 的属性，他们指向同一个对象。下面是 location 的属性：

- hash：URL 中的 hash（#后跟 0 个或多个字符），若不存在，返回空字符串
- host：服务器名称，包含端口号（若有）
- hostname：不带端口号的主机名
- href：当前页面的完成 url
- pathname：URL 中的目录和文件名
- port：端口号
- protocol：页面使用的协议
- search：URL的查询字符串，以 ？ 开头

### 位置操作

- location.assign()，打开新 URL 并在浏览器历史记录中生成新纪录。

    使用 window.location = "http://xxx"，或 location.href = "http://xxx" 也是一样的效果。

    直接对 location 的上述属性进行赋值，页面都会以新 URL 重新加载（hash属性除外）。

- location.replace()，不生成新历史记录，不能返回上一个页面

- reload()，重新加载（可能从缓存中加载）

- reload(true)，从服务器重新加载



## navigator 对象

​		navigator 的属性包含了浏览器的一些信息，比如名称、版本等。

### 插件检测

​		非 IE 浏览器可用 navigator.plugins 数组来查看，该数组每一项包含下列属性：

- name，插件的名称
- description，插件的描述
- filename，插件的文件名
- length，插件所处理的 MIME 类型数量



​		IE 浏览器需要使用 ActiveXObject 来检测，对插件的 COM 标识符进行判断。

例：

```javascript
//非IE浏览器插件检测
function hasPlugin(name){
    name = name.toLowerCase();
    for (var i = 0; i < navigator.plugins.length; i++){
        if (navigator.plugins[i].name.toLowerCase().indexOf(name) > -1){
            return true;
        }
    }
    return false;
}

//IE浏览器插件检测
function hasIEPlugin(name){
    try{
        new ActiveXObject(name);
        return true;
    } catch (ex) {
        return false;
    }
}

//检测所有浏览器中是否安装 flash
function hasFlash(){
    var result = hasPlugin("Flash");
    if(!result){
        result = hasIEPlugin("ShockwaveFlash.ShockwaveFlash");
    }
    return result;
}
```



## history 对象

- history.go(num)，在历史记录中跳转，负数表示返回，正数表示前进。若传入字符串，会匹配历史记录中包含该字符串的url，跳至最近的一个。
- forward()，前进
- back()，后退
- length属性，历史记录的数量