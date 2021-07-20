import CustomWebComponent from '../CustomWebComponent.js'

export default class OptionItem extends CustomWebComponent {
  static register() {
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
      <style>
      :host {
        display: block;
        box-sizing: border-box;
        width: 100%;
        height: 24px;
        line-height: 24px;
        padding: 0 6px;
        white-space: nowrap;
        cursor: pointer;
      }
      :host:hover {
        background-color: #eaeaea;
      }
      :host:--selected {
        color: var(--main-blue);
      }
      :host:--disabled {
        color: #dddddd;
        cursor: not-allowed;
      }
      </style>
      `,
    })
  }

  mounted() {
    super.mounted()

    this.addEventListener('click', this.handleClick)
  }

  handleClick() {
    if (this.disabled) return
    this.dispatchEvent(new CustomEvent('select', { detail: this.value }))
  }

  _updateRendering() {
    super._updateRendering()

    this.shadowRoot.childNodes[0].textContent = this.label

    if (this._internals) {
      if (!this.disabled) {
        this._internals.states.delete('--disabled')
      } else {
        this._internals.states.add('--disabled')
      }
      if (!this.selected) {
        this._internals.states.delete('--selected')
      } else {
        this._internals.states.add('--selected')
      }
    }
  }
}
