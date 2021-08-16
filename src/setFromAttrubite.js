supportTypes = [Boolean, Number, String]

export default function setFromAttribute(prop, attrValue) {
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
