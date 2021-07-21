import CustomWebComponent from '../CustomWebComponent.js'

export default class OptionItem extends CustomWebComponent {
  static register() {
    if (customElements.get('option-item')) return
    customElements.define('option-item', OptionItem)
  }
  static get observedAttributes() {
    return ['value', 'label', 'disabled', 'selected']
  }

  constructor() {
    super({
      props: {
        /**
         * 值
         */
        value: {
          type: [String, Number],
          default: 0,
        },
        /**
         * 显示文本
         */
        label: {
          type: String,
          default: '',
        },
        /**
         * 不可用
         */
        disabled: {
          type: Boolean,
          default: false,
        },
        /**
         * 已选择
         */
        selected: {
          type: Boolean,
          default: false,
        },
      },
      template: `
      <style></style>
      `,
    })
  }

  mounted() {
    super.mounted()

    this.addEventListener('click', this.handleClick)
  }

  handleClick() {
    if (this.disabled) return
    this.dispatchEvent(
      new CustomEvent('select', { bubbles: true, detail: this })
    )
  }

  _updateRendering() {
    super._updateRendering()

    this.shadowRoot.childNodes[0].textContent = this.label
  }
}
