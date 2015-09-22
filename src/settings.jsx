var Superfeedr = require('./utils/superfeedr.js');

var Settings = React.createClass({

  getInitialState: function() {
    return {
      loading: false,
      valid: false,
    }
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

  render: function() {

    var button = (<button type="submit" className="btn btn-default pull-right">Save</button>);
    if(this.state.loading) {
      button = (<button type="submit" className="btn btn-default pull-right">
        <span className="glyphicon glyphicon glyphicon-refresh" disabled="disabled" aria-hidden="true"></span> Saving
        </button>);
    }
    if(this.state.valid) {
      button = (<button type="submit" className="btn btn-success pull-right">
        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span> Saved
        </button>);
    }

    return (
    <form className="panel-body" onSubmit={this.saveSettings}>
      <div className="form-group">
        <label htmlFor="login">Login</label>
        <input type="text" className="form-control" ref="login" placeholder="Login" defaultValue={this.props.login} />
      </div>
      <div className="form-group">
        <label htmlFor="token">Token</label>
        <input type="text" className="form-control" ref="token" placeholder="Token"  defaultValue={this.props.token} />
      </div>
      {button}
    </form>);
  }
});


module.exports = Settings;