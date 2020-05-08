---
title: 【JavaScript 高级程序设计】第二十一章 Ajax 与 Comet
date: 2020-02-05
categories:
 - JavaScript
tags:
 - JavaScript
 - 网络
 - ajax
 - 读书笔记
---

## XMLHTTPRequest 对象

​		创建 IE8+ 的 XHR 对象可以直接使用原生构造函数：new XMLHttpRequest()，若要兼容 IE7 及以下浏览器，可以使用下面的函数：

```javascript
function createXHR(){
    if(typeof XMLHttpRequest != "undefined"){
        return new XMLHttpRequest();
    } else if(typeof ActiveXObject != "undefined"){
        if(typeof arguments.callee.activeXString != "string"){
            var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", 											"MSXML2.XMLHttp"];
            var i, len;
            
            for (i = 0, len = versions.length; i < len; i++){
                try{
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    break;
                } catch (ex) {
                    //跳过
                }
            }
            
            return new ActiveXObject(arguments.callee.activeXString);
        }
    } else {
        throw new Error("No XHR object available.");
    }
}
```

### XHR 用法

​		获取到 XHR 对象后，要调用的第一个方法是 xhr.open()，接收 3 个参数：

1. 要发送的请求类型，如“get”、“post”等。
2. 请求的 URL。可以是相对于执行代码的当前页面的 URL，也可以是绝对路径。
3. 是否发送异步请求。fasle 表示同步，JavaScript 代码会等到服务器响应之后才继续执行。

​        调用 open() 并不会真正发送请求，而只是启动一个请求以备发送。

​		发送请求要调用 xhr.send() 方法，接收一个参数，即要作为请求主题发送的数据。若不需要发送数据，必须传入 null，因为这个参数对某些浏览器来说是必须的。

​		收到响应后，响应的数据会自动填充到 XHR 对象的属性。相关属性如下：

- responseText，作为响应主体被返回的文本。
- responseXML，如果响应的内容类型是“text/xml”或“application/xml”，这个属性将保存包含响应数据的 XML DOM 文档。若不是，则值为 null。
- status，响应的 HTTP 状态。
- statusText，HTTP 状态的说明。

​        多数情况下，要发送异步请求，才能让 JavaScript 继续执行而不必等待响应，此时可以检测 XHR 对象的 readyState 属性，判断请求/响应过程的当前活动阶段，该属性取值如下：

- 0，未初始化。尚未调用 open 方法。
- 1，启动。已经调用 open 方法，但尚未调用 send 方法。
- 2，发送。已经调用 send 方法，但尚未接收到响应。
- 3，接收。已经接收到部分响应数据。
- 4，完成。已经接收到全部响应数据，而且已经可以在客户端使用了。

​        只要 readyState 属性的值由一个值变成另一个值，就会触发一次 XHR 对象的 readystatechange 事件，可用此事件来检测每次状态变化后 readyState 的值。**注意必须在调用 open（）方法之前指定 readystatechange 事件处理程序（DOM 0 级方法），才能确保跨浏览器兼容性**。

​		接收到响应之前，还可以调用 abort() 方法来取消异步请求。

​		终止请求后，还应该对 XHR 对象进行解引用操作。

​		由于内存原因，不建议重用 XHR 对象。

### HTTP 头部信息

​		XHR 对象也提供了操作请求头、响应头信息的方法。

​		默认情况下，发生 XHR 请求的同时，还会发送下列头部信息：

- Accept，浏览器能够处理的内容类型。
- Accept-Charset，浏览器能够显示的字符集。
- Accept-Encoding，浏览器能够处理的压缩编码。
- Accept-Language，浏览器当前设置的语言。
- Connection，浏览器与服务器之间连接的类型。
- Cookie，当前页面设置的任何 Cookie。
- Host，发出请求的页面所在的域。
- Referer，发出请求的页面的 URI。
- User-Agent，浏览器的用户代理字符串。

​        使用 setRequestHeader() 方法可以设置自定义请求头信息，接收两个参数：头部字段名称、值。要成功发送请求头信息，必须在 open 方法之后、send 方法之前调用 setRequestHeader() 方法。

​		调用 XHR 的 getResponseHeader() 方法并传入头部字段名称，可以取得相应的响应头部信息。

​		调用 getAllResponseHeaders() 可返回包含所有头部信息的多行字符串。

### GET 请求

​		用于向服务器查询信息，可以将查询字符串参数追加到 URL 末尾，查询字符串的每个参数名称、值都必须使用 encodeURIComponent() 方法进行编码，各个名-值对之间用 & 符号分隔。

​		可用下面的函数进行辅助添加查询字符串：

```javascript
function addURLParam(url, name, value){
    url += (url.indexof("?") == -1 ? "?" : "&");
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    return url;
}
```

### POST 请求

​		通常用于向服务器发送应该被保存的数据，POST 请求应该把数据作为请求的主体来提交。

​		在 send() 方法中传入要发送的主体数据。

​		也可以模仿表单提交，把 Content-Type 头部信息设置为 application/x-www-form-urlencoded，然后传输内容设置为符合表单格式的字符串。



## XMLHTTPRequest 2 级

### FormData

​		FormData 为序列化表单以及创建与表单格式相同的数据提供了便利。

​		可以创建 FormData 对象后添加数据：

```javascript
var data = new FormData();
data.append("name", "Nicholas");//参数为键-值
```

​		也可以在 FormData 构造函数中直接传入表单元素：

```javascript
var data = new FormData(document.forms[0]);
```

​		创建好 FormData 对象后，直接传给 XHR 对象的 send() 方法即可：

```javascript
xhr.send(data);
```

​		使用 FormData 的方便之处在于不必明确地在 XHR 对象上设置请求头信息，XHR 对象能自动识别并设置。

### 超时设定

```javascript
xhr.timeout = 10000;//设置请求超时时间，10秒
//设置请求超时事件处理程序
xhr.ontimeout = function(){
    //超时处理
};
```

### overrideMimeType() 方法

​		用于重写 XHR 响应的 MIME 类型。必须在 send 方法之前调用。



## 进度事件

​		进度事件最早只针对 XHR 操作，目前也被其他 API 借鉴。有以下 6 个进度事件：

- loadstart，接收到响应数据的第一个字节时触发。
- progress，接收响应期间持续触发。
- error，请求发生错误时触发。
- abort，因为调用 abort() 方法而终止连接时触发。
- load，接收到完整的响应数据时触发。
- loadend，通信完成或触发 error、abort、load 事件后触发。

​        每个请求触发顺序都是：loadstart 开始，然后是一个或多个 progress，然后触发 error 或 abort 或 load，最后以 loadend 事件结束。

​		load、progress 事件需要注意一些细节。

### load 事件

​		并不是所有浏览器都实现了适当的 load 事件的 event 对象，所以在 load 事件处理程序中，还是要使用 xhr 对象。且只要收到服务器响应，不管其状态如何，都会触发 load 事件，所以还是要对 status 进行检查。

### progress 事件

​		progress 事件会在浏览器接收新数据期间周期性地触发。onprogress 事件处理程序会接收一个 event 对象，其 target 属性指向 xhr 对象。event 对象还有 3 个属性：

- lengthComputable，表示进度信息是否可用。
- position，已经接收的字节数。
- totalSize，根据 Content-Length 响应头部确定的预期字节数。

​        为确保正确执行，必须在调用 open 方法之前添加 onprogress 事件处理程序。



## 跨域源资源共享（CORS）

​		默认情况下，XHR 只能访问与包含它的页面位于同一个域中的资源。但是，合理的跨域请求对部分浏览器应用也是至关重要的。

​		CORS 定义了在访问跨域资源时，浏览器与服务器应该如何沟通。基本思想就是使用自定义的 HTTP 头部让浏览器与服务器沟通，从而决定请求或相应是应该成功，还是应该失败。

​		比如一个简单的使用 GET 或 POST 发送的请求，没有自定义头部，而主体内容是 text/plain。在发送请求时，需要附加一个额外的 Origin 头部，其中包含请求页面的源信息（协议、域名、端口），以便服务器根据这个头部信息来决定是否给予响应。

​		如果服务器认为这个请求可以接受，就在 Access-Control-Allow-Origin 头部中回发相同的源信息（如果是公共资源，可以回发 “*” ）。

​		如果没有这个头部，或头部信息不匹配，浏览器会驳回请求。

​		注意上方列举的实现，请求和响应都不包含 cookie 信息。

### IE 对 CORS 的实现

​		微软在 IE8 中引入了 XDR（XDomainRequest） 类型。这个对象与 XHR 类似，但能实现安全可靠的跨域通信，部分实现了 W3C 的 CORS 规范。以下是 XDR 与 XHR 的一些不同之处：

- cookie 不会随请求发送，也不会随响应返回。
- 只能设置请求头部的 Content-Type 字段。
- 不能访问响应头部的信息。
- 只支持 GET 和 POST 请求。

​        这些变化使 CSRF（Cross-Site Request Forgery，跨站点请求伪造）和 XSS（Cross-Site Scripting，跨站点脚本）的问题得到缓解。被请求的资源可以根据它认为合适的任何数据（用户代理、来源页面等）来决定是否设置 Access-Control-Allow-Origin 头部。作为请求的一部分，Origin 头部的值表示请求的来源域，以便远程资源明确地识别 XDR 请求。

​		XDR 请求与 XHR 请求的使用基本一致，部分不同点如下：

- XDR 的 open 方法直接收两个参数：请求类型、URL。只支持异步请求，所有没有第三个参数。
- 接收响应后，只能访问响应的原始文本，无法确定响应的状态码。
- 只要响应有效就会触发 load 事件。
- 响应中缺少 Access-Control-Allow-Origin，或失败就会触发 error 事件。
- 因为不能设置其他请求头信息，XDR 对象有一个 contentType 字段用于设置发送数据的格式。

### 其他浏览器对 CORS 的实现

​		与调用普通的 XHR 的一样，只需在 open 函数传入 URL 时，传入绝对路径即可，因为这些浏览器会自动触发跨域行为。

​		与 IE 中的 XDR 不同，通过跨域 XHR 对象可以访问 status 和 statusText 属性，且支持同步请求。

​		为了安全，跨域 XHR 还有以下限制：

- 不能使用 setRequestHeader() 设置自定义头部。
- 不能发送和接收 cookie。
- 调用 getAllResponseHeaders() 方法总会返回空字符串。

### Preflighted Requests

​		CORS 通过一种叫 Preflighted Requests 的透明服务器验证机制支持使用自定义的头部、GET和POST以外的方法、不同类型的主体内容。使用下列高级选项来发送请求时，就会向服务器发送一个 Preflight 请求。这种请求使用 OPTIONS 方法，发送下列头部：

- Origin，请求页面源信息（与简单请求相同）。
- Access-Control-Request-Method，请求自身使用的方法。
- Access-Control-Request-Headers，可选，自定义头部信息，多个头部以逗号分隔。

​        发送上述请求后，服务器可以决定是否允许这种类型的请求，并通过在响应中发送如下头部信息，与浏览器沟通：

- Access-Control-Allow-Origin，与简单请求相同。
- Access-Control-Allow-Methods，允许的方法，多个方法以逗号隔开。
- Access-Control-Allow-Headers，允许的头部，多个头部以逗号隔开。
- Access-Control-Max-Age，应该将这个 Preflight 请求缓存多长时间，单位：秒。

### 带凭据的请求

​		默认情况下，跨域请求不提供凭据（cookie、HTTP认证、客户端 SSL 证明等）。

​		将 withCredentials 属性设置为 true，可以指定某个请求应该发送凭据。若服务器接受带凭据的请求，会用 Access-Control-Allow-Credentials : true 来响应。

​		如果发送的是带凭据的请求，而服务器响应没有包含上述头部信息，浏览器就不会把响应交给 JavaScript（responseText 中将是空字符串，status 为 0，而且会调用 onerror 事件处理程序）。

​		另外，服务器也可以在 Preflight 请求的响应中设置该头部，表示允许源发送带凭据的请求。

### 跨浏览器的 CORS

​		即使支持程度不一，但所有浏览器都支持简单的（非 Preflight 和不带凭据的）请求，因此，可以实现跨浏览器的方案。思想：检查是否存在 withCredentials 属性、检测 XDomainRequest 对象是否存在：

```javascript
function createCORSRequest(method, url){
    var xhr = new XMLHTTPRequest();
    if("withCredentials" in xhr){
        xhr.open(method, url, true);
    }else if(typeof XDomainRequest != "undefined"){
        xhr = new XDomainRequest();
        xhr.open(method, url);
    }else{
        xhr = null;
    }
    return xhr;
}
```

​		获取到兼容的 xhr 对象后，就可以设置事件处理程序、用 send 方法发送请求了。



## 其他跨域技术

### 图像 Ping

​		因为 <img> 标签请求图像没有跨域限制，因此可以用 Image 对象动态创建图像来发送请求，不用担心跨域问题。但由于得不到任何数据，只能监听请求是否结束。

```javascript
var img = new Image();
img.onload = img.onerror = function(){
    alert("Done!");
};
img.src = "http://www.example.com/test?name=Nicholas";
```

​		缺点：

- 只能发送 GET 请求。
- 无法访问服务器的响应文本。

### JSONP

​		JSONP，JSON with padding 的简写，也叫填充式 JSON 或 参数式JSON。

​		JSONP 由两部分组成：回调函数和数据。

​		JSONP 利用 <script> 标签没有跨域限制的特性，动态地向文档插入 script 标签，并指定 src 属性，即可进行跨域请求发送。在响应中直接调用回调函数，并传入数据，即可进行响应操作。例：

```javascript
function handleResponse(response){
    //响应操作
}

var script = document.createElement("script");
script.src = "http://freegoeip.net/json/?callback=handleResponse";
document.body.insertBefore(script, document.body.firstChild);
```

​		缺点：

- 若访问的其他域不安全，可能会在响应中携带恶意代码。
- 不好确认 JSONP 请求是否失败。HTML5 给 script 标签新增的 onerror 事件没有浏览器实现。

### Comet

​		Comet 指一种更高级的 Ajax 技术，也有人称为 服务器推送。Comet 能够让信息近乎实时推送到页面。

​		有两种实现 Comet 的方法：长轮询、流。

​		**长轮询**是传统轮询（也叫短轮询）的翻版，即定时向服务器发送请求。

​		短轮询：发送请求后，服务器立即返回响应。

​		长轮询：发送请求后，服务器一直保持连接打开，直到有数据可发送。发送完数据后，浏览器关闭刚才的连接，随即再次发起一个请求，以此类推。

​		轮询的优势是所有浏览器都支持 XHR 和设置 timeout，需要注意的仅仅是设计好发送请求的时间间隔。



​		第二种 Comet 实现是 **HTTP 流**。流在页面的整个生命周期内只是用一个 HTTP 连接。具体就是浏览器发送请求后，服务器保持连接打开，然后周期性地向浏览器发送数据。

​		在浏览器中通过监听 readystatechange 事件，检测 readyState 值是否为 3（接收到部分响应数据），就可以用 XHR 对象实现 HTTP 流。浏览器不断从服务器接收数据，readyState 值会周期性地变为 3，此时 responseText 属性保存了所有接收到的数据，需要比较之前接收到的数据，决定从什么位置开始取得最新的数据。

### 服务器发送事件

​		SSE（Server-Sent Events）是围绕只读 Comet 交互推出的 API 或者模式。

#### SSE API

​		先创建一个 EventSource 对象，并传入入口点：

```javascript
var source = new EventSource("muevents.php");
```

​		传入的 URL 必须与创建对象的页面同源。source 有一个 readyState 属性，值如下：

- 0，正在连接到服务器
- 1，打开了连接
- 2，关闭了连接

​        还有 3 个事件，如下：

- open，建立连接时触发
- message，从服务器接收到新事件时触发
- error，无法建立连接时触发

​        服务器发回的数据，保存在 onmessage 事件的 event.data 中。

​		默认情况下，EventSource 对象会保持与服务器的连接，连接断开也会重新连接。

​		项完全关闭连接，可以调用 source.close() 方法。

#### 事件流

​		服务器事件会通过一个持久的 HTTP 响应发送，响应的 MIME 类型为 text/event-stream，格式为纯文本。

​		注意：只有在包含 data:  的数据后面有空行时，才会触发 message 事件。

​		也可在 data:  后面一行加上 id:  开头的字符，将数据给特定的事件指定一个关联的 id。

### Web Sockets

​		Web Sockets 的目标是在一个单独的持久连接上提供全双工、双向通信。在 JavaScript 中创建了 Web Sockets 之后，会有一个 HTTP 请求发送到服务器以发起连接。取得服务器响应后，建立的连接会使用 HTTP 升级从 HTTP 协议交换为 Web Sockets 协议。

​		URL 连接由 http:// 变为 ws://，https:// 变为 wss://。

​		优点：减少服务端与客户端直接通信时传输的数据大小。

#### Web Sockets API

​		先实例化一个 WebSocket 对象，传入 URL：

```javascript
var socket = new WebSocket("ws://www.example.com/server.php");
```

​		注意，构造函数中的 URL 必须是绝对路径。同源策略对 Web Sockets 不适用，因此可以打开到任何站点的连接，至于是否能够通信，则完全取决于服务器。（通过握手信息可以知道请求来自何方）。

​		实例化 WebSocket 对象后，浏览器会马上尝试创建连接。WebSocket 也有一个表示当前状态的 readyState 属性，值如下：

- WebSocket.OPENING(0)，正在建立连接。
- WebSocket.OPEN(1)，已经建立连接。
- WebSocket.CLOSING(2)，正在关闭连接。
- WebSocket.CLOSE(3)，已经关闭连接。

​        readyState 的值永远从 0 开始。要关闭连接，可在任何时候调用 **socket.close()** 方法，此时 readyState 值立即变为 2，关闭后就会变成 3 。

#### 发送和接收数据

​		WebSocket 打开后，就可以通过连接发送和接收数据。

​		调用 **socket.send()** 方法即可发送数据，接收一个参数，数据字符串。

​		接收到数据时，会触发 WebSocket 的 onmessage 事件，数据保存在 event 的 data 属性中，值也是字符串。

#### 其他事件

- open，成功建立连接时触发。
- error，发生错误时触发，连接不能连续。
- close，连接关闭时触发。

​        WebSocket 只支持 DOM 0 级方法定义事件处理程序，例 socket.onerror = function(){}。

### SSE 与 Web Sockets

​		如何对这两种技术进行选择：

- 是否能够建立和维护 WebSocket 服务器，因为 Web Sockets 协议不同于 HTTP，所以需要单独建立。而 SSE 通过常规 HTTP 即可通信。
- 是否需要双向通信，若只需从服务器获取数据，使用 SSE 即可；若需要双向通信，则 Web Sockets 更好。



## 安全

​		对于未被授权系统有权访问某个资源的情况，被称为 CSRF（Cross-Site Request Forgery，跨站点请求伪造）。未被授权系统会伪装自己，让处理请求的服务器认为它是合法的。

​		为确保通过 XHR 访问的 URL 安全，同行的做法就是验证发送请求者是否有权限访问相应的资源，有列几种方法：

- 要求以 SSL 连接来访问可以通过 XHR 请求的资源。
- 要求每一次请求都要附带经过相应算法计算得到的验证码。

​        注意，下列措施对于方法 CSRF 攻击不起作用：

- 要求发送 POST 而不是 GET 请求----很容易改变。
- 检查来源 URL 已确定是否可信----来源记录很容易伪造。
- 基于 cookie 信息进行验证----很容易伪造。





