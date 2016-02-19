var serialize = require('./utils/serialize.js');

var Story = require('./story.jsx');

var Stories = React.createClass({

  getInitialState: function() {
   return {
    loading: false,
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
      var url = "https://push.superfeedr.com/";
      var query = {
        'count': 10,
        'format': 'json',
        'hub.mode': 'retrieve',
        'authorization': btoa([that.props.login, that.props.token].join(':')),
        'hub.callback': 'https://push.superfeedr.com/dev/null'
      };

      url = [url, serialize(query)].join('?');

      $.getJSON( url, function(notification) {
        notification.items.sort(function(x, y) {
          return x.published - y.published;
        });
        notification.items.forEach(function(item) {
          if(!item.source) {
            item.source = {
              title: notification.title,
              permalinkUrl: notification.permalinkUrl
            }
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

    if(this.state.loading) {
      return (<div className="panel-body">
        <p className="text-center"><span className="glyphicon glyphicon glyphicon-refresh" disabled="disabled" aria-hidden="true"></span></p>
      </div>);
    }
    else {
    var storyNodes = this.state.stories.map(function (story) {
      return (
        <Story key={story.id} story={story}>
        </Story>
        );
    });

    return (<div className="list-group">
      {storyNodes}
      </div>);

    }

  }
});


module.exports = Stories;