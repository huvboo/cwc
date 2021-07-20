export default class Button extends HTMLButtonElement {
  static register() {
    customElements.define('cwc-button', Button, { extends: 'button' })
  }
  constructor() {
    super()
  }
}
