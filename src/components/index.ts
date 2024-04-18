import SvgIcon from '@/components/SvgIcon/index.vue'
//引入element-plus提供全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// interface AllGlobalComponent {
//   SvgIcon: any
// }
//
// const allGlobalComponent = { SvgIcon } as AllGlobalComponent
const allGlobalComponent = { SvgIcon }

export default {
  // main 中导入使用咱自定义插件后会自动执行 install 方法
  install(app: any) {
    Object.keys(allGlobalComponent).forEach((key) => {
      // console.log(key, allGlobalComponent[key])
      app.component(key, allGlobalComponent[key])
    })

    //将element-plus提供全部图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}
