// 基础变量配置
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({ pattern: '*' });
var reload = plugins.browserSync.reload;
var path = require('path');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var glob = require('glob');
var es = require('event-stream');
var browserify = require('browserify');
var del = require('del');
var through = require('through2');
var gutil = require('gulp-util');
var log = gutil.log;
var colors = gutil.colors;
var fs = require('fs');

var config = {
    path: {
        html: './src/pages/*.html',
        sass: './src/sass/*.scss',
        css: './src/css/*.css',        
        img: './src/img/*.*',
        js: './src/js/*.js'
    },
    dev: {
        html: './dev/html/',
        css: './dev/css/',
        img: './dev/img/',
        // iconfont: './dev/fonts',
        // sprites: './dev/img/',
        js: './dev/js/'
    },
    dist: {
        css: './dist/css/',
        img: './dist/img/',
        html: './dist/html/',
        js: './dist/js/'
    },
    rev: {
        css: './rev/css/',
        img: './rev/img/',
        js: './rev/js/'
    },
    autoprefixerBrowsers: [
        'ie >= 9',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 2.3',
        'bb >= 10'
    ]
};

/*----------  公共函数  ----------*/
function getFilePath(file_type, route) {
    var path;

    if (typeof route == 'string') {
        path = route
    }
    else {
        if (typeof file_type == 'string') {
            switch (file_type) {
                case 'sass':
                    path = config.path.sass
                    break;
                case 'js':
                    path = config.path.js
                    break;
                case 'html':
                    path = config.path.html
                    break;
            }
        }
    }
    return path;
}

/*----------  功能函数  ----------*/

/**
 * [compileSass]
 * @return {[object]}
 */
function compileSass() {
    var args = Array.prototype.slice.call(arguments);
    var path = getFilePath('sass', args[0]);

    return gulp.src(path)
        .pipe(plugins.sourcemaps.init({
            loadMaps: true
        }))
        .pipe(plugins.plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer({ browsers: config.autoprefixerBrowsers }))
        .pipe(plugins.cssnano())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.sourcemaps.write('../../maps/css', { addComment: true }))
        .pipe(gulp.dest(config.dev.css))
        .pipe(reload({ stream: true }))
        .pipe(plugins.notify({
            message: 'css编译压缩完成'
        }));
};
gulp.task('dev-css', compileSass)

/**
 * [compileEs6]
 * @param  {Function} done
 * @return {[object]}  
 */

function compileEs6() {
    var args = Array.prototype.slice.call(arguments);
    var js_path = getFilePath('js', args[0]);

    return glob(js_path, function (err, files) {
        if (err) {
            done(err);
        }
        const tasks = files.map(entry => {
            var file = path.basename(entry);

            return browserify({
                debug: true,
                entries: [entry],
                extension: ['.js']
            })
                .transform(babelify.configure({
                    presets: ['es2015']
                }))
                .bundle()
                .on('error', function (err) {
                    console.log(err);
                })
                .pipe(source(file))
                .pipe(buffer())
                .pipe(plugins.sourcemaps.init({
                    loadMaps: true
                }))
                .pipe(plugins.uglify())
                .on('error', function (err) {
                    log(colors.red('[Error]', err.toString()))
                })
                .pipe(plugins.rename({
                    suffix: '.min'
                }))
                .pipe(plugins.sourcemaps.write('../../maps/js', { addComment: true }))
                .pipe(gulp.dest(config.dev.js))
                .pipe(reload({ stream: true }))
                .pipe(plugins.notify({
                    message: entry +'编译压缩完成'
                }))
        });
    })
};
gulp.task('dev-js', compileEs6);

/**
 * [compileEjs]
 * @return {[object]}
 */
function compileCss() {
    var args = Array.prototype.slice.call(arguments);
    var path = getFilePath('css', args[0]);

    return gulp.src(path)
        .pipe(plugins.sourcemaps.init({
            loadMaps: true
        }))
        .pipe(plugins.plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(plugins.autoprefixer({ browsers: config.autoprefixerBrowsers }))
        .pipe(plugins.cssnano())
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.sourcemaps.write('../../maps/css', { addComment: true }))
        .pipe(gulp.dest(config.dev.css))
        .pipe(reload({ stream: true }))
        .pipe(plugins.notify({
            message: 'css压缩完成'
        }));
}
gulp.task('save-css', compileCss);

/**
 * [compileEjs]
 * @return {[object]}
 */
function compileHtml() {
    var args = Array.prototype.slice.call(arguments);
    var htmlPath = getFilePath('html', args[0]);

    return gulp.src(htmlPath)
        .pipe(plugins.plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest(config.dev.html))
        .pipe(reload({ stream: true }))
        .pipe(plugins.notify({
            message: 'html复制到dev完成'
        }));
}
gulp.task('dev-html', compileHtml);

/**
 * [serve]
 * @return {[object]}
 */
function serve() {
    plugins.browserSync({
        server: {
            baseDir: './'
        },
        port: 8088,
        startPath: config.dev.html
    });
    watchFile();
}
gulp.task('dev-serve', serve);

/**
 * [watchFile]
 *
 */
function watchFile() {
    var watch_sass = gulp.watch(config.path.sass, function () {
        console.log('sass文件变化监听启动');
    });
    var watch_css = gulp.watch(config.path.css, function () {
        console.log('css文件变化监听启动');
    });
    var watch_js = gulp.watch(config.path.js, function () {
        console.log('js文件变化监听启动');
    });
    var watch_html = gulp.watch(config.path.html, function () {
        console.log('html文件变化监听启动');
    });

    // 监听文件内容变化
    watch_sass.on('change', function (e) {
        var file_path = path.resolve(e);
        compileSass(file_path);
    });
    watch_css.on('change', function (e) {
        var file_path = path.resolve(e);
        compileCss(file_path);
    });
    watch_js.on('change', function (e) {
        var file_path = path.resolve(e);
        compileEs6(file_path);
    });
    watch_html.on('change', function (e) {
        var file_path = path.resolve(e);
        compileHtml(file_path);
    });


    // 监听删除文件
    watch_sass.on('unlink', function (route) {
        var base = path.basename(route, '.scss');
        var minFile = './dev/css/' + base + '.min.css';
        plugins.del.sync(minFile);
    });
    watch_js.on('unlink', function (route) {
        var base = path.basename(route);
        var minFile = './dev/js/' + path.basename(route, '.js') + '.min.js';
        plugins.del.sync(minFile);
    });
    
}
gulp.task('dev-watch', watchFile);


/*----------  发布  ----------*/
function revJs() {
    return gulp.src(['./dev/js/*.js'])
        .pipe(plugins.rev())
        .pipe(gulp.dest(config.dist.js))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest(config.rev.js));
}
gulp.task('rev-js', revJs);
function revImg() {
    return gulp.src(['./dev/img/*.*'])
        .pipe(plugins.rev())
        .pipe(gulp.dest(config.dist.img))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest(config.rev.img));
}
gulp.task('rev-img', revImg);
function revCss() {
    return gulp.src(['./dev/css/*.*'])
        .pipe(plugins.rev())
        .pipe(gulp.dest(config.dist.css))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest(config.rev.css));
}

gulp.task('rev-css', revCss);

function replaceHtmlRev() {
    return gulp.src(['./rev/**/*.json', './dev/html/*.html'])
        .pipe(plugins.revCollector({
            replaceReved: true,
            dirReplacements: {
                '../css': './css',
                '../js': './js',
                '../img': 'http://images.mepai.me/web/www/images'
            }
        }))
        .pipe(gulp.dest('./dist/html/'))
        .pipe(reload({ stream: true }))
        .pipe(plugins.notify({
            message: 'html内缓存文件替换成功'
        }))
}
gulp.task('dev-replace-html-rev', replaceHtmlRev);
function replaceCssRev() {
    return gulp.src(['./rev/**/*.json', './dist/css/*.css'])
        .pipe(plugins.revCollector({
            replaceReved: true,
            dirReplacements: {
                '../img': 'https://images.mepai.me/web/img'
            }
        }))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(plugins.notify({
            message: 'css内缓存文件替换成功'
        }))
}
gulp.task('dev-replace-css-rev', replaceCssRev);

function clean(cb) {
    del('dist/**', { force: true });
    cb();
}
gulp.task('clean', clean);

// 开发
gulp.task('build_dev', gulp.series(
    compileEs6,
    compileSass,
    compileHtml,
    serve
));

// 发布
gulp.task('build_dist', gulp.series(
    clean,
    revJs,
    revImg,
    revCss,
    replaceCssRev,
    replaceHtmlRev
));