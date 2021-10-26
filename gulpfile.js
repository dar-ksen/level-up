let projectFolder = "build";
let sourceFolder = "#src";

const fs = require("fs");

const path = {
  build: {
    html: projectFolder + "/",
    css: projectFolder + "/css/",
    js: projectFolder + "/js/",
    img: projectFolder + "/img/",
    fonts: projectFolder + "/fonts/",
    video: projectFolder + "/video/",
  },
  src: {
    html: sourceFolder + "/*.html",
    css: sourceFolder + "/scss/style.scss",
    js: {
      vendor: sourceFolder + "/js/vendor/**/*.js",
      modules: sourceFolder + "/js/modules/**/*.js",
    },
    img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: sourceFolder + "/fonts/*.ttf",
    video: sourceFolder + "/video//**/*.*",
  },
  watch: {
    html: sourceFolder + "/**/*.html",
    css: sourceFolder + "/scss/**/*.scss",
    jsVendor: sourceFolder + "/js/vendor/**/*.js",
    jsModules: sourceFolder + "/js/modules/**/*.js",
    img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
  },
  clean: "./" + projectFolder + "/",
};

const { src, dest } = require("gulp");
const gulp = require("gulp");
const concat = require("gulp-concat");
const plumber = require("gulp-plumber");
const browsersync = require("browser-sync").create();
const fileInclude = require("gulp-file-include");
const del = require("del");
const scss = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const groupMedia = require("gulp-group-css-media-queries");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const webpHtml = require("gulp-webp-html");
const svgSprite = require("gulp-svg-sprite");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const fonter = require("gulp-fonter");
const lazyScr = require("gulp-lazysizes-srcset");

gulp.task("clean", () => del(path.clean));

function html() {
  return src(path.src.html)
    .pipe(fileInclude())
    .pipe(
      lazyScr({
        decodeEntities: false,
        data_src: "data-src",
        data_srcset: "data-srcset",
        suffix: {
          "1x": "@1x",
          "2x": "@2x",
          "3x": "@3x",
        },
      })
    )
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return (
    src(path.src.css)
      .pipe(plumber())
      .pipe(
        scss({
          outputStyle: "expanded",
        })
      )
      .pipe(groupMedia())
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 5 versions"],
          cascade: true,
        })
      )
      //.pipe(webpcss({}))
      .pipe(dest(path.build.css))
      .pipe(cleanCss())
      .pipe(
        rename({
          extname: ".min.css",
        })
      )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
  );
}

gulp.task("video", function () {
  return src(path.src.video).pipe(gulp.dest(path.build.video));
});

gulp.task("scripts", function () {
  return src(path.src.js.modules)
    .pipe(plumber())
    .pipe(concat("main.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("build/js"));
});

gulp.task("scripts:vendor", function () {
  return src(path.src.js.vendor)
    .pipe(plumber())
    .pipe(concat("vendor.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("build/js"));
});

gulp.task("images", () =>
  src(path.src.img)
    .pipe(
      webp({
        quality: 70,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [
          {
            removeViewBox: false,
          },
        ],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
);

function images() {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [
          {
            removeViewBox: false,
          },
        ],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function fonts() {
  src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
  return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
}

gulp.task("otf2ttf", function () {
  return gulp
    .src([sourceFolder + "/fonts/*.otf"])
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
    .pipe(dest(sourceFolder + "/fonts/"));
});

function fontsStyle() {
  function cb() {}

  let file_content = fs.readFileSync(sourceFolder + "/scss/base/fonts.scss");
  if (file_content == "") {
    fs.writeFile(sourceFolder + "/scss//base/fonts.scss", "", cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split(".");
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(
              sourceFolder + "/scss/base/fonts.scss",
              '@include font("' +
                fontname +
                '", "' +
                fontname +
                '", "400", "normal");\r\n',
              cb
            );
          }
          c_fontname = fontname;
        }
      }
    });
  }
}

gulp.task("getFontsScss", (done) => {
  fontsStyle();
  done();
});

gulp.task("svgSprite", () => {
  return gulp
    .src([sourceFolder + "/iconsprite/*.svg"])
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../icons/icons.svg",
            example: true,
          },
        },
      })
    )
    .pipe(dest(path.build.img));
});

gulp.task("serve", () => {
  browsersync.init({
    server: {
      baseDir: "./" + projectFolder + "/",
    },
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch([path.watch.html], gulp.series(html));
  gulp.watch([path.watch.css], gulp.series(css));
  gulp.watch([path.watch.jsModules], gulp.series("scripts"));
  gulp.watch([path.watch.jsVendor], gulp.series("scripts:vendor"));
  gulp.watch([path.watch.img], gulp.series(images));
});

gulp.task(
  "build",
  gulp.series(
    "clean",
    gulp.parallel(
      "scripts",
      "scripts:vendor",
      css,
      html,
      "video",
      "images",
      fonts,
      "svgSprite"
    )
  )
);
