# River.news

[River.news](http://river.news) is a Javascript *server-less* application which shows how to use the Superfeedr' [feed API](http://documentation.superfeedr.com/subscribers.html) to build a [river of news](http://scripting.com/2014/06/02/whatIsARiverOfNewsAggregator.html) style of reader.

## Use it as a reader

[River.news](http://river.news/) can be used as a single person feed reader.

1. Open a [Superfeedr subscriber account](https://superfeedr.com/subscriber/). You get 10,000 free monthly notifications/stories.
2. [Create an API token](https://superfeedr.com/tokens/new)
3. Copy its value
4. Head to the *settings* panel and enter both your Superfeedr login and token. Hit "Save".
5. Start adding feeds using the *Feeds*
6. Read Stories from the *River* panel.

The browser just keeps your Superfeedr login and token in its localstorage so that you don't have to enter them every time you open river.news.

## Embed it on any page

Since this is a completely static application executed in the browser, river.news can be embedded on any page.
The only required markup is:

```html
<div id="rivernews"></div>

<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.min.js"></script>
<script src="https://river.news/js/river.news.min.js"></script>
```

The first line is the *div* which will hold the river. The other lines are

* jquery (don't add the line if your application already loads it)
* react (don't add this line if your application already loads it)
* the actual `river.news.min.js` file with the *whole* application code

The final step is to add styling.

River.news uses [Bootstrap](http://getbootstrap.com/) by default. You can add load the CSS for bootstrap by addin the following in the `<head>` section of your HTML page.

```html
<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet">
```

However, if you're already using a bootstrap theme or want to [create your own](http://getbootstrap.com/customize/), things should work similarly well!

### Customization

You can also hard-code the settings so that each visitor does not have to create a Superfeedr account.
Use the following data-attributes on the `#content` element:
* `data-superfeedr-login="mylogin"` : always use `mylogin` for thr superfeedr login (you should probably use `data-disable-settings` too)
* `data-superfeedr-token="mytoken"` : always use `mytoken` for thr superfeedr token (you should probably use `data-disable-settings` too)
* `data-disable-settings` : disable the settings tab. The login and token should be hardcoded (see above)
* `data-disable-subscriptions` : disable the subscriptions tab. Visitors won't be able to change the subscription list. (you cqn then use a token which does not have the `subscribe`, `unsubscribe` and `list` rights)

##  ork it

Most importantly, this code is open source and we welcome contributions! Feel free to fork, commit and send pull requests for bug fixes, improvements and more!

We use `npm` to build and [browserify](http://browserify.org/) to package the whole application.

When developing, run `npm run watch` to automatically rebuild the `river.news.min.js` file.

### TODO:

* Dynamic 'load' icon... Bootstrap, do you have this?
* Handle buggy feeds
* Improve urls using fragments: `#settings`, '#subscriptions', '#river'
* OPML import
* Pagination to go fetch 'older' stories
* Improve responsiveness
