/**
 * 这个文件存放全局变量   已在main.js 里面配置了  直接在需要引用的地方 使用 this.GlobalVar.avatar 就可以
 * 图片require(变量)会报错  所以这边avatar 就不用了 先留着当个示例
 * 如果是API返回的动态路径 建议API返回的绝对路径 不用require 就行了
 * 用require 注意是为了解决引用vue本地assets图片需要加@ 符合才行
*/
const avatar = '@/assets/Other_images/adminheader.gif'
const imgServerIP = 'http://192.168.11.133:8033'
export default {
  avatar,
  imgServerIP
}
