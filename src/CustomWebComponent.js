export default class CustomWebComponent extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor(props = {}) {
    super()

    this.props = props

    for (const prop in props) {
      let defaultValue = this.getAttribute(prop) ?? props[prop].default
      if (props[prop].type === Number) {
        defaultValue = Number(defaultValue)
      }
      console.log(`初始化属性 ${prop}:${defaultValue}`)
      this.setAttribute(prop, defaultValue)

      const tempProp = '_' + prop
      Object.defineProperty(this, tempProp, {
        value: defaultValue,
        writable: true,
        configurable: true,
      })
      Object.defineProperty(this, prop, {
        get() {
          return this[tempProp]
        },
        set(newValue) {
          console.log('set')
          this.setAttribute(prop, newValue)
        },
        enumerable: true,
        configurable: true,
      })
    }
  }

  connectedCallback() {
    console.log('自定义元素加入页面', this)
    // 执行渲染更新
    this._updateRendering()
  }
  disconnectedCallback() {
    // 本例子该生命周期未使用，占位示意
    console.log('自定义元素从页面移除')
  }
  adoptedCallback() {
    // 本例子该生命周期未使用，占位示意
    console.log('自定义元素转移到新页面')
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('自定义元素属性发生变化', name, newValue)
    if (Object.hasOwnProperty.call(this.props, name)) {
      this['_' + name] =
        this.props[name].type === Number ? Number(newValue) : newValue
    }
    console.log(this['_' + name])
    // 执行渲染更新
    this._updateRendering()
  }

  _updateRendering() {
    console.log('执行渲染更新')
  }
}
