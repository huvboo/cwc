import CustomWebComponent from '../CustomWebComponent.js'

export default class WindowMaximize extends CustomWebComponent {
  static register() {
    if (customElements.get('window-maximize')) return
    customElements.define('window-maximize', WindowMaximize)
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
          <rect x="12.5" y="12.5" width="7" height="7" />
        </g>
      </svg>
      `,
    })

    this.className = 'window-controller-item'
    this.classList.add('window-maximize')
  }

  mounted() {
    super.mounted()

    this.addEventListener('click', this.handleClick)
  }

  handleClick() {
    require('electron')?.ipcRenderer.send('window-maximize')
  }
}
