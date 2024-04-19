import SvgIcon from '@/components/SvgIcon/index.vue'
//引入element-plus提供全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// allGlobalComponent 的映射，用于告诉 TypeScript allGlobalComponent 中的键都应该是字符串
interface AllGlobalComponentMap {
  [SvgIcon: string]: any
}

/*
 报错：Vue: Element implicitly has
 an any type because expression of type string can't be used to index type
 原因：TypeScript 无法确定 allGlobalComponent[key] 的类型，因为 key 是一个字符串
 ，而 TypeScript 无法确定这个字符串是否确实是 allGlobalComponent 对象的有效键。
 解决：告诉 TypeScript allGlobalComponent 中的键都应该是字符串。你可以通过定义一个映射类型来实现这一点
 */
// const allGlobalComponent = { SvgIcon }

// 解决
const allGlobalComponent = { SvgIcon } as AllGlobalComponentMap

export default {
  // main 中导入使用咱自定义插件后会自动执行 install 方法
  install(app: any) {
    Object.keys(allGlobalComponent).forEach((key) => {
      app.component(key, allGlobalComponent[key])
    })

    //将element-plus提供全部图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}
