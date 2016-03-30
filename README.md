# Foundation Docs

[![Build Status](https://travis-ci.org/zurb/foundation-docs.svg?branch=master)](https://travis-ci.org/zurb/foundation-docs)

This is a set of HTML templates and JavaScript utilities shared by the documentation pages for the [Foundation](http://foundation.zurb.com) family of frameworks, including:

- [Foundation for Sites](http://foundation.zurb.com/sites)
- [Foundation for Apps](http://foundation.zurb.com/apps)
- [Foundation for Emails](http://foundation.zurb.com/emails)

## Table of Contents

- [Installation](#installation)
- [JavaScript Usage](#javascript-usage)
- [Sass Usage](#sass-usage)
- [Testing](#testing)

## Installation

This codebase isn't on npm, but this Git repository can be referenced in a `package.json`:

```bash
{
  "dependencies": {
    "foundation-docs": "zurb/foundation-docs"
  }
}
```

## JavaScript Usage

When you `require()` the `foundation-docs` library, you get access to a handful of JavaScript libraries, as well as file paths to HTML templates.

### foundationDocs.handlebars

An instance of a custom Handlebars renderer with all the helpful functions we need to generate documentation.

### foundationDocs.marked

An instance of a custom Marked renderer, which has two custom functions:
- When headings are written, an anchor icon is added to the left of the heading text.
- When code samples are written:
  - If the language is `html_example`, a live rendering of the HTML in the sample is added.
  - If the language is `inky_example`, a live rendering of the HTML in the sample&mdash;within an iframe that loads the Ink CSS&mdash;is added.

### foundationDocs.componentTemplate

A String path to the HTML template used for component pages. The general structure is:

- Title area
- Main docs (converted Markdown)
- Sass reference
- JavaScript reference
- Table of contents

The path is `node_modules/foundation-docs/templates/component.html`.

## Sass Usage

The CSS used for the Foundation documentation is included as a series of Sass partials. Foundation and Motion UI must be loaded manually before it.

```scss
@import 'foundation';
@import 'motion-ui';

@include foundation-everything;
@include motion-ui-transitions;

@import 'foundation-docs';
```

## Testing

There are two kinds of tests in the repository:

- **Unit tests**, which are run with Mocha.
- **Visual tests**, which are full HTML templates with all of the documentation UI elements.

Run `npm test` to run the test suite, as well as a BrowserSync server pointing to the visual tests. You can make changes to the HTML, Sass, or JavaScript of the library and see the changes refresh live. Use this test environment to make changes to the documentation template.

### Testing with Foundation

To test with an actual framework's documentation, you can hook the two folders together using `npm link`.

Let's assume you have `foundation-sites` and `foundation-docs` in the same folder:

```
- sites/
  - foundation-sites/
  - foundation-docs/
```

While inside of the `foundation-sites/` folder, run `npm link ../foundation-docs`. Now Foundation's documentation will reference the changes you're making.
