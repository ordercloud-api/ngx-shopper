/**
 * configuration for lint-staged - a package that lets us
 * perform commands on a glob of files before each commit
 * https://github.com/okonet/lint-staged
 *
 * we use it to auto-format files to enforce consistent formatting
 * settings here affect buyer and seller application
 */
module.exports = {
  /**
   * auto-format  (js/ts/json) files with prettier - https://github.com/prettier/prettier
   * configure options with './prettier.config.js';
   * ignore files with './prettierignore'
   *
   */
  '*.{js,ts,json}': ['pretty-quick --staged'],

  /**
   * auto-format html files with js-beautify - https://github.com/beautify-web/js-beautify
   * configure options with ./.jsbeautifyrc
   * if prettier could format html we'd use that
   */
  '*.html': ['js-beautify --replace --config ./.jsbeautifyrc', 'git add'],
};
