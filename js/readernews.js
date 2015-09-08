function serialize(object, prefix) {
  var q = [];
  for(var k in object) {
    if (object.hasOwnProperty(k)) {
      var k = prefix ? prefix + "[" + k + "]" : k, v = object[k];
      q.push(typeof v == "object" ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return q.join("&");
}


var ReaderBox = React.createClass({displayName: "ReaderBox",
  getInitialState: function() {
    return {
      stories: [],
      login: 'readersnews',
      token: '310e761b2fe7004024ba2c73a2d56ac1'
    };
  },

  loadContent: function loadContent() {
    var that = this;

    var url = "https://stream.superfeedr.com/";
    var query = {
      'count': 5,
      'hub.mode': 'retrieve',
      'authorization': btoa([this.state.login, this.state.token].join(':')),
      'hub.callback': 'https://push.superfeedr.com/dev/null'
    };

    url = [url, serialize(query)].join('?');
    var source = new EventSource(url);

    source.addEventListener("notification", function(e) {
      var notification = JSON.parse(e.data);
      notification.items.sort(function(x, y) {
        return x.published - y.published;
      });
      notification.items.forEach(function(item) {
        if(!item.source)
          item.source = {
            title: notification.title,
            permalinkUrl: notification.permalinkUrl
          }
          that.state.stories.unshift(item);
          that.setState({
            stories: that.state.stories
          });
        });
    });
  },


  componentDidMount: function() {
    this.loadContent();
  },
  
  render: function() {
    var newsNodes = this.state.stories.map(function (story) {
      return (
        React.createElement(NewsBit, {key: story.id, story: story}
        )
      );
    });
    return (
      React.createElement("div", {className: "panel panel-default"}, 

        React.createElement("div", {className: "list-group"}, 
          newsNodes
        ), 

        React.createElement("div", {className: "panel-footer"}, "Made with ", React.createElement("a", {href: "https://push.superfeedr.com"}, "Superfeedr"), ", hosted on ", React.createElement("a", {href: "https://github.com/"}, "Github"), ", with ", React.createElement("a", {href: "https://www.cloudflare.com/"}, "CloudFlare"), ". ", React.createElement("a", {href: "https://github.com/superfeedr/readernews"}, "Source code"), ".")
      )
    );
  }
});

var NewsBit = React.createClass({displayName: "NewsBit",
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
    React.createElement("a", {href: this.props.story.permalinkUrl, className: "list-group-item"}, 
      React.createElement("h4", {className: "list-group-item-heading"}, this.props.story.title), 
      React.createElement("span", {className: "source"}, React.createElement("img", {src: source.icon}), source.title, ", published ", published)
    )
    );
  }
});


React.render(
  React.createElement(ReaderBox, null),
  document.getElementById('content')
);