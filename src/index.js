let t1 = document.createElement('h3')
t1.textContent = 'Button'
document.body.appendChild(t1)

import Button from './ui/Button.js'

let submit = new Button({
  label: '确定',
  backgroundColor: 'rgb(27,161,226)',
})
submit.addEventListener('click', () => {
  alert('Submit!')
})
document.body.appendChild(submit)

let cancel = new Button({ label: '取消', backgroundColor: 'rgb(229,20,0)' })
// cancel.addEventListener('click', () => {
//   alert('Cancel!')
// })
cancel.addEventListener('focus', (e) => {
  console.log(e)
})
document.body.appendChild(cancel)

let t2 = document.createElement('h3')
t2.textContent = 'TextBox'
document.body.appendChild(t2)

import TextBox from './ui/TextBox.js'

let textBox = new TextBox({
  placeholder: 'input',
  value: '北京',
})
// textBox.setAttribute('disabled', true)
console.log(textBox)
document.body.appendChild(textBox)
