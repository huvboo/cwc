import TransferBox from './TransferBox.js'
import BigdataOptionList from './BigdataOptionList.js'
import CustomWebComponent from '../CustomWebComponent.js'

export default class BigdataSelect extends CustomWebComponent {
  static register() {
    if (customElements.get('bigdata-select')) return
    customElements.define('bigdata-select', BigdataSelect)
  }
  static get observedAttributes() {
    return ['placeholder', 'disabled', 'value', 'label', 'get-data', 'expand']
  }

  constructor() {
    super({
      components: [TransferBox, BigdataOptionList],
      props: {
        /**
         * 占位文本
         */
        placeholder: {
          type: String,
          default: '请选择',
        },
        /**
         * 选择的值
         */
        value: {
          type: [String, Number],
          default: '',
        },
        label: {
          type: String,
          default: '',
        },
        /**
         * 是否禁用
         */
        disabled: {
          type: Boolean,
          default: false,
        },
        /**
         * 获取选项列表的方法
         */
        'get-data': {
          type: Function,
          default: () => {
            return []
          },
          required: true,
        },
        expand: {
          type: Boolean,
          default: false,
        },
      },
      template: `
      <style>
      :host {
        position: relative;
        overflow: visible;
      }
      
      input {
        cursor: pointer;
        box-sizing: border-box;
        height: 20px;
        font-size: 12px;
      }
      </style>

      <div>
        <input
          placeholder="请选择"
          @on-change="debounceChange"
        />
      </div>
      `,
    })

    this.transfer = new TransferBox()

    this.drop = document.createElement('div')
    this.drop.slot = 'box'
    this.transfer.appendChild(this.drop)
    this.drop.style.maxHeight = '240px'
    this.drop.style.width = '176px'

    this.list = document.createElement('bigdata-option-list')
    this.drop.appendChild(this.list)

    this.head = this.shadowRoot.childNodes[3]
    this.input = this.head.childNodes[1]

    this.watch = {
      placeholder: (text) => {
        this.input.placeholder = text
      },
      disabled: (bool) => {
        this.input.disabled = bool
        this.expand = false
      },
      value: () => {
        this.reset()
      },
      label: (text) => {
        this.input.value = text
      },
      expand: (bool) => {
        this.dispatchEvent(new CustomEvent(bool ? 'expand' : 'shrink'))
        this.transfer.show = bool
        if (bool) {
          let { left, top } = this.getBoundingClientRect()
          let { width, height } = this.input.getBoundingClientRect()
          this.transfer.left = left
          this.transfer.top = top + height + 3
          this.drop.style.width = width + 'px'
        }
      },
      'get-data': (func) => {
        this.list['get-data'] = func
      },
    }
  }

  mounted() {
    super.mounted()

    document.addEventListener('click', (e) => {
      let flag = true
      let target = e.target
      while (target !== document.body) {
        if (target === this || target === this.transfer) {
          flag = false
        }
        target = target.parentNode
      }
      if (flag) this.handleBlur()
    })

    this.input.addEventListener('focus', this.handleFocus.bind(this))
    // this.input.addEventListener('keyup', this.handleFocus.bind(this))
    // this.input.addEventListener('change', this.handleQuery.bind(this))

    this.list.addEventListener('change', (e) => {
      this.handleSelect(e.detail)
    })
  }

  handleSelect(value) {
    this.value = value
    this.handleBlur()
    this.dispatchEvent(new CustomEvent('change', { detail: value }))
  }

  handleBlur() {
    if (this.expand) {
      this.reset()
      this.expand = false
    }
  }

  handleFocus() {
    this.expand = true
  }

  handleQuery(e) {
    let text = this.input.value
    console.log(text)
    // this.drop.query(text)
  }

  reset() {
    this.label = this.getOption()?.label
    this.list.resetOptions()
  }

  getOption() {
    return this.list.getOption(this.value)
  }
}
