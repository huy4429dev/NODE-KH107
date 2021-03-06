let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js/app.js').sass('resources/scss/app.scss', 'public/css/app.css');
mix.js('resources/js/admin/dashboard.js', 'public/admin/js/dashboard.js').sass('resources/scss/admin/dashboard.scss', 'public/admin/css/dashboard.css');
mix.js('resources/js/admin/category.js', 'public/admin/js/category.js').sass('resources/scss/admin/category.scss', 'public/admin/css/category.css');
mix.js('resources/js/admin/post.js', 'public/admin/js/post.js').sass('resources/scss/admin/post.scss', 'public/admin/css/post.css');
mix.js('resources/js/admin/account.js', 'public/admin/js/account.js').sass('resources/scss/admin/account.scss', 'public/admin/css/account.css');
mix.js('resources/js/admin/profile.js', 'public/admin/js/profile.js').sass('resources/scss/admin/profile.scss', 'public/admin/css/profile.css');
mix.js('resources/js/home.js', 'public/js/home.js').sass('resources/scss/home.scss', 'public/css/home.css');
mix.js('resources/js/search.js', 'public/js/search.js').sass('resources/scss/search.scss', 'public/css/search.css');
mix.js('resources/js/postDetail.js', 'public/js/postDetail.js').sass('resources/scss/postDetail.scss', 'public/css/postDetail.css');

// Full API
// mix.js(src, output);
// mix.react(src, output); <-- Identical to mix.js(), but registers React Babel compilation.
// mix.preact(src, output); <-- Identical to mix.js(), but registers Preact compilation.
// mix.coffee(src, output); <-- Identical to mix.js(), but registers CoffeeScript compilation.
// mix.ts(src, output); <-- TypeScript support. Requires tsconfig.json to exist in the same folder as webpack.mix.js
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.less(src, output);
// mix.stylus(src, output);
// mix.postCss(src, output, [require('postcss-some-plugin')()]);
// mix.browserSync('my-site.test');
// mix.combine(files, destination);
// mix.babel(files, destination); <-- Identical to mix.combine(), but also includes Babel compilation.
// mix.copy(from, to);
// mix.copyDirectory(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.setPublicPath('path/to/public');
// mix.setResourceRoot('prefix/for/resource/locators');
// mix.autoload({}); <-- Will be passed to Webpack's ProvidePlugin.
// mix.webpackConfig({}); <-- Override webpack.config.js, without editing the file directly.
// mix.babelConfig({}); <-- Merge extra Babel configuration (plugins, etc.) with Mix's default.
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
// mix.when(condition, function (mix) {}) <-- Call function if condition is true.
// mix.override(function (webpackConfig) {}) <-- Will be triggered once the webpack config object has been fully generated by Mix.
// mix.dump(); <-- Dump the generated webpack config object to the console.
// mix.extend(name, handler) <-- Extend Mix's API with your own components.
// mix.options({
//   extractVueStyles: false, // Extract .vue component styling to file, rather than inline.
//   globalVueStyles: file, // Variables file to be imported in every component.
//   processCssUrls: true, // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
//   purifyCss: false, // Remove unused CSS selectors.
//   terser: {}, // Terser-specific options. https://github.com/webpack-contrib/terser-webpack-plugin#options
//   postCss: [] // Post-CSS options: https://github.com/postcss/postcss/blob/master/docs/plugins.md
// });
