---
title: 【JavaScript 高级程序设计】第十章 DOM
date: 2020-01-17
categories:
 - JavaScript
tags:
 - JavaScript
 - DOM
 - 读书笔记
---

## 节点层次

- 文档节点（document）是每个文档的根节点
- 文档节点的子节点（如html元素）被称为文档元素，文档元素是文档的最外层元素。
- 每个文档只能有一个文档元素
- HTML页面中，文档元素始终都是 \<html\>元素

​		每一段标记都可以通过树中的一个节点来表示，HTML元素通过元素节点表示，特性通过特性节点表示，文档类型通过文档类型节点表示，注释通过注释节点表示。总共有12种节点类型，他们都继承自一个基类型。

### Node 类型

​		JavaScript 中将 DOM 的所有节点类型作为 Node类型实现，除 IE 外，其他所有浏览器都可以访问该类型。JavaScript 中所有的节点类型都继承自 Node 类型，因此所有节点类型都共享基本的属性和方法。

​		每个节点都有一个 nodeType 属性，用于表明节点类型，以下为常量定义：

- Node.ELEMENT_NODE ：1
- Node.ATTRIBUT_NODE ：2
- Node.TEXT_NODE：3
- Node.CDATA_SECTION_NODE：4
- Node.ENTITY_REFERENCE_NODE：5
- Node.RNTITY_NODE：6
- Node.PROCESSING_INSTRUCTION_NODE ：7
- Node.COMMENT_NODE：8
- Node.DOCUMENT_NODE：9
- Node.DOCUMENT_TYPE_NODE：10
- Node.DOCUMENT_FRAGMENT_NODE：11
- Node.NOTATION_NODE：12

​		通过上方的常量可以轻松判断节点类型，但由于 IE 不支持该类型，所以直接用常量数字值来比较，即可适用所有浏览器。

#### nodeName 和 nodeValue

- nodeName，对于元素节点，表示节点名称，即标签
- nodeValue，对于元素节点，该值始终为 null

#### 节点关系

​		节点间可以用传统的家族关系来表示，相当于把文档树比喻成家谱。

​		每个节点都有 childNodes 属性，其中保存着一个 NodeList 对象，该对象是一种类数组对象，用于保存一组有序的节点，它是基于 DOM 结构动态查询的结果。

```javascript
var firstChild = someNode.childNodes[0];
var secondChild = someNode.childNodes.item(1);
var count = someNode.childNodes.length;
```

​		parentNode 属性，指向父节点。

​		previousSibling 属性，指向同一层级的前一个节点，若不存在则为 null。

​		nextSibling 属性，指向同一层级的下一个节点，若不存在则为 null。

​		firstChild 属性，指向第一个子节点。

​		lastChild 属性，指向最后一个子节点。

​		hasChildNodes() 方法，检测是否有子节点。

​		ownerDocument 属性，指向整个文档的文档节点（document）。

#### 操作节点

- appendChild()，向 childNodes 尾部添加节点，返回新增的节点，若传入的节点已在文档中存在，则会直接改变该节点的位置，不会新增。

- insertBefore()，插入节点，第一个参数是待插入的节点，第二个参数是作为参照的节点，返回新增的节点，若参照节点为 null，则与 appendChild 相同。

- replaceChild()，插入节点，第一个参数是待插入的节点，第二个参数是要替换的节点。

- removeChild()，移除节点，传入要移除的节点。

    ​	以上方法都是操作节点的子节点，若节点类型不支持子节点，将造成异常。

- cloneNode()，创建节点的副本，传入参数为true，会进行深复制，将会复制整个节点及其子节点；若传入参数为false，则进行浅复制，只复制节点本身，且没有指定父节点。
- normalize()，查找子节点的文本节点，若存在空文本节点，则删除，若存在连续的文本节点，则合并为一个。



### Document 类型

​		浏览器中 document 是HTMLDocument（继承自Document）的实例，表示整个 HTML 页面；且document 是 window 的一个属性，因此可作为全局对象来访问。

#### 属性

-  documentElement 属性，该属性始终指向 HTML 页面中的 \<html\> 元素。

- body 属性，指向 \<body\> 元素。

- title 属性，浏览器标签页所显示的信息，修改 title 属性会改变 \<title\> 元素

- URL 属性，当前页面完整的 url

- domain 属性，当前页面的域名

- referrer属性，链接到当前页面的上个页面的 url，没有来源页的情况下，可能为空字符串

    以上 3 个属性都存在于 http 请求头中，存在这些属性是方便我们通过 JavaScript 访问。以上 3 个属性，只有 domain 是可以设置的，且存在一定限制：若 URL 中包含一个子域名（例 p2p.wrox.com），则只能将 domain 设置为 "wrox.com"。不能讲这个属性设置为 URL 中不包含的域：

    ```javascript
    //假设页面来自 p2p.wrox.com 域
    document.domain = "wrox.com"; //成功
    document.domain = "nczonline.net"; //出错
    ```

    ​		当页面包含来自其他子域的框架，或内嵌框架时，由于跨域安全限制，来自不同子域的页面无法通过 JavaScript 通信；将每个页面的 document.domain 设置为相同的值，就能互相访问对方包含的 JavaScript 对象了，例：

    ```javascript
    // A 页面 www.wrox.com
    // B 内嵌框架，页面来自 p2p.wrox.com
    //将两个页面的 domain 都设置为 "wrox.com"，即可互相通信
    document.domain = "wrox.com"
    ```

    ​		还有一个限制，将 domain 设置为“松散的”之后，就不能再设置为“紧绷的”了：

    ```javascript
    //假设页面来自 p2p.wrox.com 域
    
    document.domain = "wrox.com"; //松散的，成功
    document.domain = "p2p.wrox.com"; //紧绷的，出错！
    ```

#### 方法

​		查找元素，有以下方法：

- document.getElementById()，通过 id 查找，区分大小写（IE8 及较低版本不区分），不存在则返回 null。
- document.getElementsByTagName()，通过标签名查找，返回包含 0 个或多个元素的 NodeList，在 HTML 中，返回 HTMLCollection 对象。
    - item()，返回指定下标索引的元素
    - nameItem() 方法，返回指定 name 属性相同的元素，若有多个，只返回第一项
    - 也可用方括号来获取元素，可传入数值，或字符串
    - 在 IE 中，使用 getElementByTagName("*") 会返回注释节点，其他浏览器则返回所有节点。
- document.getElementByName()，返回指定 name 属性的所有节点

#### 特殊集合

- document.anchors，所有带有 name 特性的 a 元素
- document.forms，所有 form 元素
- document.images，所有 img 元素
- documen.links，所有带有 href 特性的 a 元素

#### 文档写入

- write()，writeln()，接收需要写到文档中的字符串，若包含 <script/>标签，需要使用转义符号。如果在页面加载完成后调用，写入的内容会重写整个页面。
- open()，close()，打开、关闭输出流，如果是在页面加载期间写入，则不需要使用这两个方法。



### Element 类型

​		Element 类型用于表现 XML 或 HTML 元素。

#### 属性

- nodeName，标签名，也可以使用 tagName，注意大小写

#### HTML 属性

​		所有 HTML 元素都存在下列标准特性：

- id，唯一标识符
- title，附加说明
- lang，元素内容的语言代码，很少使用
- dir，语言的方向，值为“ltr”从左到右，或“rtl”从右到左
- className，指定 CSS 类，与标签中的 class 对应

#### 方法

- getAttribute()，返回指定名称的特性值，若不存在，返回 null。自定义特性也可以用此方法获取，自定义特性一般建议以 data- 开头；style属性用此方法返回 CSS 文本，用属性返回 CSS 的对象；onclick等属性，用此方法返回函数体字符串，用属性返回函数。
- setAttribute()，第一个参数为属性名，第二个参数为属性值，若属性已存在，则会替换原属性。属性名会被转换为小写，也可用元素属性直接赋值。
- removeAttribute()，删除指定属性。
- createElement()，参数为标签名



## DOM 操作技术

### 动态脚本

​		通常用下列函数：

```javascript
function loadScript(url){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.body.appendChild(script);
}
```

### 动态样式

- link 标签的方式：

    ```javascript
    function loadStyles(url){
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        var head = document.getElementByTagName("head")[0];
        head.appendChild(link);
    }
    ```

- style 标签方式：

    ```javascript
    function loadStyleString(css){
        var style = document.createElement("style");
        style.type = "text/css";
        try{
            style.appendChild(document.createTextNode(css));
        }catch (ex){
            style.styleSheet.cssText = css;//兼容 IE 浏览器，IE浏览器不允许访问style标签的子节点
        }
        var head = document.getElementByTagName("head")[0];
        head.appendChild(style);
    }
    
    //使用：
    loadStyleString("body{background-color:red}");
    ```

    