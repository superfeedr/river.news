var Stories = require('./stories.jsx');
var Settings = require('./settings.jsx');
var Subscriptions = require('./subscriptions.jsx');

var River = React.createClass({
  getInitialState: function getInitialState() {
    var login = localStorage.getItem('login');
    var token = localStorage.getItem('token');
    var panel = 'river';
    if(!login || login == '' || login == null || !token || token == '' || token == null) {
      panel = 'settings'
    }

    return {
      panel: panel
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

    var settingsButtonClasses =  ["btn", "btn-default", "button"];
    if(that.state.panel === 'settings') {
      settingsButtonClasses.push("active")
    }
    var settingsButton = (<button type="button" aria-label="Settings" className={settingsButtonClasses.join(' ')} onClick={function() {
      that.togglePanel(that.state.panel == 'settings' ? '' : 'settings')
    }}>
      <span className="glyphicon glyphicon-wrench" aria-hidden="true"></span> Settings
    </button>);


    var subscriptionsButtonClasses = ["btn", "btn-default", "button"];
    if(that.state.panel === 'subscriptions') {
      subscriptionsButtonClasses.push("active")
    }
    var subscriptionsButton = (<button type="button" className={subscriptionsButtonClasses.join(' ')} onClick={function() {
      that.togglePanel(that.state.panel == 'subscriptions' ? '' : 'subscriptions')
    }}>
      <span className="glyphicon glyphicon-list" aria-hidden="true"></span> Feeds
    </button>);

    
    var riverButtonClasses =  ["btn", "btn-default", "button"];
    if(that.state.panel === 'river') {
      riverButtonClasses.push("active")
    }
    var riverButton = (<button type="button" className={riverButtonClasses.join(' ')} onClick={function() {
      that.togglePanel(that.state.panel == 'river' ? '' : 'river')
    }}>
      <span className="glyphicon glyphicon-tint" aria-hidden="true"></span> River
    </button>);



    return (
      <div className="panel panel-default box">

        <div className="panel-heading clearfix box__header box__title">
          <div className="btn-group pull-right">
            {riverButton}
            {subscriptionsButton}
            {settingsButton}
          </div>
        </div>
        
        {panel}

        <div className="panel-footer box__content">Made with <a href="https://push.superfeedr.com">Superfeedr</a>. <a href="https://github.com/superfeedr/river.news">Source</a>.</div>
      </div>
    );
  }
});


React.render(
  <River />,
  document.getElementById('content')
);