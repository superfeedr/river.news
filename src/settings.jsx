var Superfeedr = require('./utils/superfeedr.js');

var Settings = React.createClass({

  getInitialState: function getInitialState() {
    return {
      loading: false,
      valid: false,
    }
  },

  demo: function demo(e) {
    React.findDOMNode(this.refs.login).value = 'rssriver';
    React.findDOMNode(this.refs.token).value = '00cf0f60ab7a616f132b702a5c1746a1';
    this.saveSettings(e);
  },

  saveSettings: function saveSettings(e) {
    var that = this;
    e.preventDefault();
    var login = React.findDOMNode(this.refs.login).value.trim();
    var token = React.findDOMNode(this.refs.token).value.trim();
    if (!token || !login) {
      return;
    }
    React.findDOMNode(this.refs.login).value = login;
    React.findDOMNode(this.refs.token).value = token;


    that.setState({
      valid: false,
      loading: true
    }, function() {
      Superfeedr.checkCredentials(login, token, function(error, valid) {
        if(error || !valid) {
          that.setState({
            loading: false
          }, function() {
            if(error.status == '401' || error.status == '403')
              alert('Your credentials are not valid. Please, try again.');
            else
              alert('We could not check your credentials. Please try again later.');
          });
        }
        else {
          that.setState({
            loading: false,
            valid: true
          }, function() {
            localStorage.setItem("login", login);
            localStorage.setItem("token", token);
            that.props.settingsChanged();
          });
        }
      });
    });

  },

  render: function render() {
    var button = (<button type="submit" className="btn btn-default pull-right button button--raised button--positive">Save</button>);
    if(this.state.loading) {
      button = (<button type="submit" className="btn btn-default pull-right button button--raised button--positive">
        <span className="glyphicon glyphicon glyphicon-refresh" disabled="disabled" aria-hidden="true"></span> Saving
        </button>);
    }
    if(this.state.valid) {
      button = (<button type="submit" className="btn btn-success pull-right button button--raised button--positive">
        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span> Saved
        </button>);
    }

    var demoButton = (<button type="button" className="btn btn-default pull-right btn-link button button--flat button--neutral" onClick={this.demo}>Use demo credentials</button>);


    return (
    <form className="panel-body box__content" onSubmit={this.saveSettings}>
      <div className="form-group">
        <label htmlFor="login" className="form__label">Login</label>
        <input type="text" className="form-control form__input  input--text" ref="login" placeholder="Login" defaultValue={this.props.login} />
        <p className="help-block">Enter your <a href="http://superfeedr.com/subscriber/" target="_blank">Superfeedr subscriber</a> username.</p>
      </div>
      <div className="form-group">
        <label htmlFor="token" className="form__label">Token</label>
        <input type="text" className="form-control form__input  input--text" ref="token" placeholder="Token"  defaultValue={this.props.token} />
        <p className="help-block">Create an <a href="https://superfeedr.com/tokens/new">API token</a> with the following rights: <var>subscribe</var>, <var>unsubscribe</var>, <var>list</var> and <var>retrieve</var> and enter the token's value above.</p>
      </div>
      <div className="form-row form-row--form-actions">
       {demoButton}
        {button}
      </div>
    </form>);
  }
});


module.exports = Settings;