import { expect } from 'chai'

import { mount,createLocalVue } from '@vue/test-utils'
import Find from '../../src/views/Find.vue'
import slider from '@components/Find-Slider/Slider.vue'
import Contenttype from '../../src/components/Find-Slider/Contenttype.vue'
import load from '../../src/Utils/load'

// const localValue = createLocalVue()
// localValue.use(load)
describe('Contenttype.vue', () => {
  it('测试歌单是否渲染出来', () => {
    // const msg = '推荐歌单'
    //const wrapper = shallowMount(Find)
    // 这 2 句注释相当于上一句
    // const Construtor = Vue.extend(Find)
    // const vm = new Construtor().$mount()
    // wrapper.vm  === vue组件中data
    // wrapper.find('#id')  vue组件的模板中id
    const wrapper:any = mount(Contenttype)
    expect(wrapper.vm.songList.length).to.be.not.equal(0);
  })
})
