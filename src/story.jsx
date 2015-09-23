var marked = require('marked');
var toMarkdown = require('to-markdown');
var truncate = require('./utils/truncate.js');


var renderer = new marked.Renderer();

renderer.image = function(href, title, text) {
  var out = '<img class="img-responsive" src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

marked.setOptions({
  renderer: renderer,
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

toMarkdownOptions = { converters: [ {
  filter: ['html', 'body', 'span', 'div'],
  replacement: function(innerHTML) {
    return innerHTML;
  }
},
{
  filter: ['head', 'script', 'style'],
  replacement: function() {
    return '';
  }
}
]}


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
    var summary = this.props.story.summary;
    if(!summary || summary == '') {
      summary = this.props.story.content;
    }

    var markdownSummary = toMarkdown(summary, toMarkdownOptions);

    markdownSummary = markdownSummary.replace(/\[!\[\](.*)\](.*)/gim, ''); // Strip ads!

    summary = marked(truncate(markdownSummary, 350));
    var blockquote = '';
    if(summary.trim().length > 0)
      blockquote = (<blockquote dangerouslySetInnerHTML={{__html: summary}} />);

    return (
    <section className="list-group-item">
      <h4 className="list-group-item-heading"><a href={this.props.story.permalinkUrl} target="_blank">{this.props.story.title}</a></h4>
      <p className="source"><img src={source.icon} />{source.title}, published {published}</p>
      {blockquote}
      <a href={this.props.story.permalinkUrl} target="_blank">Read more</a>
    </section>
    );
  }
});


module.exports = Story;