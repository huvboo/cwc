const supportTypes = [Boolean, Number, String]

function error(prop, type, newValue) {
  console.error(`属性 ${prop} 的值类型必须为 ${type}, ${newValue} 不满足要求`)
}
class CustomWebComponent extends HTMLElement {
  static register() {}

  static get observedAttributes() {
    return ['style']
  }

  constructor({ props = {}, template = '' }) {
    super()

    this.watch = {}

    this.props = props
    this.proxyProps(props)

    this.template = template
    this.useTemplate(template)

    this.internals = this.attachInternals()
  }

  mounted() {
    // console.log('mounted')
  }

  connectedCallback() {
    // console.log('connected', this)

    for (const prop in this.props) {
      this.setFromAttribute(prop, this.getAttribute(prop))
    }

    this.mounted()
  }

  disconnectedCallback() {
    // console.log('disconnected')
  }

  adoptedCallback() {
    // console.log('adopted')
  }

  attributeChangedCallback(name, oldValue, attrValue) {
    console.log('自定义元素属性发生变化', name, oldValue, attrValue)
    if (Object.hasOwnProperty.call(this.props, name)) {
      this.setFromAttribute(this.props[name], attrValue)
    }

    // 执行渲染更新
    this._updateRendering()
  }

  _updateRendering() {
    // console.log('执行渲染更新')
  }

  proxyProps(props) {
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
          if (this.props[prop].type === Boolean) {
            if (typeof newValue !== 'boolean') {
              error(prop, this.props[prop].type, newValue)
            }
          } else if (this.props[prop].type === String) {
            if (typeof newValue !== 'string') {
              error(prop, this.props[prop].type, newValue)
            }
          } else if (this.props[prop].type === Number) {
            if (!Number.isFinite(newValue)) {
              error(prop, this.props[prop].type, newValue)
            }
          } else if (this.props[prop].type === Array) {
            if (!Array.isArray(newValue)) {
              error(prop, this.props[prop].type, newValue)
            }
          } else if (this.props[prop].type === Function) {
            if (typeof newValue !== 'function') {
              error(prop, this.props[prop].type, newValue)
            }
          } else {
            let oldValue = this[prop]
            if (oldValue !== newValue) {
              this['_' + prop] = newValue
              if (this.watch[prop] && typeof this.watch[prop] === 'function') {
                this.watch[prop](this[prop], oldValue)
              }
            }
          }
        },
        enumerable: true,
        configurable: true,
      })
    }
  }

  useTemplate(template) {
    let oTemplate = document.createElement('template')
    oTemplate.innerHTML = template
    let cloneContent = oTemplate.content.cloneNode(true)

    let shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(cloneContent)
  }

  setFromAttribute(prop, attrValue) {
    let option = this.props[prop]
    if (!supportTypes.includes(option.type)) return
    if (attrValue !== undefined && attrValue !== null) {
      if (option.type === Boolean) {
        attrValue = attrValue == 'true'
      } else if (option.type === Number) {
        attrValue = Number(attrValue)
      }
      this[prop] = attrValue
    }
  }
}

export default CustomWebComponent
