import '../styles/index.scss'
import { downloadText, getJSON, parsePPK, getPeopleNames, show, hide } from "./helpers"
import { json2xml } from "./json2xml"

let parsedJSON
let filename

const loadButton = document.getElementById("loadButton")
const saveButton = document.getElementById("saveButton")
const dropzone = document.getElementById("dropzone")
const filepicker = document.getElementById("filepicker")

const processPPK = (content) => {
  const json = getJSON(content)
  parsedJSON = parsePPK(json)
  const names = getPeopleNames(json)

  const xmlContainer = document.querySelector("#xml pre")
  xmlContainer.textContent = JSON.stringify(parsedJSON, null, 2)

  const namesContainer = document.querySelector("#names ol")
  namesContainer.innerHTML = names.map(name => `<li>${name}</li>`).join("")

  show(saveButton)

  document.querySelectorAll("section").forEach(section => section.classList.add("visible"))
}

const readFile = (file) => {
  const reader = new FileReader()

  filename = file.name

  reader.onload = (event) => {
    const content = event.target.result
    processPPK(content)
  }
  reader.readAsText(file)
}

dropzone.ondragover = (event) => {
  event.preventDefault()
  dropzone.classList.add("dragover")
  hide(loadButton)
}

dropzone.ondrop = (event) => {
  event.preventDefault()
  dropzone.classList.remove("dragover")

  let file = ""

  if (event.dataTransfer.files) {
    file = event.dataTransfer.files[0]
  }

  readFile(file)
}

loadButton.addEventListener("click", () => {
  filepicker.click()
})

filepicker.addEventListener("change", (event) => {
  readFile(filepicker.files[0])
  loadButton.classList.add("hidden")
})

saveButton.addEventListener("click", () => {
  const content = [
    '<?xml version="1.0" encoding="utf-8"?>',
    json2xml(parsedJSON, "  ")
  ].join("\n")

  downloadText(content, filename.replace(".xml", ".ppk").replace(".ppk", ".fixed.ppk"))
})
