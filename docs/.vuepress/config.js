module.exports = {
  title: "wb博客",
  description: "记录自己所学所得",
  theme: 'reco',
  base: '/blog/',
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  themeConfig: {
    subSidebar: 'auto'
  },
  themeConfig: {
    nav: [
        { text: '首页', link: '/' },
        { 
            text: 'wb的 JavaScript 博客', 
            items: [
                { text: 'Github', link: 'https://github.com/wb1128' }
            ]
        }
    ],
    sidebar: [
      {
          title: '欢迎学习',
          path: '/',
          collapsable: false, // 不折叠
          children: [
              { title: "学前必读", path: "/" }
          ]
      },
      {
        title: "源码共读",
        path: '/ruochuan/promisify',
        collapsable: false, // 不折叠
        children: [
          { title: "promisify", path: "/ruochuan/promisify" },
          { title: "await-to-js", path: "/ruochuan/await-to-js" },
          { title: "arrify", path: "/ruochuan/arrify" }
        ],
      }
    ]
  }
};
