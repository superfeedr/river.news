var Superfeedr = require('./utils/superfeedr.js');

var Subscriptions = React.createClass({

  getInitialState: function getInitialState() {
    return {
      subscriptions: [],
      loading: false,
    }
  },

  getSubscriptionList: function getSubscriptionList() {
    var that = this;
    that.setState({
      loading: true,
    }, function() {
      Superfeedr.getSubscriptions(that.props.login, that.props.token, function(error, subscriptions) {
        that.setState({
          loading: false,
          subscriptions: subscriptions
        });
      });
    });
  },

  componentWillReceiveProps: function componentWillReceiveProps() {
    this.getSubscriptionList();
  },

  componentDidMount: function componentDidMount() {
    this.getSubscriptionList();
  },

  add: function add(e) {
    var that = this;
    e.preventDefault();

    var url = React.findDOMNode(this.refs.feed).value.trim();
    if(!url || url == '')
      return;

    that.setState({
      loading: true
    }, function() {
      Superfeedr.subscribe(that.props.login, that.props.token, url, function(err, result) {
        if(err)
          return that.setState({
            loading: false,
          }, function() { window.alert(err.message); });

        React.findDOMNode(that.refs.feed).value = "";

        that.state.subscriptions.push({subscription: {feed: {status: {feed: url}}}});
        that.setState({
          loading: false,
          subscriptions: that.state.subscriptions
        });
      });
    });
  },

  render: function render() {
    var that = this;

    var connectionStatus = '';
    if(!this.props.connected) {
      connectionStatus = (<div className="alert alert-danger" role="alert">
        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
        <span className="sr-only">Error: </span>
        You are currently offline. Please come back and change your subscriptions when you are online.
        </div>);
    }

    var subscriptionNodes = that.state.subscriptions.map(function(s) {
      return (<Subscription connected={that.props.connected} subscription={s} login={that.props.login} token={that.props.token} />);
    });

    var disabled = '';
    if(!this.props.connected) {
      disabled = 'disabled';
    }
    var addSubscription = (<tr>
      <td className="u-table-width-75p">
        <input disabled={disabled} type="text" className="form-control input-sm form__input input--text" ref="feed" placeholder="Feed URL"/>
      </td>
      <td className="u-table-width-25p">
        <button disabled={disabled} type="submit" className="btn btn-primary btn-sm pull-right">
          <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Add
        </button>
      </td>
    </tr>);

    if(that.state.loading) {
      addSubscription = (<tr>
      <td>
        <input type="text" className="form-control input-sm form__input input--text input--disabled" ref="feed" disabled placeholder="Feed URL"/>
      </td>
      <td>
        <button type="submit" className="btn btn-default btn-sm pull-right" disabled>
          <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span> Add
        </button>
      </td>
    </tr>);
    }


    return (
      <div>
        <div className="panel-body">
          {connectionStatus}
        </div>
        <form className="table-responsive panel-body" onSubmit={this.add} >
          <table className="table">
            <tbody>
              {subscriptionNodes}
              {addSubscription}
            </tbody>
          </table>
        </form>
      </div>
    );
  }
});

var Subscription = React.createClass({

  getInitialState: function() {
    return {
      loading: false,
    }
  },

  removeSubscription: function removeSubscription(e) {
    var that = this;
    e.preventDefault();

    that.setState({
      loading: true
    }, function() {
     Superfeedr.unsubscribe(that.props.login, that.props.token, that.props.subscription, function(err, result) {
      if(err)
        return window.alert(err.message);

      that.setState({
        loading: false,
        unsubscribed: !err,
      });
    });
   });
  },

  render: function render() {
    var that = this;

    var rowClasses = "";
    if(that.state.unsubscribed) {
      rowClasses += "hidden";
    }

    var disabled = '';
    if(!that.props.connected) {
      disabled = 'disabled';
    }

    var url = that.props.subscription.subscription.feed.status.feed;

    var button = (<button className="btn btn-sm pull-right btn-danger" disabled={disabled} onClick={that.removeSubscription}>
      <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove
    </button>);
    if(that.state.loading) {
      button = (<button className="btn btn-sm pull-right btn-danger" disabled>
        <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span> Remove
      </button>);
    }



    return (<tr className={rowClasses}>
      <td className="u-table-width-75p">
        <a href={url}>{url}</a>
      </td>
      <td className="u-table-width-25p">
        {button}
      </td>
      </tr>);
  }
});


module.exports = Subscriptions;