import CustomWebComponent from '../CustomWebComponent.js'

export default class WindowMinimize extends CustomWebComponent {
  static register() {
    if (customElements.get('window-minimize')) return
    customElements.define('window-minimize', WindowMinimize)
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
          <line x1="12" y1="16.5" x2="20" y2="16.5" />
        </g>
      </svg>
      `,
    })

    this.className = 'window-controller-item'
    this.classList.add('window-minimize')
  }

  mounted() {
    super.mounted()

    this.addEventListener('click', this.handleClick)
  }

  handleClick() {
    require('electron')?.ipcRenderer.send('window-minimize')
  }
}
