import CustomWebComponent from '../CustomWebComponent.js'

export default class WindowUnmaximize extends CustomWebComponent {
  static register() {
    if (customElements.get('window-unmaximize')) return
    customElements.define('window-unmaximize', WindowUnmaximize)
  }
  static get observedAttributes() {
    return []
  }

  constructor() {
    super({
      props: {},
      template: `
      <svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke-width="1" stroke="#3d404d">
          <path d="M14.5 14.5L14.5 12.5L19.5 12.5L19.5 17.5L17.5 17.5" />
          <rect x="12.5" y="14.5" width="5" height="5" />
        </g>
      </svg>
      `,
    })

    this.className = 'window-controller-item'
    this.classList.add('window-unmaximize')
  }

  mounted() {
    super.mounted()

    this.addEventListener('click', this.handleClick)
  }

  handleClick() {
    require('electron')?.ipcRenderer.send('window-unmaximize')
  }
}
