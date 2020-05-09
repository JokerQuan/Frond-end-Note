module.exports = {
  dest: 'blog',
  title: "前端书屋",
  description: '读书笔记 学习总结',
  head: [
      ['link', { rel: 'icon', href: '/logo.jpg' }],
      ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ], 

  //主题
  theme: 'reco',
  themeConfig: {
    type : 'blog',
    displayAllHeaders: false, //显示所有页面的标题链接

    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,

    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 作者
    author: '老背背',
    authorAvatar: '/logo.jpg',

    //备案信息
    record: '滇ICP备20002269号',
    recordLink: 'http://www.beian.miit.gov.cn/',
    cyberSecurityRecord: '滇公网安备 53062102000113号',
    cyberSecurityLink: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=53062102000113',

    // 项目开始时间
    startYear: '2019',

    valineConfig: {
      appId: 'dxW22tsGY3WNjS3ki12w5L4b-gzGzoHsz',// your appId
      appKey: 'pkpOzxuOrgYihu65XO7EM73t', // your appKey
      placeholder: '发表您的看法~',
      avatar: 'wavatar',
      serverUrl: 'https://leanserver.smallsunnyfox.com',
      recordIP : true
    },

    // 侧边导航深度
    sidebarDepth: 2,

    //导航栏
    nav : [
      { text: 'Home', link: '/', icon: 'reco-home' },
      {
        text : 'Note',
        icon : 'reco-document',
        ariaLabel : 'Book Menu',
        items : [
          { text : "JavaScript高级程序设计", link : '/JavaScript高级程序设计/第二章 在HTML中使用JavaScript'},
          { text : "数据结构与算法 JavaScript 描述", link : '/数据结构与算法 JavaScript 描述/数据结构与算法JavaScript描述'},
          { text : "编写可维护的JavaScript", link : '/编写可维护的JavaScript/第一部分 编程风格'},
          { text : "高性能JavaScript", link : '/高性能JavaScript/第一章 加载和执行'},
          { text : "图解HTTP", link : '/图解HTTP/第一章 了解 Web 及网络基础'}
        ]
      },
      { 
        text: 'Github', 
        icon : 'reco-github',
        link: 'https://github.com/JokerQuan/Front-End-Note' 
      }
    ],
  
    // 博客配置
    blogConfig: {
      category: {
        location: 2,     // 在导航栏菜单中所占的位置，默认2
        text: 'Category' // 默认文案 “分类”
      },
      tag: {
        location: 3,     // 在导航栏菜单中所占的位置，默认3
        text: 'Tag'      // 默认文案 “标签”
      }
    },

    // 侧边栏
    sidebar: {
      '/JavaScript高级程序设计/': [
        '第二章 在HTML中使用JavaScript',
        '第三章 基本概念',
        '第四章 变量、作用域和内存问题',
        '第五章 引用类型',
        '第六章 面向对象程序设计',
        '第七章 函数表达式',
        '第八章 BOM',
        '第九章 客户端检测',
        '第十章 DOM',
        '第十一章 DOM 扩展',
        '第十二章 DOM2 和 DOM3',
        '第十三章 事件',
        '第十四章 表单脚本',
        '第十五章 使用 Canvas 绘图',
        '第十六章 HTML5 脚本编程',
        '第十七章 错误处理与调试',
        '第二十章 JSON',
        '第二十一章 Ajax 与 Comet',
        '第二十二章 高级技巧',
        '第二十三章 离线应用与客户端存储',
        '第二十四章 最佳实践',
        '第二十五章 新兴的 API',
        '附录'
      ],

      '/数据结构与算法 JavaScript 描述/' : [
        '数据结构与算法JavaScript描述'
      ],
      
      '/编写可维护的JavaScript/': [
        '第一部分 编程风格',
			  '第二部分 编程实践'
      ],

      '/高性能JavaScript/' : [
        '第一章 加载和执行',
        '第二章 数据存取',
        '第三章 DOM 编程',
        '第四章 算法和流程控制',
        '第五章 字符串和正则表达式',
        '第六章 快速响应的用户界面',
        '第八章 编程实践'
      ],

      '/图解HTTP/' : [
        '第一章 了解 Web 及网络基础',
        '第二章 简单的 HTTP 协议',
        '第三章 HTTP 报文内的 HTTP 信息',
        '第四章 返回结果的 HTTP 状态码',
        '第五章 与 HTTP 协作的 Web 服务器',
        '第六章 HTTP 首部',
        '第七章 确保 Web 安全的 HTTPS',
        '第八章 确认访问用户身份的认证'
      ]
    }
  }
  /** 主题 end */

}