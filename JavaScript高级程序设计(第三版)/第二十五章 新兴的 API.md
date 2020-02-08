# 第二十五章 新兴的 API

​		许多尚未稳定的新兴 API，浏览器着手实现时，都会在前面加上前缀，比如微软 ms，Chrome 和 Safari 是 webkit，通过这些前缀，浏览器可以测试还在开发中的 API。去掉前缀后的部分在所有浏览器中都是一致的。

## requestAnimationFrame()

​		requestAnimationFrame() 这个方法会告诉浏览器，有一个动画开始了。进而浏览器可以确定重绘的最佳方案。

### 早期动画循环

​		在 JavaScript 创建动画的典型方式，就是使用 setInterval 方法来控制所有动画。这种动画循环有两个关键：合适的循环间隔，不能过长（动画不够平滑），也不能过短（CPU 性能不够）。大多数显示刷新率为 60 Hz，因此最佳循环间隔是 1000/60 ms，约等于 17 ms。但由于 单线程的限制，所以 setTimeout 和 setInterval 都不是十分精确。

### 循环间隔的问题

​		每个浏览器的计时精度也不一样，这也让动画绘制无法精确控制：

- IE8 及更早版本的计时器精度为 15.625 ms。
- IE9 及之后版本的计时器精度为 4 ms。
- Firefox 和 Safari 的计时器精度为 10 ms。
- Chrome 的计时器精度为 4 ms。

### mozRequestAnimationFrame

​		CSS 动画和变换的优势在于，浏览器知道动画什么时候开始，因此会计算出正确的循环间隔，在恰当的时候刷新 UI。

​		而对于 JavaScript 动画，浏览器无从知晓什么时候开始。

​		因此 mozRequestAnimationFrame 的方案就是，通过它告诉浏览器某些 JavaScript 代码将要执行动画，这样浏览器可以在运行某些代码后进行适当的优化。

​		mozRequestAnimationFrame 方法接收一个参数，即在重绘屏幕前调用的一个函数。这个函数负责改变下一次重绘时的 DOM 样式。为了创建动画循环，可以像之前使用 setTimeout 一样，把多个对 mozRequestAnimationFrame 的调用连缀起来，例：

```javascript
function updateProgress(){
    var div = document.getElementById("status");
    div.style.width = (parseInt(div.style.width, 10) + 5) + "%";
    
    if (div.style.left != "100%"){
        mozRequestAnimationFrame(updateProgress);
    }
}

mozRequestAnimationFrame(updateProgress);
```

​		mozRequestAnimationFrame 只运行一次传入的参数，因此在需要再次修改 UI 从而生成动画时，需要再次手动调用它。同样也需要考虑什么时候停止动画。

​		以上方案，解决了浏览器不知道 JavaScript 动画什么时候开始、不知道最佳循环时间的问题。但是还有不知道代码到底什么时候执行的问题。传入 mozRequestAnimationFrame 的函数，会获得一个时间码(1970年1月1日到当前时间的毫秒数)，表示下一次重绘实际发生的事件，另外，有一个 mozAnimationStartTime 属性，表示上一次重绘的时间码，例：

```javascript
function draw(timestamp){
    //计算两次重绘的时间间隔
    var diff = timestamp - startTime;
    
    //使用 diff 确定下一步的绘制时间
    
    //把startTime重置为这一次的绘制时间
    startTime = timestamp;
    
    //重绘 UI
    mozRequestAnimationFrame(draw);
}

var startTime = mozAnimationStartTime;
mozRequestAnimationFrame(draw);
```

### webkitRequestAnimationFrame 和 msRequestAnimationFrame

​		基于 mozRequestAnimationFrame，Chrome 和 IE10+ 也有自己的实现，但有差异：

- 不会给回调函数传递时间码。
- Chrome 有第二个可选参数，表示即将要发生变化的 DOM 元素。
- Chrome 还提供了一个方法，webkitCancelAnimationFrame，用于取消之前计划执行的重绘操作。

​        可以用以下封装，兼容 Firefox、IE10+、Chrome：

```javascript
(function(){
    function draw(timestamp){
        //计算两次重绘的时间间隔
        var drawStart = (timestamp || Date.new()),
            diff = drawStart - startTime;
        
        //使用 diff 确定下一步的绘制时间
        
        //把 startTime 重置为这一次的绘制时间
        startTime = drawStart;
        
        //重绘 UI
        requestAnimationFrame(draw);
    }
    
    var requestAnimationFrame = window.requestAnimationFrame ||
        						window.mozRequestAnimationFrame ||
        						window.webkitRequestAnimationFrame ||
        						window.msRequestAnimationFrame,
        startTime = window.mozAnimationStartTime || Date.now();
    
    requestAnimationFrame(draw);
})();
```

​		以上代码在 Chrome 和 IE10+ 中记录的重绘时间，因为不是浏览器原生针对 requestAnimationFrame 提供的数据计算的，所有时间是不够精确的，只能大致知道。



## Page Visibility API

​		该 API 用于告诉开发人员，页面的状态：

- document.hidden，页面是否隐藏，包括页面在后台标签中或浏览器最小化。
- document.visibilityState
    - 页面在后台标签或浏览器最小化
    - 页面在前台标签中
    - 实际的页面已隐藏，但用户可以看见预览，如最近任务栏
    - 页面在屏幕外执行预渲染处理
- visibilitychange 事件，文档从可见、不可见直接转换时触发

​        使用该 API 时，由于浏览器实现进度不统一，注意在前面加上兼容的前缀。特别是 visibilityState 属性，浏览器目前实现不一样，且可能还会变化，建议不要使用。



## Geolocation API

​		页面尝试访问位置信息，浏览器会弹出是否允许的选项，询问用户是否分享位置信息。

​		Geolocation API 在浏览器中的实现是 navigator.geolocation 对象，该对象包含 3 个方法：

- getCurrentPosition()，调用这个方法就会触发请求位置访问的对话框，方法接受 3 个参数：成功回调函数、可选的失败回调函数、可选的选项对象。成功回调函数接收一个 Position 对象参数，该对象有两个属性：coords、timestamp。coords 对象包含下列信息：

    - latitude，十进制的纬度
    - longtitude，十进制的经度
    - accuracy，经纬度坐标的精度，单位为米

    有些浏览器还在 coords 对象中提供如下属性：

    - altitude，以米为单位的海拔高度，没有则为 null
    - altitudeAccuracy，以米为单位，海拔高度的精度，数值越大越不准确
    - heading，指南针方向，0° 表示正北，NaN 表示没有检测到数据
    - speed，速度，每秒移动多少米，没有则为 null

    失败回调函数接收失败信息对象，该对象包含 message、code。code 数值表示：

    - 1，用户拒绝共享
    - 2，位置无效
    - 3，超时

    第三个参数是一个选项对象：

    - enableHighAccuracy，为true表示尽可能使用最准确的位置信息
    - timeout，等待位置信息的最长时间
    - maximumAge，上一次取得坐标信息的有效时间

- watchPosition()，参数与 getCurrentPosition 一样，第一次调用后，watchPosition 就会等待系统发出位置信息已改变的信号。调用 watchPosition 后，会返回一个数值，标识跟踪监控。

- clearWatch()，传入 watchPosition 返回的标识，功能是取消指定的 watchPosition。



## File API

​		表单元素：

```html
<input type="file">
```

​		File API 在表单中的文件输入字段的基础上，又添加了一些直接访问文件信息的接口。HTML5 在 DOM 中为文件输入元素添加了一个 files 集合。通过文件输入字段选择了一个或多个文件时，files 集合中将包含一组 File 对象，每个 File 对象对应一个文件，有以下只读属性：

- name，本地文件系统中的文件名
- size，文件的字节大小
- type，字符串，文件的 MIME 类型
- lastModifiedDate，字符串，文件上一次被修改的时间（只有 Chrome 实现）

### FileReader 类型

​		FileReader 类型实现的是一种异步文件读取机制，可以把 FileReader 想象为 XHR，区别只是它读取的是文件系统，而不是远程服务器。FileReader 提供如下方法：

- readAsText(file, encoding)，以纯文本方式进行读取，将读到的文本保存在 result 属性中，第二个参数是可选的编码类型。
- readAsDataURL(file)，读取文件并将文件以数据 URI 的形式保存在 result 属性中。
- readAsBinaryString(file)，读取文件并将一个字符串保存在 result 属性中，字符串中的每个字符表示一字节。
- readAsArrayBuffer(file)，读取文件并将一个包含文件内容的 ArrayBuffer 保存在 result 属性中。

​        由于 FileReader 是异步的，故提供了几个事件，最有用的是以下三个：

- progress，是否又读取了新数据，每过  50 ms 左右触发一次，event 对象与 XHR 的 progress 事件对象包含的信息一样：lengthComputable、loaded、total。
- error，是否发生了错误，发生错误时触发，event 对象只包含一个属性 code，值为：1、未找到文件。2、安全性错误。3、读取中断。4、文件不可读。5、编码错误。
- load，是否已经读完整个文件，文件加载完成后触发。

### 读取部分内容

### 对象 URL

### 读取拖放的文件

​		从桌面上把文件拖放到浏览器中也会触发 drop 事件，结合使用 HTML5 拖放 API 和 文件 API，能够通过 drop 事件的 event.dataTransfer.files 中读取到被放置的文件。

### 使用 XHR 上传文件

​		创建一个 DormData 对象，通过它调用 append 方法传入相应的 File 对象作为参数，然后把 FormData 对象传递给 XHR 的 send() 方法，结果与通过表单上传一模一样。



## Web 计时

​		Web Timing API。Web 计时机制的核心是 window.performance 对象，包含以下属性：

- window.performance.navigation，包含页面导航的多个属性：
    - redirectCount，页面加载前重定向的次数
    - type，数值常量，表示刚刚发生的导航类型
        - performance.navigation.TYPE_NAVIGATE(0)，页面第一次加载。
        - performance.navigation.TYPE_RELOAD(1)，页面重载过。
        - performance.navigation.TYPE_BACK_FORWARD(2)，页面是通过前进后退按钮打开的。
- window.performance.timing，相关的时间戳属性组成的对象，有 20 个左右属性，记录页面在被加载到浏览器中各个阶段的时间。利用此属性，可以分析影响页面性能的瓶颈。



## Web Workers

​		Web Workers 规范通过让 JavaScript 在后台运行，解决了长时间运行的 JavaScript 进程导致浏览器冻结用户界面的问题。

### 使用 Worker

​		实例化 Worker 对象并传入要执行的 JavaScript 文件名就能创建一个新的 Web Worker，例：

```javascript
var worker = new Worker("stufftodo.js");
```

​		这行代码会导致浏览器下载 stufftodo.js，但只有 Worker 接收到消息才会实际执行文件中的代码。给 Worker 传递消息，使用 postMessage() 方法。

```javascript
worker.postMessage("Start!");
```

​		postMessage 方法可传入字符串、对象。

​		Worker 是通过 message 和 error 事件与页面通信的，来自 Worker 的信息保存在 event.data 中。

​		Worker 内部的 JavaScript 在执行过程中遇到错误时，会触发 error 事件，event 对象包含三个属性：

- filename，发生错误的文件名。
- lineno，代码行号。
- message，完整的错误信息。

​        任何时候，只要调用 worker.terminate() 方法，就可以停止 Worker 的工作，而且 Worker 中的代码会立即停止执行，后续的所有过程都不会再发生，包括 message 和 error 事件。

### Worker 全局作用域

​		Web Worker 所执行的 JavaScript 代码完全在另一个作用域中，与当前网页中的代码不共享作用域。Web Worker 中的代码不能访问 DOM，也不能通过任何方式影响页面的外观。

​		Web Worker 中的全局对象是 worker 对象本身，在这个特殊的全局作用域中，this 和 self 引用的都是 worker 对象。为了方便处理数据，Web Worker 本身也是一个最小化的运行环境，有以下特性：

- 最小化的 navigator 对象，包括 onLine、appName、appVersion、userAgent 和 platform 属性。
- 只读的 location 对象。
- setTimeout、clearTimeout、setInterval、clearInterval
- XMLHTTPRequest 构造函数

​        页面上的 worker 和 Worker 内部都有 postMessage 方法和 onmessage 事件，使用这些方法可以进行相互通信。

​		在 Worker 内部，调用 close() 方法也可以停止工作，作用与在页面中调用 terminate() 方法一样。

### 包含其他脚本

​		由于不能操作 DOM，Worker 的全局作用域提供 importScripts() 方法，接收一个或多个指向 JavaScript 文件 URL。

```javascript
importScripts("file1.js", "file2.js");
```

​		每个加载过程都是异步进行的，因此所有脚本加载并执行之后，importScripts 才会执行，如上面的例子，即使 file2.js 先于 file1.js 下载完，执行的时候仍然会按照先后顺序执行。而且，这些脚本是在 Worker 的全局作用域中执行，只能包含 Worker 支持的功能。

### Web Workers 的未来

​		本节所讨论的 Worker 目前被称为“专用 Worker”，因为是专门为某个特定的页面服务的，不能在页面间共享。该规范的另外一个概念是“共享 Worker”，这种 Worker 可以在浏览器中的多个标签中打开的同一个页面间共享。

​		另外还有关于 Worker 内部能访问什么和不能访问什么的争论。比如 Storage、IndexedDB、Web Sockets、SSE 等。支持能访问的人更多。