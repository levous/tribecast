import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Classnames from 'classnames';
import Fuse from 'fuse.js';
import Logger from '../../modules/Logger';

class SearchField extends Component {
  constructor(props, context) {
    super(props, context);

    // things got a little confusing when the list changed.
    // copy the list to state and pass to Fuse ctor.
    // See componentWillReceiveProps, executeSearch, and render
    //     to see how this is used
    this.state = {
      searchText: props.text || ''
    };
  }

  getFuseInstance(list){
    return new Fuse(list, this.getFuseOptions());
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
    this.searchField.blur();
  }

  componentDidMount() {
    if(this.props.autoFocus){
      this.searchField.focus();
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.list !== this.props.list){
      if(this.state.searchText) this.executeSearch(this.state.searchText);

    }
  }

  handleChange(e) {
    const searchText = this.searchField.value || '';
    this.setState({searchText: searchText});
    this.executeSearch(searchText);
  }

  executeSearch(searchText) {
    let results = this.props.list;
    try{
      // results using search string if has value
      if(searchText && searchText.trim().length){

        const fuse = this.getFuseInstance(this.props.list);
        results = fuse
          .search(searchText.trim())
          .map(record => {
            const searchMeta = {
              fuseJSSearchMeta: {
                score: record.score, 
                matches: record.matches
              }
            }
            return Object.assign({}, record.item, searchMeta);
          });
      }
    }
    catch(err){
      Logger.logError({source:'executeSearch/fuse', error: err});
    }

    this.onSearch(results);
  }

  onSearch(results){

    this.props.onSearch(results);
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
      autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
      />
    );
  }
}

SearchField.propTypes = {
  onSearch: PropTypes.func.isRequired,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  list: PropTypes.array.isRequired,  // the list to search
  className: PropTypes.string,
  style: PropTypes.object,
  id: PropTypes.string,
  width: PropTypes.number,
  caseSensitive: PropTypes.bool, // Indicates whether comparisons should be case sensitive
  include: PropTypes.array, // [matches, score] Will add meta info as .fuseJSSearchMeta to the results item 
  maxPatternLength: PropTypes.number,
  keys: PropTypes.oneOfType([PropTypes.array, PropTypes.string]), // Which keys in the target list items to search
  location: PropTypes.number, // Determines approximately where in the text is the pattern expected to be found
  distance: PropTypes.number, // Determines how close the match must be to the location 
  shouldSort: PropTypes.bool,
  sortFn: PropTypes.func,
  threshold: PropTypes.number, // At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.
  tokenize: PropTypes.bool,
  verbose: PropTypes.bool, // Debugging, set to true
  autoFocus: PropTypes.bool,
  maxResults: PropTypes.number,
  autoFocus: PropTypes.bool
};

SearchField.defaultProps = {
  caseSensitive: false,
  distance: 100,
  include: ['score', 'matches'],
  location: 0,
  width: 430,
  placeholder: 'Search',
  shouldSort: true,
  sortFn(a, b) {
    return a.score - b.score;
  },
  threshold: 0.4,
  tokenize: false,
  verbose: false,
  autoFocus: false
};


export default SearchField;
