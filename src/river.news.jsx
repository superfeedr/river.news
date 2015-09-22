var Stories = require('./stories.jsx');
var Settings = require('./settings.jsx');


var River = React.createClass({
  getInitialState: function getInitialState() {
    return {
      panel: ''
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
    else if(that.state.panel === 'subscription')
      panel = (<Subscriptions />);
    else
      panel = (<Stories login={login} token={token} />);

    // if(this.state.showSettings) {
    //   settingsNode = (<Settings />);
    // }

    // var loading = '';
    // if(this.state.loading) {
    //   loading = (<div className="panel-body"><p className="text-center"><span className="glyphicon glyphicon-refresh" aria-hidden="true"></span></p></div>)
    // }

    // var error = '';
    // if(this.state.error) {
    //   loading = (<div className="panel-body"><p className="text-center">{this.state.error}</p></div>)
    // }


    var settingsButtonClasses = ["btn", "btn-default", "pull-right"];
    if(that.state.panel) {
      settingsButtonClasses.push("active")
    }

    var settingsButton = (<button type="button" className={settingsButtonClasses.join(' ')} onClick={function() {
      that.togglePanel(that.state.panel == 'settings' ? '' : 'settings')
    }}>
      <span className="glyphicon glyphicon-wrench" aria-hidden="true"></span>
    </button>);

    return (
      <div className="panel panel-default">

        <div className="panel-heading clearfix">
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