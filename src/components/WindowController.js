import CustomWebComponent from '../CustomWebComponent.js'
import WindowClose from './WindowClose.js'
import WindowMaximize from './WindowMaximize'
import WindowUnmaximize from './WindowUnmaximize'
import WindowMinimize from './WindowMinimize'

export default class WindowController extends CustomWebComponent {
  static register() {
    if (customElements.get('window-controller')) return
    customElements.define('window-controller', WindowController)
  }
  static get observedAttributes() {
    return []
  }

  constructor() {
    super({
      components: [
        WindowClose,
        WindowMaximize,
        WindowUnmaximize,
        WindowMinimize,
      ],
      props: {},
      template: `
      <style>
      :host {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .window-controller-item {
        -webkit-app-region: no-drag;
        width: 48px;
        height: 32px;
        padding: 0 8px;
      }
      .window-controller-item:hover,
      .window-controller-item:active {
        background-color: #2f3031;
      }
      </style>
      <window-minimize></window-minimize>
      <window-maximize></window-maximize>
      <window-unmaximize></window-unmaximize>
      <window-close></window-close>
      `,
    })

    this.minimize = this.shadowRoot.childNodes[3]
    this.maximize = this.shadowRoot.childNodes[5]
    this.unmaximize = this.shadowRoot.childNodes[7]
    this.close = this.shadowRoot.childNodes[9]
  }

  mounted() {
    super.mounted()

    let ipcRenderer = require('electron')?.ipcRenderer
    ipcRenderer?.on('maximize', () => {
      this.maximize.style.display = 'none'
      this.unmaximize.style.display = 'block'
    })
    ipcRenderer?.on('unmaximize', () => {
      this.maximize.style.display = 'block'
      this.unmaximize.style.display = 'none'
    })
  }
}
