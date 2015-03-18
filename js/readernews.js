
var ReaderBox = React.createClass({displayName: "ReaderBox",
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    var feed = new $.superfeedr.Endpoint('https://push.superfeedr.com/dev/null');
    var that = this;
    feed.setNumEntries(10);
    feed.setResultFormat('json');
    feed.load(function(result) {
      if (result.error) {
        console.error(result.error);
        return ;
      }
      that.setState({data: result.feed.items});
    });
  },
  render: function() {
    var newsNodes = this.state.data.map(function (story) {
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

$.superfeedr.options.login = 'readersnews';
$.superfeedr.options.key = '310e761b2fe7004024ba2c73a2d56ac1';

React.render(
  React.createElement(ReaderBox, null),
  document.getElementById('content')
);