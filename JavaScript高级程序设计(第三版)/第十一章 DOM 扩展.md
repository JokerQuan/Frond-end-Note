# 第十一章 DOM 扩展

## 选择符 API

- querySelector()，接收一个 CSS 选择符，返回与该模式匹配的第一个元素，若没有找到则返回 null。用document 调用在全文档中搜索，用 Element 类型调用，则在该元素后代中搜索。
- querySelectorAll()，接收一个 CSS 选择符，返回所有匹配的元素，返回值是一个 Nodelist 实例。
- MatchesSelector()，接收一个 CSS 选择符，若调用元素与该模式匹配，返回 true，否则返回 false。此函数在各浏览器中实现都不一致。

## HTML 5

### 与类相关的扩充

​		致力于简化 CSS 类的用法。

- getElementByClassName() 方法，可通过 document 或 HTML 元素进行调用，参数是一个包含一个或多个类名的字符串，用空格隔开，返回带有指定类名的元素的 NodeList。
- classList 属性，包含下列方法：
    - add()，将指定字符串加入列表中，若存在，则不添加
    - contains()，列表中是否存在给定的值
    - remove()，从列表中删除指定的字符串
    - toggle()，若存在给定值，删除该值；若不存在给定值，则添加该值

### 焦点管理

- document.activeElement 属性，指向DOM中当前获得焦点的元素；文档刚刚加载完成时，指向 body；文档加载期间，该值为 null。
- document.hasFocus()，传入一个元素，返回该元素是否持有焦点。

### HTMLDocument 的变化

- document.readyState 属性，有两个值：
    - loading，正在加载文档
    - complete，已经加载完文档
- 兼容模式，document.compatMode 属性：
    - CSS1Compat，标准模式
    - BackCompat，混杂模式
- document.head，直接获取 head 元素

### 字符集属性

- document.charset，默认为 UTF-16，可用 meta 标签、响应头、代码进行修改

### 自定义数据属性

​		为元素添加非标准属性，属性名以 data- 开头，添加完成后，可用元素的 dataset 属性访问自定义属性的值，不过属性名在 dataset 中没有 data- 前缀，例：标签中自定义属性名为 data-myname，在元素的 dataset 中就叫 myname。

### 插入标记

- innerHTML 属性，读取该属性，会返回调用元素的所有后代元素对应的 HTML 文本。设置该属性，会把调用元素原来的后代元素全部替换。
- outerHTML 属性，作用与 innerHTML 属性一样，但是包含调用元素本身。
- insertAdjacentHTML() 方法，第一个参数指定要插入的位置，第二个参数为要插入的 HTML 文本。位置值如下：
    - beforebegin，在调用元素前插入一个紧邻的同辈元素
    - afterbegin，在调用元素之下插入一个新的子元素，若有子元素，在第一个子元素前插入。
    - beforeend，在调用元素之下插入一个新的子元素，若有子元素，在最后一个子元素之后插入。
    - afterend，在当前元素之后插入一个紧邻的同辈元素

### scrollIntoView() 方法

​		滚动至调用方法的元素，若不传参数，或参数为 true，则顶部与浏览器视口顶部平齐；若参数为 false，将尽可能将该元素全部显示在视口中（可能是元素底部与视口底部平齐）。



