function error(prop, type, newValue) {
  console.error(`属性 ${prop} 的值类型必须为 ${type}, ${newValue} 不满足要求`)
}

export default function proxyProps(props) {
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
        }

        let oldValue = this[prop]
        console.log(prop, newValue, oldValue)
        if (oldValue !== newValue) {
          this['_' + prop] = newValue
          if (this.watch[prop] && typeof this.watch[prop] === 'function') {
            this.watch[prop].call(this, newValue, oldValue)
          }
        }
      },
      enumerable: true,
      configurable: true,
    })
  }
}
