import gulp from 'gulp';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import del from 'del';
import bump from 'gulp-bump';
import util from 'gulp-util';
import tag from 'gulp-tag-version';
import { argv as args } from 'yargs';

function errorHandler(err) {
  util.log(err.toString());
  this.emit('end');
}

gulp.task('lint', () => {
  const stream = gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
  return stream;
});

gulp.task('clean', done => del([
  'es5',
  'tmp',
  'dist',
  'coverage',
  'test.tap'
], done));

gulp.task('build', ['clean', 'lint'], () => {
  const stream = gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./dist'))
    .on('error', errorHandler);
  return stream;
});

gulp.task('bump', () => {
  if (!args.type && !args.version) {
    args.type = 'patch';
  }

  const stream = gulp.src('./package.json')
    .pipe(bump({
      preid: 'beta',
      type: args.type,
      version: args.version
    }))
    .pipe(gulp.dest(`${__dirname}/`))
    .pipe(tag())
    .on('error', errorHandler);
  return stream;
});

gulp.task('default', ['build']);
