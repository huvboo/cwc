// 防抖动
// 示例：
// var cb = args => {
//     for(let entry of args[0]) {
//         console.log(entry)
//     }
// };
// var debounce = new Debounce(cb, 300);
// var o = new ResizeObserver(entries => debounce.exec(entries));
// o.observe(document.querySelector("#dom1"));
// o.observe(document.querySelector("#dom2"));
export default class Debounce {
  constructor(func, timeout = 300) {
    this.func = func
    this.timeout = timeout
    this.args = []
    this.lastTime = null
    this.isStart = false
  }
  exec() {
    this.args = [...arguments]
    this.lastTime = Date.now()
    if (!this.isStart) {
      this.isStart = true
      this.animate()
    }
  }
  animate() {
    if (Date.now() - this.lastTime > this.timeout) {
      this.isStart = false
      this.func && this.func(this.args)
    }
    if (this.isStart) {
      requestAnimationFrame(this.animate.bind(this))
    }
  }
}
