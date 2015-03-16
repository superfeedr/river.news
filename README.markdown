# Reader News

ReaderNews is a Javascript *server-less* application which shows how to use the Superfeedr [Retrieve API](http://documentation.superfeedr.com/subscribers.html#retrieving-entries-with-pubsubhubbub) to build a very basic feed reader.

It uses [Reactjs](https://facebook.github.io/react/) for its code, and [Bootstrap](http://getbootstrap.com/) for its layout.

The whole code of the application is in `/src/readernews.jsx`, but here's commented version of it.

Prior to everything we created a Superfeedr subscriber account with the login *readersnews* and created a token with the *retrieve* right associated to it.

We then selected a bunch of feeds needed by our reader and subscribed to them using the [subscribe API](http://documentation.superfeedr.com/subscribers.html#adding-feeds-with-pubsubhubbub) or the Superfeedr Console.

## Code

We initialize the [Superfeedr Jquery plugin](http://plugins.jquery.com/superfeedr/) with the right username and the appropriate token.

```javascript
$.superfeedr.options.login = 'readersnews';
$.superfeedr.options.key = '310e761b2fe7004024ba2c73a2d56ac1';
```

We're now initializing React by rendering a `<ReaderBox />` component which will be placed inside the document's `content` element.

```javascript
React.render(
  <ReaderBox />,
  document.getElementById('content')
);
```

The `ReaderBox` contains most of our application. It also performs the call to Superfeedr's API.

```javascript
var ReaderBox = React.createClass({
  getInitialState: function() {
    return {data: []}; // initialized with empty data
  },
  componentDidMount: function() {
    var feed = new $.superfeedr.Endpoint('https://push.superfeedr.com/dev/null'); // Gets all entry sent to this endpoint.
    var that = this;
    feed.setNumEntries(10); // We retrieve 10 entries by default
    feed.setResultFormat('json'); // And we want the results to be in JSON.
    feed.load(function(result) {
      if (result.error) {
        console.error(result.error);
        return ;
      }
      that.setState({data: result.feed.items}); // When we get data, we refresh the state.
    });
  },
  render: function() {
    // For each story retrieved, we render it as a NewsBit
    var newsNodes = this.state.data.map(function (story) {
      return (
        <NewsBit key={story.id} story={story}>
        </NewsBit>
      );
    });
    // And we then render the whole layout.
    return (
      <div className="panel panel-default">

        <div className="list-group">
          {newsNodes}
        </div>

        <div className="panel-footer">Made by <a href="https://superfeedr.com">Superfeedr</a>, with <a href="https://push.superfeedr.com">Superfeedr</a>.</div>
      </div>
    );
  }
});
```

```javascript
var NewsBit = React.createClass({
  render: function() {
    var source = {
      title: "",
      url: "",
      icon: ""
    };
    if(this.props.story.source) {
      source.title = this.props.story.source.title;      
      source.icon = "http://www.google.com/s2/favicons?domain=" + encodeURIComponent(this.props.story.source.permalinkUrl);
      source.url = this.props.story.source.permalinkUrl;
    }
    var published = jQuery.timeago(new Date(this.props.story.published * 1000));
    return (
    <a href={this.props.story.permalinkUrl} className="list-group-item">
      <h4 className="list-group-item-heading">{this.props.story.title}</h4>
      <span className="source"><img src={source.icon} />{source.title}, published {published}</span>
    </a>
    );
  }
});

```



