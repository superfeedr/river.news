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


var River = React.createClass({
  getInitialState: function() {
    var login = localStorage.getItem('login');
    var token = localStorage.getItem('token');

    var showSettings = false;
    if(!login || login.trim() == "" || !token || token.trim() == '')
      showSettings = true

    return {
      showSettings: false,
      stories: [],
      login: login,
      token: token,
    };
  },

  saveSettings: function(e) {
    var that = this;
    e.preventDefault();
    var login = React.findDOMNode(this.refs.login).value.trim();
    var token = React.findDOMNode(this.refs.token).value.trim();
    if (!token || !login) {
      return;
    }
    React.findDOMNode(this.refs.login).value = login;
    React.findDOMNode(this.refs.token).value = token;
    
    localStorage.setItem("login", login);
    localStorage.setItem("token", token);

    this.setState({
      stories: [], // Reset as creds were changed...
      showSettings: false,
      login: login,
      token: token
    }, function() {
      that.loadContent();
    });
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

  toggleShowSettings: function() {
    this.setState({
      showSettings: !this.state.showSettings
    });
  },

  componentDidMount: function() {
    this.loadContent();
  },
  
  render: function() {

    var settingsNode = '';

    if(this.state.showSettings) {
      settingsNode = (
        <form className="panel-body" onSubmit={this.saveSettings}>
          <div className="form-group">
            <label htmlFor="login">Login</label>
            <input type="text" className="form-control" ref="login" placeholder="Login" defaultValue={this.state.login} />
          </div>
          <div className="form-group">
            <label htmlFor="token">Token</label>
            <input type="text" className="form-control" ref="token" placeholder="Token"  defaultValue={this.state.token} />
          </div>
          <button type="submit" className="btn btn-default pull-right">Save</button>
        </form>
      );
    }

    var newsNodes = this.state.stories.map(function (story) {
      return (
        <NewsBit key={story.id} story={story}>
        </NewsBit>
      );
    });
    
    return (
      <div className="panel panel-default">

        <div className="panel-heading clearfix">
          <button type="button" className="btn btn-default btn-link pull-right" aria-label="Left Align" onClick={this.toggleShowSettings}>
            <span className="glyphicon glyphicon-wrench" aria-hidden="true"></span>
          </button>
        </div>

        {settingsNode}

        <div className="list-group">
          {newsNodes}
        </div>

        <div className="panel-footer">Made with <a href="https://push.superfeedr.com">Superfeedr</a>, hosted on <a href="https://github.com/">Github</a>, with <a href="https://www.cloudflare.com/">CloudFlare</a>. <a href="https://github.com/superfeedr/readernews">Source code</a>.</div>
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


React.render(
  <River />,
  document.getElementById('content')
);