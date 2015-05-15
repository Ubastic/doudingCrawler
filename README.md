# doudingCrawler
a script fot crawlering docx from douding
## 主要需要两点注意的
1. node爬虫的基本原理
2. http请求

## node爬虫的基本原理
* 使用superagent对目标网站进行请求，得到html
* 利用cheerio模块对html进行解析
* 同时代码中大量的使用的async来对函数的处理
* 让自己的代码不至于一直处于回调的回调中
