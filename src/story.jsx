var Story = React.createClass({
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
    var published = new Date(this.props.story.published * 1000).toUTCString();
    return (
    <a href={this.props.story.permalinkUrl} target="_blank" className="list-group-item">
      <h4 className="list-group-item-heading">{this.props.story.title}</h4>
      <span className="source"><img src={source.icon} />{source.title}, published {published}</span>
    </a>
    );
  }
});


module.exports = Story;