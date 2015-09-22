var Stories = require('./stories.jsx');
var Settings = require('./settings.jsx');
var Subscriptions = require('./subscriptions.jsx');

var River = React.createClass({
  getInitialState: function getInitialState() {
    return {
      panel: 'subscriptions'
    };
  },

  togglePanel: function togglePanel(panel) {
    this.setState({
      panel: panel
    });
  },
  
  render: function render() {
    var that = this;

    var login = localStorage.getItem('login');
    var token = localStorage.getItem('token');

    var panel = '';

     if(that.state.panel === 'settings')
      panel = (<Settings login={login} token={token} settingsChanged={this.forceUpdate} />);
    else if(that.state.panel === 'subscriptions')
      panel = (<Subscriptions login={login} token={token} />);
    else
      panel = (<Stories login={login} token={token} />);

    var settingsButtonClasses = ["btn", "btn-default", "pull-right"];
    if(that.state.panel === 'settings') {
      settingsButtonClasses.push("active")
    }

    var settingsButton = (<button type="button" className={settingsButtonClasses.join(' ')} onClick={function() {
      that.togglePanel(that.state.panel == 'settings' ? '' : 'settings')
    }}>
      <span className="glyphicon glyphicon-wrench" aria-hidden="true"></span>
    </button>);


    var subscriptionsButtonClasses = ["btn", "btn-default", "pull-right"];
    if(that.state.panel === 'subscriptions') {
      subscriptionsButtonClasses.push("active")
    }
    var subscriptionsButton = (<button type="button" className={subscriptionsButtonClasses.join(' ')} onClick={function() {
      that.togglePanel(that.state.panel == 'subscriptions' ? '' : 'subscriptions')
    }}>
      <span className="glyphicon glyphicon-list" aria-hidden="true"></span>
    </button>);


    return (
      <div className="panel panel-default">

        <div className="panel-heading clearfix">
          {subscriptionsButton}
          {settingsButton}
        </div>
        
        {panel}

        <div className="panel-footer">Made with <a href="https://push.superfeedr.com">Superfeedr</a>. <a href="https://github.com/superfeedr/readernews">Source code</a>.</div>
      </div>
    );
  }
});


React.render(
  <River />,
  document.getElementById('content')
);