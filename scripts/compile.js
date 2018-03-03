const compiler = require('frida-compile')
const tasks = require('./agents.json')

const watch = process.argv.indexOf('watch') > -1
const opt = {
  bytecode: false,
  compress: !watch,
  babelify: true,
}

if (watch)
  tasks.forEach(task => compiler.watch(task.src, task.dest, opt)
    .on('compile', (details) => {
      const count = details.files.length
      const { duration } = details
      console.log(`compiled ${count} file(s) in ${duration} ms`)
    }))
else
  Promise
    .all(tasks.map(task => compiler.build(task.src, task.dest, opt)))
    .catch(err => console.error(err))

