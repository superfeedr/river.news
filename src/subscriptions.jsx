var Superfeedr = require('./utils/superfeedr.js');

var Subscriptions = React.createClass({

  getInitialState: function getInitialState() {
    return {
      subscriptions: [],
      loading: false,
    }
  },

  componentDidMount: function componentDidMount() {
    var that = this;
    that.setState({
      loading: true,
      subscriptions: []
    }, function() {
      Superfeedr.getSubscriptions(this.props.login, this.props.token, function(error, subscriptions) {
        that.setState({
          loading: false,
          subscriptions: subscriptions
        });
      });
    });
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

    var subscrptionNodes = that.state.subscriptions.map(function(s) {
      return (<Subscription subscription={s} login={that.props.login} token={that.props.token} />);
    });

    var addSubscription = (<tr>
      <td>
        <input type="text" className="form-control" ref="feed" placeholder="Feed URL"/>
      </td>
      <td>
        <button type="submit" className="btn btn-default btn-sm pull-right">
          <span className="glyphicon glyphicon-plus" aria-hidden="true"></span> Add
        </button>
      </td>
    </tr>);

    if(that.state.loading) {
      addSubscription = (<tr>
      <td>
        <input type="text" className="form-control" ref="feed" disabled placeholder="Feed URL"/>
      </td>
      <td>
        <button type="submit" className="btn btn-default btn-sm pull-right" disabled>
          <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span> Add
        </button>
      </td>
    </tr>);
    }


    return (
      <form className="table-responsive panel-body" onSubmit={this.add} >
        <table className="table">
          <tbody>
            {subscrptionNodes}
            {addSubscription}
          </tbody>
        </table>
      </form>
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

    var url = that.props.subscription.subscription.feed.status.feed;

    var button = (<button className="btn btn-sm pull-right btn-danger" onClick={that.removeSubscription}>
      <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove
    </button>);
    if(that.state.loading) {
      button = (<button className="btn btn-sm pull-right btn-danger" disabled>
        <span className="glyphicon glyphicon-refresh" aria-hidden="true"></span> Remove
      </button>);
    }



    return (<tr className={rowClasses}>
      <td>
        <a href={url}>{url}</a>
      </td>
      <td>
        {button}
      </td>
      </tr>);
  }
});


module.exports = Subscriptions;