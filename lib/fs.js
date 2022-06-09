const fs = require('fs')

const read = (dir) => {
    return JSON.parse(fs.readFileSync(dir, {encoding: 'utf-8', flag: 'r'}))
}

const write = (dir, data) => {
    return fs.writeFileSync(dir, JSON.stringify(data, null, 4))
}

module.exports = {
    read, write
}