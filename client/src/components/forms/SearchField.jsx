import React, {Component, PropTypes} from 'react';
import Classnames from 'classnames';
import Fuse from 'fuse.js';

class SearchField extends Component {
  constructor(props, context) {
    super(props, context);

    const options = this.getFuseOptions();
    this.fuse = new Fuse(props.list, options);
    this.state = {
      searchText: props.text || '',
      results: null
    };
  }

  getFuseOptions() {
    const {
      caseSensitive,
      id,
      include,
      keys,
      shouldSort,
      sortFn,
      tokenize,
      verbose,
      maxPatternLength,
      distance,
      threshold,
      location
    } = this.props;

    return {
      caseSensitive,
      id,
      include,
      keys,
      shouldSort,
      sortFn,
      tokenize,
      verbose,
      maxPatternLength,
      distance,
      threshold,
      location
    };
  }

  componentWillUnmount() {
    // ensure the input field releases focus.  iOS is leaving the keyboard presented and then sh%# gets real!
    this.textInput.blur();
  }

  componentDidMount() {
    if(this.props.autoFocus){
      this.textInput.focus();
    }
  }

  handleChange(e) {
    const value = e.target.value || '';
    const results = e.target.value ? this.fuse.search(e.target.value) : null;

    this.setState({
      searchText: value,
      results: results
    });

    this.onChange(results);
  }

  onChange(results){
    this.props.onChange(results);
  }

  handleKeyPress(e) {
    /** Enter */            /** Tab */
    if (e.keyCode === 13 || e.keyCode === 9) {
      return this.refs.search.blur();
    }
    //TODO: possibly also handleKeyDown(e) and bubble /** Arrow Down */ (e.keyCode === 40) /** Arrow Up */ (e.keyCode === 38) {
  }

  render() {
    return (
    <input ref="search"
      type='search'
      value={this.state.searchText}
      onChange={(e) => this.handleChange(e)}
      placeholder={this.props.placeholder || 'search'}
      ref={input => this.searchField = input}
      style={this.props.style}
      />
    );
  }
}

SearchField.propTypes = {
  onChange: PropTypes.func.isRequired,
  text: PropTypes.string,
  caseSensitive: PropTypes.bool,
  className: PropTypes.string,
  distance: PropTypes.number,
  id: PropTypes.string,
  include: PropTypes.array,
  maxPatternLength: PropTypes.number,
  width: PropTypes.number,
  keys: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  list: PropTypes.array.isRequired,
  location: PropTypes.number,
  placeholder: PropTypes.string,
  shouldSort: PropTypes.bool,
  sortFn: PropTypes.func,
  threshold: PropTypes.number,
  tokenize: PropTypes.bool,
  verbose: PropTypes.bool,
  autoFocus: PropTypes.bool,
  maxResults: PropTypes.number,
  autoFocus: PropTypes.bool,
  style: PropTypes.object
};

SearchField.defaultProps = {
  caseSensitive: false,
  distance: 100,
  include: [],
  location: 0,
  width: 430,
  placeholder: 'Search',
  shouldSort: true,
  sortFn(a, b) {
    return a.score - b.score;
  },
  threshold: 0.6,
  tokenize: false,
  verbose: false,
  autoFocus: false
};


export default SearchField;
