import CustomWebComponent from '../CustomWebComponent.js'

export default class PanelSplit extends CustomWebComponent {
  static get observedAttributes() {
    return ['mode', 'set', 'value', 'min', 'max']
  }

  constructor() {
    super({
      mode: {
        type: String,
        default: 'horizontal',
      },
      set: {
        type: String,
        default: 'left',
      },
      value: {
        type: Number,
        default: 0.5,
      },
      min: {
        type: Number,
        default: 40,
      },
      max: {
        type: Number,
        default: 0.95,
      },
    })

    this.minOffset = 0
    this.maxOffset = 0
    this.offset = 0
    this.oldOffset = 0
    this.isMoving = false

    this.style.flexDirection = this.direction

    let template = document.createElement('template')
    template.innerHTML = `
      <style>
      :host {
        width: 100%;
        height: 100%;
        display: flex;
        user-select: none;
      }
      .panel-resizable-flex {
        flex: 1;
        overflow: hidden;
      }
      .panel-resizable-flex.horizontal {
        height: 100%;
      }
      .panel-resizable-flex.vertical {
        width: 100%;
      }
      .panel-separator {
        background-color: #dfdfdf;
        user-select: none;
        position: relative;
      }
      .panel-separator.horizontal {
        width: 0;
        height: 100%;
      }
      .panel-separator.vertical {
        height: 0;
        width: 100%;
      }
      .panel-separator-handle {
        background-color: rgba(0, 0, 0, 0.01);
        position: absolute;
      }
      .horizontal .panel-separator-handle {
        width: 11px;
        height: 100%;
        cursor: ew-resize;
        top: 0;
        left: -6px;
      }
      .vertical .panel-separator-handle {
        height: 11px;
        width: 100%;
        cursor: ns-resize;
        top: -6px;
        left: 0;
      }
      </style>
  
      <div><slot></slot></div>
      <div part="separator" class="panel-separator">
        <div part="separator-handle" class="panel-separator-handle"></div>
      </div>
      <div><slot></slot></div>
      `

    const shadowRoot = this.attachShadow({ mode: 'open' })
    let cloneContent = template.content.cloneNode(true)
    shadowRoot.appendChild(cloneContent)

    if (this.mode === 'horizontal') {
      shadowRoot.childNodes[3].className = 'left-panel'
      shadowRoot.childNodes[3].childNodes[0].name = 'left'
      shadowRoot.childNodes[7].className = 'right-panel'
      shadowRoot.childNodes[7].childNodes[0].name = 'right'
      if (this.set === 'left') {
        this.setPanel = shadowRoot.childNodes[3]
        shadowRoot.childNodes[7].classList.add('panel-resizable-flex')
        shadowRoot.childNodes[7].classList.add('horizontal')
      } else if (this.set === 'right') {
        this.setPanel = shadowRoot.childNodes[7]
        shadowRoot.childNodes[3].classList.add('panel-resizable-flex')
        shadowRoot.childNodes[3].classList.add('horizontal')
      }
    } else if (this.mode === 'vertical') {
      shadowRoot.childNodes[3].className = 'top-panel'
      shadowRoot.childNodes[3].childNodes[0].name = 'top'
      shadowRoot.childNodes[7].className = 'bottom-panel'
      shadowRoot.childNodes[7].childNodes[0].name = 'bottom'
      if (this.set === 'top') {
        this.setPanel = shadowRoot.childNodes[3]
        shadowRoot.childNodes[7].classList.add('panel-resizable-flex')
        shadowRoot.childNodes[7].classList.add('vertical')
      } else if (this.set === 'bottom') {
        this.setPanel = shadowRoot.childNodes[7]
        shadowRoot.childNodes[3].classList.add('panel-resizable-flex')
        shadowRoot.childNodes[3].classList.add('vertical')
      }
    }

    this.separator = shadowRoot.childNodes[5]
    if (this.isHorizontal) {
      this.separator.classList.add('horizontal')
    } else {
      this.separator.classList.add('vertical')
    }
    this.separator.addEventListener(
      'mousedown',
      this.handleMousedown.bind(this)
    )
  }

  get isHorizontal() {
    return this.mode === 'horizontal'
  }

  get direction() {
    return this.isHorizontal ? 'row' : 'column'
  }

  get isSetlatter() {
    return this.isHorizontal ? this.set === 'right' : this.set === 'bottom'
  }

  _updateRendering() {
    super._updateRendering()

    this.computeOffset()
    this.render()
  }

  computeOffset() {
    let boxSize = this.isHorizontal
      ? this.parentNode.clientWidth
      : this.parentNode.clientHeight
    this.minOffset = this.min > 1 ? this.min : this.min * boxSize
    this.maxOffset = this.max > 1 ? this.max : this.max * boxSize
    let value = this.value > 1 ? this.value : this.value * boxSize
    this.offset = Math.max(this.minOffset, Math.min(this.maxOffset, value))
    console.log(this.offset)
  }

  render() {
    if (this.isHorizontal) {
      this.setPanel.style.width = this.format(this.offset)
      this.setPanel.style.minWidth = this.format(
        Math.max(this.min, this.offset)
      )
      this.setPanel.style.maxWidth = this.format(this.max)
    } else {
      this.setPanel.style.height = this.format(this.offset)
      this.setPanel.style.minHeight = this.format(
        Math.max(this.min, this.offset)
      )
      this.setPanel.style.maxHeight = this.format(this.max)
    }
  }

  format(val) {
    return val > 1 ? val + 'px' : val * 100 + '%'
  }

  handleEvent(e) {
    switch (e.type) {
      case 'mousemove':
        this.handleMousemove(e)
        break
      case 'mouseup':
        this.handleMouseup(e)
        break
    }
  }

  handleMousedown(e) {
    this.oldOffset = this.isHorizontal ? e.pageX : e.pageY
    console.log('oldOffsett', this.oldOffset)
    this.isMoving = true
    document.addEventListener('mousemove', this, false)
    document.addEventListener('mouseup', this, false)
  }

  handleMousemove(e) {
    console.log('mousemove')
    if (this.isMoving) {
      let pageOffset = this.isHorizontal ? e.pageX : e.pageY
      let offset = this.isSetlatter
        ? this.oldOffset - pageOffset
        : pageOffset - this.oldOffset
      this.oldOffset = pageOffset
      this.value = this.offset + offset
    }
  }

  handleMouseup(e) {
    console.log('mouseup')
    this.isMoving = false
    document.removeEventListener('mousemove', this)
    document.removeEventListener('mouseup', this)
  }
}
