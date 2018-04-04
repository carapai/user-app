import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from '../../constants/lodash';
import filterAuthorities from './utils/filterAuthorities';
import AuthoritySection from './AuthoritySection';

class FilteredAuthoritySections extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredAuthorities: props.allGroupedAuthorities,
            searchChunks: null,
        };
        this.updateFilter = _.debounce(this.updateFilter, 375);
    }

    getChildContext() {
        return {
            searchChunks: this.state.searchChunks,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.updateFilteredAuthorities(nextProps.allGroupedAuthorities, null, null);
    }

    updateFilter(searchStr, selectedOnly) {
        const { allGroupedAuthorities } = this.props;
        this.updateFilteredAuthorities(allGroupedAuthorities, searchStr, selectedOnly);
    }

    updateFilteredAuthorities(all, searchStr, selectedOnly) {
        const { selectedItemsLookup } = this.context;
        const searchChunks = searchStr ? searchStr.toLowerCase().split(' ') : null;
        this.setState({
            filteredAuthorities: filterAuthorities(
                all,
                selectedItemsLookup,
                searchChunks,
                selectedOnly
            ),
            searchChunks,
        });
    }

    render() {
        const { filteredAuthorities } = this.state;

        return (
            <div className="authority-editor__auth-group-wrap">
                {Object.keys(filteredAuthorities).map(key => {
                    return (
                        <AuthoritySection
                            key={key}
                            sectionKey={key}
                            authSection={filteredAuthorities[key]}
                        />
                    );
                })}
            </div>
        );
    }
}

FilteredAuthoritySections.propTypes = {
    allGroupedAuthorities: PropTypes.object,
};

FilteredAuthoritySections.contextTypes = {
    shouldSelect: PropTypes.func.isRequired,
    onAuthChange: PropTypes.func.isRequired,
    selectedItemsLookup: PropTypes.object.isRequired,
};
FilteredAuthoritySections.childContextTypes = {
    searchChunks: PropTypes.array,
};

export default FilteredAuthoritySections;