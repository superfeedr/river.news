
var ReaderBox = React.createClass({
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
        <NewsBit key={story.id} story={story}>
        </NewsBit>
      );
    });
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

$.superfeedr.options.login = 'readersnews';
$.superfeedr.options.key = '310e761b2fe7004024ba2c73a2d56ac1';

React.render(
  <ReaderBox />,
  document.getElementById('content')
);