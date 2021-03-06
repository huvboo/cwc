import CustomWebComponent from '../CustomWebComponent.js'

class Button extends CustomWebComponent {
  constructor(props = { label: 'Button', backgroundColor, color }) {
    super({
      props,
      template: `
      <style>
      :host {
        display: inline-block;
        height: 20px;
        padding: 1px 6px;
        border-radius: 4px;
        background-color: #00A1F1;
        color: #FFF;
        font-size: 12px;
        line-height: 1.5;
        cursor: default;
        user-select: none;
      }
      </style>
      `,
    })

    this.shadowRoot.childNodes[0].nodeValue = this.props.label
    if (this.props.backgroundColor)
      this.style.backgroundColor = this.props.backgroundColor
    if (this.props.color) this.style.color = this.props.color
  }
}

customElements.define('cwc-button', Button)

export default Button
