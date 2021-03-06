---
title: 【图解 HTTP】第二章 简单的 HTTP 协议
date: 2020-02-24
categories:
 - HTTP
tags:
 - HTTP
 - 网络
---

## HTTP 协议用于客户端与服务端之间的通信

​		HTTP 协议和 TCP/IP 协议族内的其他众多的协议相同，用于客户端和服务器之间的通信。HTTP 协议能够明确区分哪段是客户端，哪端是服务器。



## 通过请求和响应的交换达成通信

​		HTTP 协议规定，请求从客户端发出，最后服务器端响应该请求并返回。

​		请求报文是由请求方法、请求 URI、协议版本、可选的请求首部字段和内容实体构成。

​		响应报文基本上由协议版本、状态码、用以解释状态码的原因短句、可选的响应首部字段以及实体主体构成。



## HTTP 是不保存状态的协议

​		HTTP 是一种不保存状态，即无状态（stateless）协议。HTTP 协议自身不对请求和响应之间的通信状态进行保存。也就是说在 HTTP 这个级别，协议对于发送过的请求或响应都不做持久化处理。

​		使用 HTTP 协议，每当有新的请求发送时，就会有对应的新响应产生。协议本身并不保留之前一切的请求或响应报文的信息。这是为了更快地处理大量事务，确保协议的可伸缩性，而特意把 HTTP 协议设计成如此简单的。

​		HTTP/1.1 虽然是无状态的协议，但为了实现期望的保持状态功能，于是引入了 Cookie 技术，就可以管理状态了。



## 请求 URI 定位资源

​		HTTP 协议使用 URI 定位互联网上的资源。



## 告知服务器意图的 HTTP 方法

- GET（1.0、1.1）：获取资源。
- POST（1.0、1.1）：传输实体主体。
- PUT（1.0、1.1）：传输文件。没有验证机制，使用 REST 标准一般才会开放使用。
- HEAD（1.0、1.1）：获得报文首部，用于确认 URI 的有效性及资源更新的日期时间等。
- DELETE（1.0、1.1）：删除文件。没有验证机制，使用 REST 标准一般才会开放使用。
- OPTIONS（1.1）：询问支持的方法。
- TRACE（1.1）：追踪路径。容易发生 XST，几乎不使用。
- CONNECT（1.1）：要求用隧道协议连接代理。在于代理服务器通信时建立隧道，实现用隧道协议进行 TCP 通信。主要使用 SSL（Secure Sockets Layer）和 TLS（Transport Layer Security）协议把通信内容加密后经网络隧道传输。
- LINK（1.0）
- UNLINK（1.0）



## 持久连接节省通信量

​		HTTP 协议的初始版本中，每进行一次 HTTP 通信就要断开一次 TCP 连接，大概流程如下：

1. 建立 TCP 连接（三次握手）
    1. SYN（客户端发出）
    2. SYN/ACK（服务端发出）
    3. ACK（客户端发出）
2. 单个请求/响应
    1. HTTP 请求
    2. HTTP 响应
3. 断开 TCP 连接（四次挥手）
    1. FIN（服务端发出）
    2. ACK（客户端发出）
    3. FIN（客户端发出）
    4. ACK（服务端发出）

​        随着 HTTP 的普及，文档中包含的图片等资源越来越多，每次请求造成的 TCP 连接的建立、断开会增加通信量的开销。

### 持久连接

​		为了解决上述问题，HTTP/1.1 推出了持久连接的方法（HTTP keep-alive 或 HTTP connection reuse）。持久化连接的特点是，只要任意一端没有明确提出断开连接，则保持 TCP 连接状态。

​		持久连接即在上方的大概流程第二步，可以进行多次请求响应。

​		在 HTTP/1.1 中，所有的连接默认都是持久连接。当然，这需要服务端和客户端同时支持。

### 管线化

​		从前发送请求后需等待并收到响应，才能发送下一个请求。

​		管线化技术，不用等待响应即可直接发送下一个请求，这样就能够做到同时并行发送多个请求。

​		管线化技术比持久连接还快。请求数量越多，时间效率就越高。



## 使用 Cookie 的状态管理

​		Cookie 会根据从服务器端发送的响应报文内，一个叫做 Set-Cookie 的首部字段信息，通知客户端保存 Cookie。下次客户端再往该服务器发送请求时，客户端会自动在请求报文中加入 Cookie 值后发送出去。

