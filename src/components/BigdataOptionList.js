import CustomWebComponent from '../CustomWebComponent.js'
let dataMap = new Map()
export default class BigdataOptionList extends CustomWebComponent {
  static register() {
    customElements.define('bigdata-option-list', BigdataOptionList)
  }
  static get observedAttributes() {
    return ['maxH', 'value', 'get-data']
  }

  constructor() {
    super({
      props: {
        /**
         * 最大高度
         */
        maxH: {
          type: Number,
          default: 240,
        },
        /**
         * 初始默认值
         */
        value: {
          type: [Number, String],
          default: null,
        },
        /**
         * 获取选项列表的方法
         */
        'get-data': {
          type: Function,
          default: () => {
            return []
          },
          required: true,
        },
      },
      template: `
      <style>
      /* 滚动条 */
        ::-webkit-scrollbar-thumb:horizontal {
          /*水平滚动条的样式*/
          width: 20px;
          background-color: #fbfbfb;
          border-radius: 8px;
          border: 2px solid #ecebeb;
        }
  
        ::-webkit-scrollbar-track-piece {
          background-color: #ecebeb; /*滚动条的背景颜色*/
        }
  
        ::-webkit-scrollbar {
          width: 12px; /*滚动条的宽度*/
          height: 8px; /*滚动条的高度*/
        }
  
        ::-webkit-scrollbar-thumb:vertical {
          /*垂直滚动条的样式*/
          width: 20px;
          background-color: #fbfbfb;
          border-radius: 8px;
          border: 2px solid #ecebeb;
        }
  
        ::-webkit-scrollbar-thumb:hover {
          /*滚动条的hover样式*/
          background-color: var(--press-gray);
        }
  
        ::-webkit-scrollbar-button {
          /*纵方向按钮的高度，宽度由scrollbar定义*/
          height: 0;
          /*横方向按钮的高度，高度由scrollbar定义*/
          width: 0;
        }
      .bigdata-option-list {
        max-height: 240px;
        border-top: 0;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        background: #fff;
        overflow: auto;
        user-select: none;
      }
      .bigdata-option-filter {
        width: 100%;
        height: 0;
        position: relative;
      }
      .bigdata-option-chunk {
        width: 100%;
        max-height: 1200px;
        position: absolute;
        top: 0;
        left: 0;
      }
      </style>
  
      <div class="bigdata-option-list">
        <p style="font-size: 12px; line-height: 24px; text-align: center;">
          -- 暂无选项 --
        </p>
        <div class="bigdata-option-filter">
          <div class="bigdata-option-chunk"></div>
        </div>
      </div>
      `,
    })

    this.uuid = Date.now() + Math.round(Math.random * 1e6)
    this.num = 24
    this.total = 0
    this.list = []
    this.chunkTop = 0

    dataMap.set(this.uuid, { data: [], filterOptions: [] })

    this.root = this.shadowRoot.childNodes[3]
    this.tip = this.root.childNodes[1]
    this.filter = this.root.childNodes[3]
    this.chunk = this.filter.childNodes[1]

    this.vlist = new Array(this.num)
    for (let i = 0; i < this.num; ++i) {
      this.vlist[i] = document.createElement('option-item')
    }
  }

  mounted() {
    super.mounted()

    this.root.style.maxHeight = this.maxH + 'px'

    this.chunk.addEventListener('select', this.handleSelect.bind(this))

    this.root.addEventListener('scroll', this.handleScroll.bind(this))

    this.updateData()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue)

    if (name === 'get-data') {
      this.updateData()
    }
  }

  updateData() {
    let result = this['get-data']()
    console.log(this['get-data'], result)
    if (!result) {
      return false
    } else if (Array.isArray(result)) {
      this.setData(result)
      return true
    } else if (result.constructor.name == 'Promise') {
      return new Promise((resolve, reject) => {
        result
          .then((data) => {
            if (Array.isArray(data)) {
              this.setData(data)
              resolve()
            } else {
              reject(new Error('Error: getData 方法返回值不是数组！'))
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }

  getOption(value) {
    return dataMap.get(this.uuid).data.find((item) => item.value === value)
  }

  handleScroll() {
    let scrollTop = this.root.scrollTop
    let index = Math.floor(scrollTop / 24)
    if (index > this.num / 2) {
      let start = this.num / 3 + index - this.num / 2
      this.list = this.getList(start, start + this.num)
      this.chunkTop = start * 24
    } else {
      this.chunkTop = 0
      this.list = this.getList(0, this.num)
    }

    this._updateRendering()
  }

  handleSelect(e) {
    console.log(e)
    this.value = e.path[0].getAttribute('value')
    this.dispatchEvent(new CustomEvent('select', { detail: this.value }))
  }

  handleQuery(text) {
    this.updateOptions(text)
    this.resetRender()
  }

  updateOptions(text) {
    dataMap.get(this.uuid).filterOptions = dataMap
      .get(this.uuid)
      .data.filter(
        (item) =>
          item.label.toLocaleLowerCase().indexOf(text.toLocaleLowerCase()) > -1
      )
  }

  setData(data) {
    console.log(data)
    dataMap.get(this.uuid).data = data
    this.resetOptions()
  }

  resetOptions() {
    this.initOptions()
    this.resetRender()
  }

  initOptions() {
    dataMap.get(this.uuid).filterOptions = dataMap.get(this.uuid).data.slice(0)
  }

  resetRender() {
    this.total = this.getTotal()
    this.chunkTop = 0
    this.list = this.getList(0, this.num)
    this.root.scrollTo(0, 0)
  }

  getTotal() {
    return dataMap.get(this.uuid).filterOptions.length
  }

  getList(start, end) {
    return dataMap.get(this.uuid).filterOptions.slice(start, end)
  }

  _updateRendering() {
    super._updateRendering()

    this.chunk.style.top = `${this.chunkTop}px`
    this.filter.style.height = `${this.total * 24}px`
    if (this.total === 0) {
      this.tip.style.display = 'block'
      this.chunk.replaceChildren()
    } else {
      this.tip.style.display = 'none'
      let list = []
      let optionItem
      this.list.forEach((item, index) => {
        optionItem = this.vlist[index]
        optionItem.value = item.value
        optionItem.label = item.label
        optionItem.disabled = !!item.disabled
        optionItem.selected = item.value == this.value
        list.push(optionItem)
      })
      this.chunk.replaceChildren(...list)
    }
  }
}
