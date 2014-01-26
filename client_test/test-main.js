var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}
console.log("TESTS", tests);
// tests.push('/base/client_test/DataHelper.js');
console.log("TESTS", tests);
requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/client/js/',

    paths: {

    },

    shim: {

    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});