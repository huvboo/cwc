import CwcButtom from './ui/cwc-buttom.js'

let submit = new CwcButtom({
  label: '确定',
  backgroundColor: 'rgb(27,161,226)',
})
submit.addEventListener('click', () => {
  alert('Submit!')
})
document.body.appendChild(submit)

let cancel = new CwcButtom({ label: '取消', backgroundColor: 'rgb(229,20,0)' })
cancel.addEventListener('click', () => {
  alert('Cancel!')
})
document.body.appendChild(cancel)
