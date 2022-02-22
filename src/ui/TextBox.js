import CustomWebComponent from '../CustomWebComponent.js'

class TextBox extends CustomWebComponent {
  static formAssociated = true

  constructor(props = {}) {
    super({
      props: Object.assign(
        {
          value: '',
          placeholder: 'Type your notes here',
          disabled: false,
          required: false,
          width: '200px',
        },
        props
      ),
      watch: {
        value: (text) => {
          this.shadowRoot.querySelector('#text-field').innerText = text
        },
        disabled: (bool) => {
          this.shadowRoot.querySelector('#text-field').contentEditable = !bool
        },
      },
      template: `
      <style>
      :host {
        display: inline-block;
        width: 200px;
        height: 24px;
        border-radius: 4px;
        cursor: text;
      }
      #text-field {
        padding: 2px 6px;
        background-color: #FFFFFF;
        color: #000;
        font-size: 12px;
        line-height: 18px;
        border: 1px solid #F0F0F0;
        border-bottom: 1px solid #8D8D8D;
      }
      </style>
      <div id="text-field-container">
        <div id="text-field"></div>
        <div id="search-clear"></div>
      </div>
      `,
    })

    let container = this.shadowRoot.querySelector('#text-field-container')
    let textField = container.querySelector('#text-field')
    textField.contentEditable = true
    textField.addEventListener('focus', (e) => this._onFocus.call(this, e))
    textField.addEventListener('blur', (e) => this._onBlur.call(this, e))
    textField.addEventListener('keyup', (e) => this._onKeyup.call(this, e))

    if (this.props.value) textField.innerText = this.props.value
    if (this.props.width) this.style.width = this.props.width
  }

  get name() {
    return this.getAttribute('name')
  }

  get type() {
    return this.localName
  }

  _onFocus(e) {
    e.path[0].style.outline = 'none'
    e.path[0].style.borderBottom = '2px solid #0069BA'
  }

  _onBlur(e) {
    e.path[0].style.borderBottom = '1px solid #8D8D8D'
    this.value = e.path[0].innerText
  }

  _onKeyup(e) {}
}

customElements.define('cwc-text-box', TextBox)

export default TextBox
