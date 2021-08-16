export default function useTemplate(template) {
  let oTemplate = document.createElement('template')
  oTemplate.innerHTML = template
  let cloneContent = oTemplate.content.cloneNode(true)

  let shadowRoot = this.attachShadow({ mode: 'open' })
  shadowRoot.appendChild(cloneContent)
}
