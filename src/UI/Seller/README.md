![Travis (.org) branch](https://img.shields.io/travis/ordercloud-api/ngx-shopper/master.svg?style=flat-square)
![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

### Building the Seller (Admin) App

1.  If you have not before, install the [Angular CLI](https://github.com/angular/angular-cli/wiki) globally on your machine with `npm install -g @angular/cli`

2.  Navigate to the Seller Directory with `cd src/UI/Seller`

3.  Install dependencies with `npm install`

4.  Enter your seller organization's `clientID` in [environment.ts](src/UI/Seller/src/environments/environment.ts) (src/UI/Seller/src/environments/environment.ts)

5.  Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Other Useful Commands

- Run `ng test --sourceMap="false"` from the root of the buyer or seller app to run unit tests.

- Run `ng build` from the root of the buyer or seller app to compile the project without serving.

- Run `ng generate component component-name` from any directory to generate code scafolding for a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

Be sure to check out the [Angular CLI docs](https://github.com/angular/angular-cli) for a full list of commands

### Auto-formatter

We use a tool to auto-format code before each commit, which lets us enforce consistency in formatting. Check out the [configuration file](./../lint-staged.config.js) for more info on which files are formatted and formatting options.

If you use vscode we recommend installing the vscode extensions for [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify), and [tslint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint) so that you can enable the same auto-formatting _on save_ instead of _on commit_.

If you want to turn this feature off completely please refer to [this commit](https://github.com/ordercloud-api/ngx-shopper/commit/af05cccbddb34e9457c04ba225cf68c074b9c5d3) (which introduces auto-formatting) for insight on what to undo.

### Contributing

We welcomes all contributions from anyone willing to work in good faith with other contributors and the community. No contribution is too small and all contributions are valued.

Writing code may be the first thing that comes to mind when you think of contributing but there are so many different ways you can contribute even if you can't write a single line of code! Here are just a few:

- create an issue for bugs you find
- create an issue for possible enhancements
- write documentation
- improve current documentation

Issues are the primary means by which bug reports and general discussion are made. Please be sure to open an issue before you write any code with a detailed description of your problem or proposed enhancement. We may already be on our way to delivering what you want!

After you've opened an issue, received the green light to start coding, and have some code you'd like to contribute then you're ready to submit a pull request. We follow the "fork-and-pull" Git workflow.

1.  **Fork** the repo on GitHub
2.  **Clone** the project to your own machine
3.  **Commit** changes to your own branch
4.  **Push** your work back up to your fork
5.  Submit a **Pull request** so that we can review your changes

Happy contributing!

### Getting Help

If you need any assistance getting set up please create a detailed github issue of what you are having trouble with and what you've tried to fix it.
