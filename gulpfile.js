const { series,src, dest } = require('gulp');
const execSync = require('child_process').execSync; 

function defaultTask(cb) {
    return src('src/**/*.js').pipe(dest('dist/'));
  }


  function build(cb) {
    // Copiar Archivos a Dist
    return src('src/**/*.js')
        .pipe(dest('dist/'))
  }

  function comprimirArchivos(cb){
      // Comprimir archivos 
      execSync('zip release_proyecto_201504100.zip dist');
      return src('release_proyecto_201504100.zip')
        .pipe(dest('dist/')) 
  }
  
exports.default = defaultTask;
exports.default = series(build, comprimirArchivos);
