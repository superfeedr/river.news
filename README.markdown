# Reader News

ReaderNews is a Javascript *server-less* application which shows how to use the Superfeedr [Retrieve API](http://documentation.superfeedr.com/subscribers.html#retrieving-entries-with-pubsubhubbub) to build a very basic feed reader.

It uses [Reactjs](https://facebook.github.io/react/) for its code, and [Bootstrap](http://getbootstrap.com/) for its layout.

Prior to everything we created a Superfeedr subscriber account with the login *readersnews* and created a token with the *retrieve* right associated to it.

We then selected a bunch of feeds needed by our reader and subscribed to them using the [subscribe API](http://documentation.superfeedr.com/subscribers.html#adding-feeds-with-pubsubhubbub) or the Superfeedr Console, and we [retrieve and subscribe to the feed using Superfeedr's EventSource endpoint](http://blog.superfeedr.com/react-server-sent-events/) for a more *realtime* approach.

## Building

If you change the `src/*.jsx` files, run `jsx src/ js/`!



