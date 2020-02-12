# 数据结构与算法JavaScript描述

## 说明

​		最开始看了 3 章，发现很多错误，有一种花正版书的钱买了盗版书的感觉。比如第 37 页对 clear 方法的实现，代码与文字解释根本对应不上，代码的实现也不正确。网上搜了一下，发现大多朋友都对这本书不看好，甚至译者也说明，原版英文书也有很多错误。故此书不打算细读，复习下各种数据结构基础即可，后续再刷 leetcode。



## 第三章 列表

​		列表通常用于存储数据量不是很大、不用进行排序的数据。通常有以下功能：

​		属性：

- listSize，列表的元素个数。
- pos，列表的当前位置。

​        方法：

- length，返回列表中元素的个数。
- clear，清空列表中的所有元素。
- toString，返回列表的字符串形式。
- getElement，返回当前位置的元素。
- insert，在现有元素后插入元素。
- append，在列表的末尾添加新元素。
- remove，从列表中删除元素。
- front，将列表的当前位置移动到第一个元素。
- end，将列表的当前位置移动到最后一个元素。
- prev，将当前位置前移一位。
- next，将当前位置后移一位。
- hasPrev，判断前一位。
- hasNext，判断后一位。
- currPos，返回列表的当前位置。
- moveTo，将当前位置移动到指定位置。

​        应用：

- 使用上面部分方法，可以使用迭代器访问列表。



## 第四章 栈

​		栈是一种特殊的列表，栈内的元素只能通过列表的一端访问，称为栈顶，因此栈是一种高效的数据结构。栈被称为一种后入先出的数据结构（LIFO，last-in-first-out）。通常有以下主要方法：

- push，入栈。
- pop，出栈，并返回出栈的元素。
- peek，返回栈顶元素，但不出栈。

​        应用：

- 数制间的相互转换。
- 回文检测，将字符一个一个按顺序入栈，再按出栈顺序组成新字符串，与原字符串比较。



## 第五章 队列

​		队列也是一种列表，但只能在队尾插入元素，在队首删除元素。用于存储按顺序排列的数据，先进先出（FIFO，first-in-first-out）。主要有如下方法：

- enqueue，入队，向队尾添加新元素。
- dequeue，出队，从队首删除元素。
- peek，返回队首元素，但不出队。

### 优先队列

​		有些使用队列的应用，在删除元素时，不必遵守先入先出的规定，还需要考虑优先权的限制。例如医院急诊科排队（模拟为队列），病情越重时，接诊的优先级越高，此时使用 dequeue 方法出栈时，就要先考虑优先级，再根据优先级、队列位置进行出栈操作。这也要求程序设计入栈时，将优先级信息包含在元素中。

### 双向队列

​		从列表两边都可以入队和出队。



## 第六章 链表

### 数组的缺点

​		在很多编程语言中，数组是固定长度的，当数组已被数据填满时，再加入新元素就非常困难。在数组中添加和删除元素也很麻烦，因为需要将数组的其他元素进行前移或后移，以反映数组刚刚进行了添加或删除操作。不过 JavaScript 的数组不存在上述问题，使用 splice 方法可以很方便的操作。

​		JavaScript 中数组的主要问题是，它们被实现成了对象，与其他语言的数组相比，效率很低。

​		如果在实际使用中发现数组很慢，就可以考虑使用链表来代替它。

### 定义链表

​		链表是由一组**节点**组成的集合，每个节点都使用一个对象的 引用指向它的后继。指向另一个节点的引用叫做**链**。

​		数组元素靠它们的位置进行引用，而链表元素则是靠相互之间的关系进行引用。通常说某个元素在某个元素后面，而不说某个元素是链表中的第几个元素。遍历链表就是从链表的头元素一直走到尾元素（但这不包含头节点，头节点常常用来作为链表的接入点）。链表的尾元素指向 null。

​		向链表插入、删除元素时，操作节点的链接即可。

### 设计一个基于对象的链表

​		思想：操作节点元素的 next 属性指向，即可进行增删改查操作。

- Node 类，包含两个属性：
    - element，保存节点上的数据。
    - next，保存指向下一个节点的链接。
- LinkedList 类，提供对链表进行操作的方法：
    - insert(newElement, item)，在 item 后面插入 newElement 节点。
    - find(item)，从头元素开始，按链表链接遍历查找。
    - remove(item)，删除 item 元素。即改变 item 前一个元素的 next 指向。

### 双向链表

​		上述链表不方便向前操作元素，通过在 Node 节点类上添加一个 previous 属性，指向前一个节点，即可实现双向链表。还有其他细节：insert、remove 时修改节点的 next、previous 指向。

### 循环链表

​		将尾部元素的 next 属性指向头元素。



## 第七章 字典



## 第八章 散列

​		散列后的数据可以快速地插入或取用。散列使用的数据结构叫**散列表**，在散列表上插入、删除、取用数据都非常快，但对于查找来说却效率低下，需要借助其他数据结构。

​		我们的散列是基于数组进行设计的。数组长度是预先设定的，如有需要，可以随时增加。使用散列存储数据时，通过一个散列函数将键映射为一个数字，范围是 0 到散列表的长度。

​		理想情况下，散列函数会将每个键值映射为一个唯一的数组索引。但即使是一个高效的散列函数，任然存在将两个键映射成同一个值得可能，这种现象被称为 **碰撞**。

​		需要考虑的最后一个问题是，散列的数组应该有多大？这是编写散列函数时必须要考虑的。常见的限制是：数组的长度应该是一个质数。后续会讨论多种确定数组大小的策略，所有的策略都基于处理碰撞的技术。

### HashTable 类

​		该类构造函数如下：

```javascript
function HashTable(){
    this.table = new Array(137);
    this.simpleHash = simpleHash;//计算散列值的方法
    this.showDistro = function(){//显示散列表中数据的分布
        for(var i = 0; i < this.table.length; i++){
            if(this.table[i] != undefined){
                print(i + ": " + this.table[i]);
            }
        }
    };
    this.put = function(key, data){
        var pos = this.simpleHash(key);
        this.table[pos] = data;
    };
    this.get = function(key){
        return this.table[this.simpleHash(key)];
    };
}
```

#### 选择散列函数

​		根据键值的类型判断：

- 整形，最简单的就是以数组的长度对键取余。除留余数法。
- 字符串类型，比较难，霍纳算法。

### 碰撞处理

- 开链法，碰撞发生时，仍然希望将键存储到该索引位置上。开链法是指实现散列表的底层数组中，每个数组元素又是一个新的数据结构，比如另一个数组，这样就能存储多个键了。
- 线性探测法，当碰撞发生时，检查散列表中的下一个位置是否为空。若果为空就存入，否则继续检查下一个位置。当存储数据使用的数组特别大时，线性探测法比开链法好。

​        可以用这个方法判断使用哪个方法：数组的大小是待存储数据个数的 1.5 倍，则使用开链法；如果是 2 倍甚至 2 倍以上，则使用线性探测法。



## 第九章 集合

​		集合由一组**无序**但彼此之间又有一定相关性的成员构成，每个成员在集合中**只能出现一次**。

​		定义：

- 不包含任何成员的集合称为空集，全集是包含一切可能成员的集合。
- 两个集合的成员完全相同，则两个集合相等。
- 一个集合中所有的成员都属于另外一个集合，则前一集合称为后一集合的子集。

​        操作：

- 并集，将两个集合中的成员进行合并，得到一个新集合。
- 交集，两个集合中共同存在的成员组成一个新的集合。
- 补集，属于一个集合而不属于另一个集合的成员组成的集合。

### Set 类的实现

​		Set 类的实现基于数组，下面是构造函数的定义：

```javascript
function Set(){
    this.dataSource = [];
    this.add = add;//添加元素，要使用indexOf检测过是否已存在
    this.remove = remove;//删除元素
    this.size = size;
    this.union = union;//求并集
    this.intersect = intersect;//求交集
    this.subset = subset;//判断是否为子集
    this.difference = difference;//求补集
    this.show = show;
}
```



## 第十章 二叉树和二叉查找树

​		树是一种非线性的数据结构，以分层的方式存储数据。本章研究二叉树。二叉树的优势在于：在二叉树上进行查找非常快（相对于链表），为二叉树添加或删除元素也非常快（相对于数组）。

​		**二叉查找树**是一种特殊的二叉树，相对较小的值保存在左节点，较大的值保存在右节点。这一特性使得查找效率很高。

### 实现二叉查找树

​		二叉查找树由节点构成，所以要先定义一个 Node 类：

```javascript
function Node(data, left, right){
    this.data = data;
    this.left = left;//保存和左子树的链接
    this.right = right;//保存和右子树的链接
    this.show = function(){
        return this.data;
    };
}
```

​		还需要一个 BST 类，来表示二叉查找树：

```java
function BST(){
    this.root = null;//表示根节点
    this.insert = insert;//插入节点的操作
    this.inOrder = inOrder;//中序遍历
}
```

​		插入节点实现如下：

```javascript
function insert(data){
    var n = new Node(data, null, null);
    if(this.root == null){
        this.root = n;
    } else {
        var current = this.root; //从根节点开始
        var parent;
        while(true){
            parent = current; //指定父节点
            if(data < current.data){ //插入值小于当前节点
                current = current.left; //移动到左节点
                if(current == null){ //左节点没有值，将该值放在左节点；否则继续循环
                    parent.left = n;
                    break;
                }
            } else {					//插入值大于当前节点
                current = current.right; //移动到右节点
                if(current == null){ //右节点没有值，将该值放在右节点；否则继续循环
                    parent.right = n;
                    break;
                }
            }
        }
    }
}
```

​		遍历二叉查找树，中序遍历（从小到大）：

```javascript
function inOrder(node){
    if(node != null){
        inOrder(node.left);
        putStr(node.show() + " ");//显示遍历结果
        inOrder(node.right);
    }
}
```

​		先序遍历：

```javascript
function preOrder(node){
    if(node != null){
        putStr(node.show() + " ");//显示遍历结果
        preOrder(node.left);
        preOrder(node.right);
    }
}
```

​		后序遍历

```javascript
function postOrder(node){
    if(node != null){
        postOrder(node.left);
        postOrder(node.right);
        putStr(node.show() + " ");//显示遍历结果
    }
}
```

### 在二叉查找树上进行查找

- 查找最小值：遍历左子树，直到最后一个节点

    ```javascript
    function getMin(){
        var current = this.root;
        while(current.left != null){
            current = current.left;
        }
        return current.data;
    }
    ```

- 查找最大值：遍历右子树，知道最后一个节点

    ```javascript
    function getMax(){
        var current = this.root;
        while(current.right != null){
            current = current.right;
        }
        return current.data;
    }
    ```

- 查找指定值，比较指定值与当前节点值的大小，从而确定向左还是向右遍历：

    ```javascript
    function find(data){
        var current = this.root;
        while(current != null){
            if(current.data == data){
                return current;
            }else if(data < current.data){
                current = current.left;
            }else{
                current = current.right;
            }
        }
        return null;
    }
    ```

### 从二叉查找树上删除节点

​		删除节点比较复杂，要考虑删除节点后，该节点的左右子节点如何接到树上。

```javascript
function remove(data){
    root = removeNode(this.root, data);
}

function removeNode(node, data){
    if(node == null){
        return null;
    }
    if(data == node.data){
        //没有子节点
        if(node.left == null && node.right == null){
            return null;
        }
        //没有左子节点
        if(node.left == null){
            return node.right;
        }
        //没有右子节点
        if(node.right == null){
            return node.left;
        }
        //有两个子节点
        var tempNode = getSmallest(node.right);
        node.data = tempNode.data;
        node.right = removeNode(node.right, tempNode.data);
        return node;
    }else if(data < node.data){
        node.left = removeNode(node.left, data);
        return node;
    }else{
        node.right = removeNode(node.right, data);
        return node;
    }
}
```

### 计数

​		在 Node 类中新增一个属性 count，插入数据时，若没有该值，设为1；若已有该值，则 count 加一。



## 第十一章 图和图算法

### 图的定义

​		图由**边的集合**和**定点的集合**组成。地图就是一种图，每个城镇可以看作一个定点，连接城镇的道路就是边。边由定点对(v1, v2)定义，v1 和 v2 分别是图中的两个顶点。顶点也有权重，也称为成本。

​		如果一个图的顶点对是有序的，则可以称之为**有向图**。若果图是无序的，则称为 **无序图** 或 **无向图**。

​		图中的一系列顶点构成 **路径**，路径中所有的顶点都由边连接。路径的总长度用路径中第一个顶点到最后一个顶点之间边的数量表示。由指向自身的顶点组成的路径称为 **环**，环的长度为 0 。

​		**圈** 是至少有一条边的路径，且路径的第一个顶点和最后一个顶点相同。无论是有向图还是无向图，只要是没有重复边或者重复顶点，就是一个 **简单圈**。除了第一个和最后一个顶点以外，路径的其他顶点有重复的圈称为 **平凡圈**。

​		如果两个顶点之间有路径，那么这两个顶点就是 **强连通** 的。如果有向图的所有顶点都是强连通的，那么这个有向图也是强连通的。

### 用图对现实中的系统建模

​		例：

- 交通流量建模，顶点表示路口，边表示街道，加权的边可以表示限速或车道数量。
- 运输系统建模，顶点表示机场，边表示航线，加权的边可以表示距离或航班成本。
- 局域网、广域网、消费市场等。

### 图类

​		若尝试用树的方式创建一个图类，用节点表示每个顶点，这种情况下，当图增长到非常大时，效率就会变得低下。

#### 表示顶点

​		Vertex 类有两个数据成员：label，标识顶点；wasVisited，是否被访问过。将所有顶点保存到数组中。

#### 表示边

​		图的实际信息都保存在边上面，因为它们描述了图的结构。

​		表示边的方法叫 **邻接表** 或 **邻接表数组**。这种方法将边存储为由顶点的相邻顶点列表构成的数组，并以此顶点作为索引。使用这种方案，可以高效地访问与这个顶点相连的所有顶点的列表。

#### 构建图

​		下面是第一个图类 Graph 的定义：

```javascript
function Graph(v){ //创建 v 个顶点的图
    this.vertices = v; //顶点个数
    this.edges = 0; //边的数量
    this.adj = []; //记录每个顶点的边
    for(var i = 0; i < this.vertives; i++){
        this.adj[i] = [];
        this.adj[i].push("");
    }
    // 为两个节点添加边
    this.addEdge = function(v, w){
        this.adj[v].push(w);
        this.adj[w].push(v);
        this.edges++;
    };
    //打印图的信息，如节点1：  1 -> 3 4
    this.showGraph = function(){
        var str = "";
        for(var i = 0; i < this.vertices; i++){
            str = str + i + " -> ";
            for(var j = 0; j < this.adj[i].length; j++){
                str += j
            }
            console.log(str + "\n");
        }
    };
}
```

​		使用：

```javascript
//创建图对象
var g = new Graph(5);
//添加边
g.addEdge(0,2);
g.addEdge(0,3);
g.addEdge(1,3);
g.addEdge(1,4);
g.addEdge(2,3);
g.addEdge(3,4);
//打印
g.showGraph();
//输出：
0 -> 2 3
1 -> 3 4
2 -> 0 1 3
3 -> 0 1 2 4
4 -> 1 3
```

### 搜索图

#### 深度优先搜索

​		用来搜索图中从给定顶点开始，有哪些路径可以选择。方法：访问一个没有访问过的顶点，将它标记为已访问，再递归访问在初始顶点的邻接表中其他没有访问过的顶点。在 Graph 类中实现如下：

```javascript
function Graph(v){
    //其他代码
    
    this.marked = [];//记录已访问过的顶点，全部初始化为 false
    for(var i = 0; i < this.vertices; i++){
        this.marked[i] = false;
    }
    
    //从指定顶点开始，深度优先搜索
    this.dfs = function(v){
        this.marked[v] = true;
        for(var w in this.adj[v]){
            if(!this.marked[w]){
                this.dfs(w);
            }
        }
    };
}
```

#### 广度优先搜索

​		从第一个顶点开始，尝试访问尽可能靠近它的顶点。本质上，这种搜索在图上是逐层移动的。在 Graph 类中实现如下：

```javascript
function Graph(v){
    //其他代码
    
    this.bfs = function(s){
        var queue = [];
        this.marked[s] = true;
        queue.push(s);
        while(queue.length > 0){
            var v = queue.shift();
            for(var w in this.adj[v]){
                if(!this.marked[w]){
                    this.marked[w] = true;
                    queue.push(w);
                }
            }
        }
    }
}
```

### 查找最短路径

​		图最常见的操作之一就是，寻找从一个顶点到另一个顶点的最短路径。

#### 广度优先搜索对应的最短路径

​		在执行广度优先搜索时，会自动查找从一个顶点到另一个相连顶点的最短路径。例如，要查找从顶点 A 到顶点 D 的最短路径，我们首先会查找从 A 到 D 是否有任何一条单边路径，接着查找两条边的路径，以此类推。这正是广度优先搜索的过程，因此我们可以轻松修改广度优先搜索算法，找出最短路径。

#### 确定路径

​		要查找最短路径，需要修改广度优先搜索算法来记录从一个顶点到另一个顶点的路径，下面是新的 BFS 算法：

```javascript
function Graph(v){
    //其他代码
    
    //保存从一个顶点到下一个顶点的所有边
    this.edgeTo = [];
    
    this.bfs = function(s){
        var queue = [];
        this.marked[s] = true;
        queue.push(s);
        while(queue.length > 0){
            var v = queue.shift();
            for(var w in this.adj[v]){
                if(!this.marked[w]){
                    this.edgeTo[w] = v;
                    this.marked[w] = true;
                    queue.push(w);
                }
            }
        }
    }
}
```

​		然后需要一个 pathTo 函数，展示图中连接到不同顶点的路径：

```javascript
function Graph(v){
    //其他代码
    
    this.pathTo = function(v){
        var source = v;
        if(!this.hasPathTo(v)){
            return undefined;
        }
        var path = [];
        for(var i = v; i != source; i = this.edgeTo[i]){
            path.push(i);
        }
        path.push(source);
        return path;
    }
    
    this.hasPathTo = function(v){
        return this.marked[v];
    }
}
```



## 第十二章 排序算法

​		请参考 [十大经典排序算法](https://www.toutiao.com/a6593273307280179715/?iid=6593273307280179715)。

- 冒泡排序
- 选择排序，每次从剩余部分选择最小值，放到已排序部分的最后一位。
- 插入排序，每次从剩余部分取一个值与已排序部分逐个进行比较并插入合适位置。
- 希尔排序
- 归并排序
- 快速排序
- 堆排序
- 计数排序
- 桶排序
- 基数排序



## 第十三章 检索算法

### 顺序查找

​		也被称为线性查找，属于暴利查找的一种。

​		优化：将经常被查找的数据按查找频率放到列表前端。

### 二分查找算法

​		若数据是有序的，二分查找算法比顺序查找更高效。



## 第十四章 高级算法

### 动态规划

​		许多实用递归去解决的编程问题，可以重写为使用动态规划的技巧解决。动态规划方案通常会使用一个数组来建立一张表，用于存放被分解成众多子问题的解。当算法执行完毕，最终解将会在这个表中很明显的地方被找到。下面看两个例子。

#### 计算斐波那契数列

​		斐波那契数列，每一项是前两项的和，递归实现：

```javascript
function recurFib(n){
    if(n == 0){
        return 0;
    }else if(n == 1 || n == 2){
    	return 1;
    }else{
        return recurFib(n-1) + recurFib(n-2);
    }
}
```

​		动态规划实现：

```javascript
function dynFib(n){
    var val = [];//记录每一项的值
    for(var i = 0; i <= n; i++){
        val[i] = 0;//全部初始化为0
    }
    if(n == 1 || n == 2){
    	return 1;
    }else{
        val[1] = 1;
        val[2] = 1;
        for(var i = 3; i <= n; i++){
            val[i] = val[i-1] + val[i-2];
        }
        return val[n];
    }
}
```

​		在计算第 20 项及更大项数时，动态规划方案将非常高效。例，计算第 45 项的耗时如下：

```javascript
1134903170
用了7743ms
1134903170
用了0ms
```

### 贪心算法

