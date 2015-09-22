var serialize = require('./utils/serialize.js');

var Story = require('./story.jsx');

var Stories = React.createClass({

  getInitialState: function() {
   return {
    stories: [],
   }
  },

  componentDidMount: function() {
    this.loadContent();
  },

  loadContent: function loadContent() {
    var that = this;
    this.setState({
      error: false,
      loading: true
    }, function() {

      var url = "https://stream.superfeedr.com/";
      var query = {
        'count': 5,
        'hub.mode': 'retrieve',
        'authorization': btoa([that.props.login, that.props.token].join(':')),
        'hub.callback': 'https://push.superfeedr.com/dev/null'
      };

      url = [url, serialize(query)].join('?');
      var source = new EventSource(url);

      source.addEventListener("error", function(e) {
        that.setState({
          loading: false,
          error: "There was an error. Please, check your credentials."
        });
      });

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
              loading: false,
              stories: that.state.stories
            });
          });
      });
    });
  },


  render: function() {
    var storyNodes = this.state.stories.map(function (story) {
      return (
        <Story key={story.id} story={story}>
        </Story>
        );
    });

    return (        <div className="list-group">

      {storyNodes}
      </div>
)

  }
});


module.exports = Stories;