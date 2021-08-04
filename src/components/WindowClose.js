import CustomWebComponent from '../CustomWebComponent.js'

export default class WindowClose extends CustomWebComponent {
  static register() {
    if (customElements.get('window-close')) return
    customElements.define('window-close', WindowClose)
  }
  static get observedAttributes() {
    return []
  }

  constructor() {
    super({
      props: {},
      template: `
      <style>
      :host:hover {
        background-color: #430000;
      }
      :host:active {
        background-color: #a70000;
      }
      </style>
      <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke-width="1" stroke="#3d404d">
          <line x1="12" y1="12" x2="20" y2="20" />
          <line x1="12" y1="20" x2="20" y2="12" />
        </g>
      </svg>
      `,
    })

    this.className = 'window-controller-item'
    this.classList.add('window-close')
  }

  mounted() {
    super.mounted()

    this.addEventListener('click', this.handleClick)
  }

  handleClick() {
    require('electron')?.ipcRenderer.send('window-close')
  }
}
