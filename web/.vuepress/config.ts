import {defineUserConfig} from 'vuepress'
import type {DefaultThemeOptions} from 'vuepress'
import recoTheme from 'vuepress-theme-reco'

export default defineUserConfig({
    title: 'knowledge',
    description: 'a collection of knowledge for develop',
    theme: recoTheme({
        authorAvatar: '/logo.png',
        style: '@vuepress-reco/style-default',
        logo: '/logo.png',
        author: 'Mason',
        docsRepo: 'https://github.com/ab300819',
        docsBranch: 'master',
        docsDir: '',
        lastUpdatedText: '',
        autoSetCategory: true,         // 自动设置分类
        autoAddCategoryToNavbar: true,  // 自动将首页、分类和标签添加至头部导航条
        // series 为原 sidebar
        // series: {
        //
        // },
        // navbar:
        // [
        //     {text: 'Home', link: '/'},
        //     {text: 'Categories', link: '/categories/reco/1/'},
        //     {text: 'Tags', link: '/tags/tag1/1/'},
        //     {
        //         text: 'Docs',
        //         children: [
        //
        //         ]
        //     },
        // ],
        // bulletin: {
        //     body: [
        //         {
        //             type: 'text',
        //             content: `🎉🎉🎉 reco 主题 2.x 已经接近 Beta 版本，在发布 Latest 版本之前不会再有大的更新，大家可以尽情尝鲜了，并且希望大家在 QQ 群和 GitHub 踊跃反馈使用体验，我会在第一时间响应。`,
        //             style: 'font-size: 12px;'
        //         },
        //         {
        //             type: 'hr',
        //         },
        //         {
        //             type: 'title',
        //             content: 'QQ 群',
        //         },
        //         {
        //             type: 'text',
        //             content: `
        //   <ul>
        //     <li>QQ群1：1037296104</li>
        //     <li>QQ群2：1061561395</li>
        //     <li>QQ群3：962687802</li>
        //   </ul>`,
        //             style: 'font-size: 12px;'
        //         },
        //         {
        //             type: 'hr',
        //         },
        //         {
        //             type: 'title',
        //             content: 'GitHub',
        //         },
        //         {
        //             type: 'text',
        //             content: `
        //   <ul>
        //     <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/issues">Issues<a/></li>
        //     <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/discussions/1">Discussions<a/></li>
        //   </ul>`,
        //             style: 'font-size: 12px;'
        //         },
        //         {
        //             type: 'hr',
        //         },
        //         {
        //             type: 'buttongroup',
        //             children: [
        //                 {
        //                     text: '打赏',
        //                     link: '/docs/others/donate.html'
        //                 }
        //             ]
        //         }
        //     ],
        // },
        // valineConfig 配置与 1.x 一致
        // valineConfig: {
        //   appId: 'xxx',
        //   appKey: 'xxx',
        //   placeholder: '填写邮箱可以收到回复提醒哦！',
        //   verify: true, // 验证码服务
        //   // notify: true,
        //   recordIP: true,
        //   // hideComments: true // 隐藏评论
        // },
    }),
    // debug: true,
})
