export default class CustomWebComponent extends HTMLElement {
  static get observedAttributes() {
    return []
  }

  constructor({ name, components = [], props = {}, template = '' }) {
    super()

    this.name = name

    components.forEach((component) => component.register())

    this.props = props
    for (const prop in props) {
      const tempProp = '_' + prop
      Object.defineProperty(this, tempProp, {
        value: props[prop].default,
        writable: true,
        configurable: true,
      })
      Object.defineProperty(this, prop, {
        get() {
          return this[tempProp]
        },
        set(newValue) {
          // console.warn(
          //   `set ${prop}, oldValue:${this[prop]}, newValue:${newValue}`
          // )
          this.setAttribute(prop, newValue)
        },
        enumerable: true,
        configurable: true,
      })
    }

    this.template = template

    let oTemplate = document.createElement('template')
    oTemplate.innerHTML = template
    let cloneContent = oTemplate.content.cloneNode(true)

    let shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(cloneContent)

    this.attachInternals()
  }

  connectedCallback() {
    // console.log('自定义元素加入页面', this)

    for (const prop in this.props) {
      let option = this.props[prop]
      let attrValue = this.getAttribute(prop)
      if (attrValue !== undefined && attrValue !== null) {
        if (option.type === Boolean) {
          attrValue = attrValue == 'true'
        } else if (option.type === Number) {
          attrValue = Number(attrValue)
        } else if (option.type === Function) {
          let content = attrValue.substring(
            attrValue.indexOf('{') + 1,
            attrValue.lastIndexOf('}') - 1
          )
          attrValue = new Function(content)
        }
        if (attrValue !== option.default) {
          this[prop] = attrValue
        }
      } else {
        this.setAttribute(prop, option.default)
      }
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

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log('自定义元素属性发生变化', name, newValue)
    if (Object.hasOwnProperty.call(this.props, name)) {
      if (this.props[name].type === Boolean) {
        newValue = newValue == 'true'
      } else if (this.props[name].type === Number) {
        newValue = Number(newValue)
      } else if (this.props[name].type === Function) {
        let content = newValue.substring(
          newValue.indexOf('{') + 1,
          newValue.lastIndexOf('}') - 1
        )
        newValue = new Function(content)
      }
      this['_' + name] = newValue
    }
    // 执行渲染更新
    this._updateRendering()
  }

  _updateRendering() {
    // console.log('执行渲染更新')
  }
}
