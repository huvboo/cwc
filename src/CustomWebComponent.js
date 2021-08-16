import proxyProps from './proxy'
import useTemplate from './useTemplate'
import setFromAttribute from './setFromAttrubite'

export default class CustomWebComponent extends HTMLElement {
  static register() {}

  static get observedAttributes() {
    return []
  }

  constructor({ components = [], props = {}, template = '' }) {
    super()

    this.watch = {}

    this.components = components
    components.forEach((component) => component.register())

    this.props = props
    proxyProps.call(this, props)

    this.template = template
    useTemplate.call(this, template)

    this.attachInternals()
  }

  connectedCallback() {
    // console.log('自定义元素加入页面', this)

    for (const prop in this.props) {
      setFromAttribute.call(this, prop, this.getAttribute(prop))
    }

    this.mounted()
  }

  mounted() {
    // console.log('mounted')
  }

  disconnectedCallback() {
    // 本例子该生命周期未使用，占位示意
    // console.log('自定义元素从页面移除')
  }

  adoptedCallback() {
    // 本例子该生命周期未使用，占位示意
    console.log('自定义元素转移到新页面')
  }

  attributeChangedCallback(name, oldValue, attrValue) {
    // console.log('自定义元素属性发生变化', name, oldValue, attrValue)
    if (Object.hasOwnProperty.call(this.props, name)) {
      setFromAttribute.call(this, this.props[name], attrValue)
    }

    // 执行渲染更新
    this._updateRendering()
  }

  _updateRendering() {
    // console.log('执行渲染更新')
  }
}
