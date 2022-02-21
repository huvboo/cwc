import CustomWebComponent from '../CustomWebComponent.js'

class TextBox extends CustomWebComponent {
  static formAssociated = true

  constructor(
    props = {
      placeholder: 'Type your notes here',
      width: '200px',
      type,
      disabled,
      autofocus,
      required,
      value,
    }
  ) {
    super({
      props,
      template: `
      <style>
      :host {
        display: inline-block;
        width: 200px;
        height: 18px;
        padding: 6px;
        border-radius: 4px;
        background-color: #FFFFFF;
        color: #000;
        border: 1px solid #F0F0F0;
        border-bottom: 1px solid #8D8D8D;
        font-size: 14px;
        line-height: 20px;
        cursor: text;
      }
      </style>
      `,
    })

    this.internals.shadowRoot.childNodes[0].nodeValue = this.props.value
    this.internals.role = 'text'
    this.contentEditable = true
    if (this.props.placeholder) this.placeholder = this.props.placeholder
    if (this.props.width) this.style.width = this.props.width

    // this.tabIndex = 0
    this.addEventListener('focus', () => {
      // this.tabIndex = -1
      this.style.outline = 'none'
      this.style.borderBottom = '2px solid #0069BA'
    })
    this.addEventListener('blur', () => {
      // this.tabIndex = 0
      this.style.borderBottom = '1px solid #8D8D8D'
    })
    this.addEventListener('keydown', (e) => {
      console.log(e)
    })
  }

  get form() {
    return this.internals.form
  }

  get name() {
    return this.getAttribute('name')
  }

  get type() {
    return this.localName
  }

  get value() {
    this.internals.shadowRoot.childNodes[0].nodeValue
  }

  set value(text) {
    this.internals.shadowRoot.childNodes[0].nodeValue = text
  }
}

customElements.define('cwc-text-box', TextBox)

export default TextBox
