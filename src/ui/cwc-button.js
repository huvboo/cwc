import CustomWebComponent from '../CustomWebComponent.js'

class CwcButtom extends CustomWebComponent {
  constructor() {
    super({ props: { label: 'Button' }, template: '<button></button>' })

    this.internals.shadowRoot.childNodes[0].innerText = this.props.label
  }
}

customElements.define('cwc-button', CwcButtom)

export default CwcButtom
