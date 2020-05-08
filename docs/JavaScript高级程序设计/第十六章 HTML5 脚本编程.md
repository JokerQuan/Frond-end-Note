---
title: 【JavaScript 高级程序设计】第十六章 HTML5 脚本编程
date: 2020-02-03
categories:
 - JavaScript
tags:
 - JavaScript
 - HTML5
 - 读书笔记
---

## 跨文档消息传递

​		跨文档消息传递，有时简称为 XDM，指的是在来自不同域的页面间传递消息。

​		XDM 的核心是 postMessage() 方法，目的是向包含在当前页面的 <iframe> 元素，或由当前页面弹出的窗口传递数据。

​		postMessage() 方法接收两个参数，消息、消息接收方来自哪个域的字符串。第二个参数用于保障通信安全。例：

```javascript
var iframeWindow = document.getElementById("myframe").contentWindow;
iframeWindow.postMessage("A secret", "http://www.wrox.com");
```

​		接收到 XDM 消息时，会触发 window 对象的 message 事件，异步触发，可能有延迟，event 对象包含下列信息：

- data，作为 postMessage（）方法第一个参数传入的字符串数据。
- origin，发送消息的文档所在的域。
- source，发送消息的文档的 window 对象的代理，不能访问任何数据，只能用来调用 postMessage() 方法。



## 原生拖放

### 拖放事件

​		拖动元素时，将依次触发下列事件：

1. dragstart
2. drag
3. dragend

​        当元素被拖动到一个有效的放置目标上时，会依次触发下列事件（事件目标是放置目标的元素）：

1. dragenter
2. dragover
3. dragleave 或 drop

### 自定义放置目标

​		拖动元素经过无效的放置目标时，光标会变成圆环中有一条反斜线，表示不能放置，此时无论如何操作，都不会触发 drop 事件。

​		可以把任何元素设置为有效的放置目标，方法是重写 dragenter 和 dragover 事件的默认行为，例：

```javascript
var droptarget = document.getElementById("droptarget");

EventUtil.addHandler(droptarget, "dropover", function(event){
    event.preventDefault();
});

//dropenter 同上
```

​		此时释放鼠标，就可以触发 drop 事件了。

​		Firefox 中还要阻止 drop 事件的默认行为，以防默认行为打开错误的 URL，导致错误。

### dataTransfer 对象

​		只能在拖放事件处理程序中访问 dataTransfer 对象。有两个主要方法：

- getData()，一个参数，数据类型：“text”、“URL”。
- setData()，两个参数，数据类型、要保存的值。

​        可在拖动开始时调用 setData() 保存数据，drop 时用 getData() 取出。不过保存在 dataTransfer 对象中的数据，只能在 drop 事件中读取。

### dropEffect 与 effectAllowed

- dropEffect，标识被拖动的元素能够执行哪种放置行为，有下列 4 个值：

    - none，不能把拖动的元素放在这里。除文本框外所有元素的默认值都是 none。
    - move，应该把拖动的元素移动到放置目标。
    - copy，应该把拖动的元素复制到放置目标。
    - link，表示放置目标会打开拖动的元素。但拖动的元素必须为链接，有 URL。

    **dropEffect属性必须在 ondragenter 事件中，针对放置目标来设置。**

- effectAllowed，表示允许拖动元素的哪种 dropEffect，值如下：

    - uninitialized，没有给被拖动的元素设置任何放置行为。
    - none，被拖动的元素不能有任何行为。
    - copy
    - link
    - move
    - copyLink
    - copyMove
    - linkMove
    - all

    **必须在 ondragstart 事件处理程序中设置 effectAllowed 属性。**

### 可拖动

​		默认情况下，图片、链接、文本（被选中情况下）是可以拖动的。

​		HTML5 中，所有元素有了一个新属性，draggable，表示元素是否可以拖动。

### 其他成员

​		dataTransfer 对象还应包含下列属性和方法：

- addElement(element)，为拖动操作添加一个元素。
- clearData(format)，清除以特定格式保存的数据。
- setDragImage(element, x, y)，指定一副图像，当拖动发生时，显示在光标下方。
- types，当前保存的数据类型。



## 媒体元素

​		以前为了保证跨浏览器兼容性，不得不使用 Flash 来处理音视频。HTML5 新增了 <audio> 和 <video> 标签，即可不依赖任何插件就能嵌入跨浏览器的音视频内容。

​		使用这两个标签时，至少要包含 src 属性，指向要加载的媒体文件。

​		这两个媒体元素还可以触发很多事件，监控着不同属性的变化，可能是媒体播放的结果，也可能是用户操作的结果。

​		使用 audio 和 video 的 play()、pause() 方法，可以手动控制媒体文件的播放。

​		原生的 JavaScript 构造函数 Audio，可以在任何时候播放音频，且不用插入到文档中。



## 历史状态管理

​		history 对象，有以下方法：

- pushState()，将新的状态信息加入历史状态栈。
- replaceState()，重新当前状态。