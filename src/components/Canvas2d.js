class Canvas2DRenderingContext {
  constructor(root) {
    this.canvas2d = root
  }
}

export default class Canvas2d extends HTMLElement {
  constructor() {
    super()

    console.log(this)
  }

  connectedCallback() {
    console.log('connectedCallback')
    let dataset = this.dataset
    console.log(dataset, dataset.value, dataset.min, dataset.max)
    if (dataset.value) {
      this.value = Number(dataset.value)
    }
    if (dataset.min) {
      this.min = Number(dataset.min)
    }
    if (dataset.max) {
      this.max = Number(dataset.max)
    }
    console.log(this.value, this.min, this.max)
    this.computeOffset()
  }

  disconnectedCallback() {
    console.log('disconnectedCallback')
  }

  adoptedCallback() {
    console.log('adoptedCallback')
  }

  attributeChangedCallback() {
    console.log('attributeChangedCallback')
  }

  getRenderingContext() {
    return new Canvas2DRenderingContext(this)
  }
}
