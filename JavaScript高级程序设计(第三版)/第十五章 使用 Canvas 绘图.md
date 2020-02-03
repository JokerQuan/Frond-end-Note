# 第十五章 使用 Canvas 绘图

​		HTML 5 新增的 <canvas> 元素，负责在页面中设定一个区域，即可用 JavaScript 代码在此区域中绘制图形。

## 基本用法

​		使用 <canvas> 元素，必须指定 width、height 属性，规定绘图区域的大小。在开始和结束标签中间的，是后备信息，浏览器不支持 canvas 元素时显示。

​		想要绘图，需要先获得 2D 上下文：

```javascript
//canvas元素
var drawing = document.getElementById("drawing");
//判断浏览器是否支持
if(drawing.getContext){
    var context = drawing.getContext("2d");
    //更多代码
}
```

​		使用 toDataURL() 方法，可以导出在 canvas 元素上绘制的图像，参数为图像的 MIME 类型格式，如 png 格式：

```javascript
var imgURI = drawing.toDataURL("image/png");
```



## 2D 上下文

​		使用 2D 上下文，可以绘制简单的 2D 图像，如矩形、弧线、路径，坐标开始于 canvas 元素的左上角（0,0），x 越大越靠右，y 越大越靠下；width、height 属性值表示像素数目。

### 填充和描边

- 填充，使用指定样式填充图形，由 fillStyle 属性控制
- 描边，在图形边缘画线，由 strokeStyle 属性控制

​        filleStyle、strokeStyle 两个属性值可以是字符串、渐变对象、模式对象，默认值都是“#000000”，若是字符串，可以用 CSS 中颜色的任何格式。例：

```javascript
context.fillStyle = "red";
context.strokeStyle = "#0000ff";
```

​		设置后所有填充、描边都将沿用该样式，直至重新设置这两个值。

### 绘制矩形

- fillRect()，填充矩形，与 fillStyle 属性配合
- strokeRect()，绘制矩形，与 strokeStyle 属性配合
- clearRect()，清除矩形区域

​        以上3个方法都接收 4 个参数，矩形的 x 坐标、y 坐标、宽度、高度。

### 绘制路径

​		首先调用 context.beginPath() 方法，表示要开始绘制新路径，再调用下列方法进行实际绘制：

- arc(x, y, radius, startAngle, endAngle, conterclockwise)，以（x, y）为圆心，绘制弧线，radius 为半径，startAngle、endAngl 为起始、结束的角度，最后一个参数为 false 表示按顺时针计算，true 表示按逆时针计算。
- arcTo(x1, y1, x2, y2, radius)，从上一点到（x2, y2）绘制一条弧线，并以 radius 为半径，穿过（x1, y1）。
- bezierCurveTo(c1x, c1y, c2x, c2y, x, y)，从上一点开始到（x, y）绘制曲线，并以另外两点为控制点。
- lineTo(x, y)，从上一点绘制一条直线到（x, y）。
- moveTo(x, y)，将绘图游标移动到（x, y），不画线。
- quadraticCurveTo(cx, cy, x, y)，从上一点开始绘制一条二次曲线，到（x, y）为止，并以（cx, cy）为控制点。
- rect(x, y, width, height)，从 （x, y）点开始绘制一个矩形。

​        以上角度均用弧度表示（例 2π 为一个圆）。

​        创建路径后，若想绘制路径起点到终点的线条，可以调用 closePath()。

​		路径完成后，可设置 fillStyle 属性，用 fill() 方法填充；或设置 strokeStyle 属性，用 stroke() 方法描边；还可以用 clip() 方法在路径上创建一个剪切区域。

​		可用 isPointInPath(x, y) 方法判断某点是否在路径上。

### 绘制文本

​		主要有两个方法：

- fillText()
- strokeText()

​        这两个方法都接收 4 个参数，要绘制的文本字符串，x 坐标，y 坐标，最大像素宽度（可选）。这两个方法都以下面的属性为基础：

- font，文本样式、大小、字体，用 CSS 的格式指定，如“10px April”。
- textAlign，文本对齐方式
- textBaseLine，文本的基线

​        fillText() 方法使用 fillStyle 属性绘制文本；strokeText() 方法使用 strokeStyle 属性为文本描边。

​		measureText() 方法，接收绘制文本字符串，获得要绘制的文本尺寸对象 TextMetrics，目前只有一个 width 属性。

### 变换

- rotate(angle)，围绕远点旋转 angle 弧度。
- scale(scaleX, scaleY)，缩放图像，参数默认值为 1.0 。
- translate(x, y)，将坐标原点移动到（x, y）。
- transform(m1_1, m1_2, m2_1, m2_2, dx, dy)，直接修改变换矩阵。
- setTransform(m1_1, m1_2, m2_1, m2_2, dx, dy)，将变换矩阵重置为默认状态，然后再调用 transform()。

​        利用 save() 可保存当前的属性、变换状态至一个栈结构中、restore() 可一级一级返回栈中的状态。

### 绘制图像

​		使用 drawImage() 方法绘制图像，有 3 种参数组合：

- <img> 元素、x 坐标、 y 坐标。
- <img> 元素、x 坐标、 y 坐标、目标宽度、目标高度。
- <img> 元素、源图像的 x 坐标、y 坐标、宽度、高度、目标图像的 x 坐标、y 坐标、宽度、高度。

​        img 元素的参数，也可用 canvas 元素代替。

​		注意，图像不能来自其他域。

### 阴影

​		使用 context 的下列属性，可以在绘制形状、路径时自动绘制出阴影：

- shadowColor，CSS 格式的颜色，默认为黑色。
- shadowOffsetX，x 轴方向的阴影偏移量，默认为 0 。
- shadowOffsetY，y 轴方向的阴影偏移量，默认为 0 。
- shadowBlur，模糊的像素数，默认为 0，不模糊。

### 渐变

​		渐变对象为 CanvasGradient，用 context.createLinearGradient() 方法可以创建一个线性渐变，接收 4 个参数：起点 x 坐标、y 坐标、终点 x 坐标、y 坐标。坐标以画布原点为基准。

​		然后使用渐变对象的 addColorStop 方法指定色标。接收两个参数：色标位置（0 到 1）、CSS 颜色值。

​		还有径向渐变，createRadialGradient()。6个参数，起点圆的 x、y、半径、终点圆的 x、y、半径。

### 模式

​		模式即重复的图像，可用来填充或描边。使用 createPattern() 方法创建，两个参数，img元素（也可以是 video元素、canvas 元素）、重复规则（与 CSS 的 background-repeat 属性值相同，包括 repeat、repeat-x、repeat-y、no-repeat）。

### 使用图像数据

​		使用 getImageData() 获得图像原始数据，4个参数：要取得的画面区域的 x、y坐标、像素宽度、高度。返回 ImageData 对象，有 3 个属性：width、height、data。data即为像素数组，每一个像素有 4 个元素，依次表示红、绿、蓝、透明度，范围为 [0, 255]。

### 合成

- globalAlpha，指定所有绘制的透明度。
- globalCompositeOperation，规定后绘制的图像与先绘制的图像结合的规则。



## WebGL

​		WebGL 是针对 Canvas 的 3D上下文，但不是 W3C 定制的标准。