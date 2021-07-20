export default class Button extends HTMLButtonElement {
  static register() {
    if (customElements.get('cwc-button')) return
    customElements.define('cwc-button', Button, { extends: 'button' })
  }
  constructor() {
    super()
  }
}
