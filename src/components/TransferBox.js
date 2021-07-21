import CustomWebComponent from '../CustomWebComponent.js'

export default class TransferBox extends CustomWebComponent {
  static register() {
    if (customElements.get('transfer-box')) return
    customElements.define('transfer-box', TransferBox)
  }
  static get observedAttributes() {
    return ['show', 'left', 'top']
  }

  constructor() {
    super({
      props: {
        show: {
          type: Boolean,
          default: false,
        },
        left: {
          type: Number,
          default: 0,
        },
        top: {
          type: Number,
          default: 0,
        },
      },
      template: `
      <style>
      :host {
        display: none;
        z-index: 9999;
        position: fixed;
        left: 0;
        top: 0;
      }

      slot {
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        background: #fff;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        overflow: auto;
      }
      </style>

      <slot name="box"></slot>
      `,
    })

    document.body.appendChild(this)

    this.watch = {
      show: (bool) => {
        this.style.display = bool ? 'block' : 'none'
      },
      left: (num) => {
        this.style.left = num + 'px'
      },
      top: (num) => {
        this.style.top = num + 'px'
      },
    }
  }

  mounted() {
    super.mounted()
  }
}
