# 第三章 DOM 编程

## 浏览器中的 DOM

​		DOM 渲染和 JavaScript 引擎是分开的，所以互相调用时就慢。

## DOM 访问与修改

​		修改 DOM 元素会导致浏览器重新计算页面的几何变化，所以操作 DOM 对性能影响较大。所以应该尽量把计算放在 ECMAScript 侧，完成计算再操作 DOM。

### innerHTML 对比 DOM 方法

​		innerHTML 与 document.createElement() 等 DOM 方法相比，innerHTML 在大部分浏览器中会更快一些。在最新的 Webkit 内核的浏览器（Chrome、Safari）中，性能差不多。

### 克隆节点

​		相比创建节点，在已有元素上克隆节点（element.cloneNode()），性能相对会高一点点。

### HTML 集合

​		下面方法、属性都能得到一个 HTML 集合：

- document.getElementsByName()
- document.getElementsByClassName()
- document.getElementsByTagName()
- document.images
- document.links
- document.forms
- document.forms[0].elements

​        HTML 是一个类数组，没有数组的方法，但有 length 属性。

​		JavaScript 代码中获取到的 HTML 集合一直保持与文档连接，每次需要最新信息时，都会重复执行查询过程。这就是操作 DOM 性能低的原因。

​		需要用到 DOM 元素的一些数据时，可以考虑拷贝一份到局部变量中，从而提升执行效率。



## 重绘与重排

​		浏览器下载完页面中的所有组件：HTML 标记、JavaScript、CSS、图片，之后就会解析并生成两个内部数据结构：

- DOM 树，表示页面结构。
- 渲染树，表示 DOM 节点如何显示。

​        一旦 DOM 树和渲染树构建完成，浏览器就开始显示（绘制）页面元素。

​		当 DOM 的变化影响了元素的几何属性或位置属性，浏览器会使渲染树中受到影响的部分失效，并重新构造渲染树。这个过程称为 **重排（reflow）**。完成重排后，浏览器会重新绘制受影响的部分到屏幕中，该过程称为 **重绘（repaint）**。重绘和重排操作都是代价昂贵的操作，会导致 Web 应用程序的 UI 反应迟钝，所以应该尽量减少这类过程的发生。

### 重排何时发生

- 添加或删除可见的 DOM 元素。
- 元素位置改变。
- 元素尺寸改变（包括：外边距、内边距、边框厚度、宽度、高度等）。
- 内容改变（例如：文本改变、图片被另一个不同尺寸的图片替代）。
- 页面渲染器初始化。
- 浏览器窗口尺寸改变。

​        根据改变的范围和程度，渲染树中或大或小的对应部分也需要重新计算。有些改变会触发整个页面的重排，比如：滚动条出现时。

### 渲染树变化的排队与刷新

​		由于每次重排都会产生计算消耗，大多数浏览器通过队列化修改并批量执行来优化重排过程。然后一些不经意的操作可能会强制刷新队列，并要求计划任务立即执行。获取布局信息的操作就会导致队列刷新，比如以下属性和方法：

- offsetTop、offsetLeft、offsetWidth、offsetHeight
- scrollTop、scrollLeft、scrollWidth、scrollHeight
- clientTop、clientLeft、clientWidth、clientHeight
- getComputedStyle（currentStyle in IE）

​        以上属性和方法都需要返回最新的布局信息，因此浏览器不得不执行渲染队列中的待处理变化，并触发重排以返回正确的值。

​		**在修改样式的过程中，最好避免使用上面列出的属性和方法。**以防刷新渲染队列。

### 最小化重绘和重排

​		为了减少重绘和重排的发生次数，可以合并多次对 DOM 和样式的修改，然后一次处理掉。

#### 改变样式

```javascript
//例，改变3个样式，这种写法会触发三次重排
var el = document.getElementById("myDiv");
el.style.borderLeft = '1px';
el.style.borderRight = '2px';
el.style.padding = '5px';

//合并使用 cssText 一次处理
var el = document.getElementById("myDiv");
el.style.cssText += " ; border-left: 1px; border-right: 2px; padding: 5px;";

//或者可以定义一个css样式，操作class名称即可
```

#### 批量修改 DOM

​		可以用下面的步骤减少重绘和重排的次数：

1. 使文档脱离文档流。有三种方法：

    - 隐藏元素，应用修改，重新显示。

    - 使用文档片段（fragment）在当前 DOM 之外构建一个子树，再把它拷贝回文档。例：

        ```javascript
        //为下面的列表新增元素
        <ul id="mylist">
        	<li><a href="http://phpied.com">Stoyan</a></li>    
        </ul>
        
        //使用 fragment 片段
        var fragment = document.createDocumentFragment();
        appendDataToElement(fragment, data);//循环data数组，构造li元素添加到 fragment 中
        document.getElementById('mylist').appentChild(fragment);
        ```

    - 将元素拷贝到一个脱离文档的节点中，修改副本，完成后再替换原始元素。

2. 对其应用多重改变。

3. 把元素带回文档中。

​        上面的过程只会触发两次重排（第一步和第三步）。如果忽略这两个步骤，那么在第二步所产生的任何修改都会触发一次重排。

​		推荐尽可能使用 fragment 的方式。fragment 的一个好处是，当添加一个 fragment 到节点中时，实际上被添加的是该 fragment 的子节点，而不是片段本身。

### 缓存布局信息

​		查询布局信息时，浏览器为了返回最新值，会刷新队列并应用所有改变。最好的做法是尽量减少布局信息的获取次数，获取后把它赋值给局部变量，然后根据局部变量操作。

### 让元素脱离动画流

- 用绝对位置定位页面上的动画元素，将其脱离文档流。
- 让元素动起来。当它扩大时，会临时覆盖部分页面。但这只是页面一个小区域的重绘过程，不会产生重排并重绘页面的大部分内容。
- 当动画结束时恢复定位，从而只会下移一次文档的其他元素。

### IE 和 :hover

​		在 IE 中大量使用 :hover 会导致严重的性能问题。



## 事件委托

​		利用事件冒泡特性，做事件委托，详见高程第十三章。注意下面的浏览器兼容项：

- 访问事件对象，判断事件源。
- 取消文档树中的冒泡。
- 阻止默认行为。