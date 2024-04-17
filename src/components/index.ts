import SvgIcon from '@/components/SvgIcon/index.vue'

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
  }
}
