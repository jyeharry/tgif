const fs = require('fs')
const path = require('path')

const dryRun = process.argv.includes('--dry-run')

const createFileIfNotExists = (path, placeholder) => {
  try {
    fs.accessSync(path)
  } catch {
    fs.writeFileSync(path, placeholder)
  }
}

const choose = () => {
  const optionsPath = path.join(__dirname, 'options.json')
  createFileIfNotExists(optionsPath, JSON.stringify([]))
  const options = JSON.parse(fs.readFileSync(optionsPath, 'utf-8'))

  if (!options.length) {
    console.log('No options to choose from')
    process.exit(0)
  }

  const randomIndex = Math.floor(Math.random() * options.length)
  const choice = options.splice(randomIndex, 1)[0]
  const filteredOptions = options.filter(option => option !== choice)

  console.log(choice)

  if (!dryRun) {
    fs.writeFileSync(optionsPath, JSON.stringify(filteredOptions, null, 2))
  }

  return choice
}


const updatePastChoices = (choice) => {
  const pastChoicesPath = path.join(__dirname, 'pastChoices.json')
  createFileIfNotExists(pastChoicesPath, JSON.stringify([]))
  const pastChoices = JSON.parse(fs.readFileSync(pastChoicesPath, 'utf-8'))

  pastChoices.unshift(choice)

  if (!dryRun) {
    fs.writeFileSync(pastChoicesPath, JSON.stringify(pastChoices, null, 2))
  }
}

const choice = choose()
updatePastChoices(choice)
