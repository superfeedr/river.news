var Superfeedr = require('./utils/superfeedr.js');
var Stories = require('./stories.jsx');
var Settings = require('./settings.jsx');
var SetIntervalMixin = require('./set-interval-mixin.jsx');
var Subscriptions = require('./subscriptions.jsx');

var River = React.createClass({
  mixins: [SetIntervalMixin], // Use the mixin

  getInitialState: function getInitialState() {
    var params = document.getElementById('river-news').dataset;

    var login = localStorage.getItem('superfeedrLogin');
    var token = localStorage.getItem('superfeedrToken');

    if(params['superfeedrLogin'])
      login = params['superfeedrLogin']

    if(params['superfeedrToken'])
      token = params['superfeedrToken']

    var disableSettings = typeof params['disableSettings'] !== 'undefined'; // Let's the visitor change the settings
    var disableSubscriptions = typeof params['disableSubscriptions'] !== 'undefined'; // Let's the visitor change the subscriptions

    var panel = 'river';
    if(!login || !token) {
      panel = 'settings'
    }
    return {
      login: login,
      token: token,
      disableSettings: disableSettings,
      disableSubscriptions: disableSubscriptions,
      panel: panel,
      connected: true,
      loading: false,
      valid: false,
    };
  },

  componentDidMount: function componentDidMount() {
    var that = this;
    this.setInterval(this.checkConnection, 1000); // Call a method on the mixin
    if(this.state.login || this.state.token)
      this.checkCredentials(this.state.login, this.state.token, function(valid) {})
  },

  checkConnection: function checkConnection() {
    var that = this;
    $.ajax({
      type: "HEAD",
      async: true,
      cache: false,
      url: 'https://river.news/up.html',
    }).done(function(message, text, response){
      if(!that.state.connected) {
        that.setState({
          connected: true
        });
      }
    }).fail(function(response, text, error) {
      if(that.state.connected) {
        that.setState({
          connected: false
        });
      }
    });
  },

  togglePanel: function togglePanel(panel) {
    this.setState({
      panel: panel
    });
  },

  checkCredentials: function checkCredentials(login, token, cb) {
    Superfeedr.checkCredentials(login, token, function(error, valid) {
      if(error || !valid) {
        if(error.status == '401' || error.status == '403')
          alert('Your credentials are not valid. Please, try again.');
        else
          alert('We could not check your credentials. Please try again later.');
      }
      return cb(!error && valid)
    });
  },

  saveSettings: function saveSettings(login, token, done) {
    var that = this;

    that.setState({
      loading: true,
    }, function() {
      that.checkCredentials(login, token, function(valid) {
        if(valid) {
          localStorage.setItem('superfeedrLogin', login);
          localStorage.setItem('superfeedrToken', token);
        }

        that.setState({
          valid: valid,
          loading: false,
          login: login,
          token: token
        });
      });
    });
  },

  render: function render() {
    var that = this;

    var panel = '';

    if(that.state.panel === 'settings')
      panel = (<Settings connected={this.state.connected} login={this.state.login} token={this.state.token} saveSettings={this.saveSettings} loading={this.state.loading} valid={this.state.valid} />);
    else if(that.state.panel === 'subscriptions')
      panel = (<Subscriptions connected={this.state.connected} login={this.state.login} token={this.state.token} />);
    else
      panel = (<Stories login={this.state.login} token={this.state.token} />);


    // Settings button
    var settingsButton = ''
    if(!this.state.disableSettings) {
      var settingsButtonClasses =  ["btn", "btn-default", "button"];
      if(that.state.panel === 'settings') {
        settingsButtonClasses.push("active")
      }
      var settingsButton = (<button type="button" aria-label="Settings" className={settingsButtonClasses.join(' ')} onClick={function() {
        that.togglePanel(that.state.panel == 'settings' ? '' : 'settings')
      }}>
      <span className="glyphicon glyphicon-wrench" aria-hidden="true"></span> Settings
      </button>);
    }

    // Subscription button
    var subscriptionsButton = ''
    if(!this.state.disableSubscriptions) {
      var subscriptionsButtonClasses = ["btn", "btn-default", "button"];
      if(that.state.panel === 'subscriptions') {
        subscriptionsButtonClasses.push("active")
      }
      subscriptionsButton = (<button type="button" className={subscriptionsButtonClasses.join(' ')} onClick={function() {
        that.togglePanel(that.state.panel == 'subscriptions' ? '' : 'subscriptions')
      }}>
      <span className="glyphicon glyphicon-list" aria-hidden="true"></span> Feeds
      </button>);
    }

    // River button
    var riverButton = ''
    if(!(this.state.disableSubscriptions && this.state.disableSettings)) {
      var riverButtonClasses =  ["btn", "btn-default", "button"];
      if(that.state.panel === 'river') {
        riverButtonClasses.push("active")
      }
      riverButton = (<button type="button" className={riverButtonClasses.join(' ')} onClick={function() {
        that.togglePanel(that.state.panel == 'river' ? '' : 'river')
      }}>
      <span className="glyphicon glyphicon-tint" aria-hidden="true"></span> River
      </button>);
    }

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
  document.getElementById('river-news')
);