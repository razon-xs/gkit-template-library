import { useEffect, useState, useRef } from '@wordpress/element';
import useContextLibrary from './useContextLibrary';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
/**
 * Custom hook for fetching patterns from the template library.
 *
 * @returns {Object} An object containing patterns, loading state, loadMoreRef, and hasMore flag.
 */
const usePatternQuery = () => {
	const {
		templateType,
		dispatch,
		patterns,
		syncLibrary,
		searchInput,
		filter,
		patternsPage,
		payload,
	} = useContextLibrary();
	const [ loading, setLoading ] = useState( false );
	const [ hasMore, setHasMore ] = useState( true );
	const loadMoreRef = useRef( null );

	// Fetch patterns
	useEffect( () => {
		if ( syncLibrary ) {
			dispatch( {
				type: 'SET_PATTERNS',
				patterns: [],
			} );
			dispatch( {
				type: 'SET_PATTERNS_PAGE',
				patternsPage: 1,
			} );
			setHasMore( true );
		}
		const newPayload = {
			...payload,
			auth: 'other',
		};
		const patternFetch = async () => {
			try {
				patterns && patterns.length === 0 && setLoading( true );
				let queryParams = {
					page: patternsPage,
					per_page: 20,
				};
				if ( templateType === 'patterns' ) {
					// Fetch patterns
					if ( searchInput === '' ) {
						if ( filter.category === 'all' ) {
							const path = addQueryArgs(
								'https://wpmet.com/plugin/gutenkit/wp-json/gkit/v1/layout-manager-api/patterns',
								queryParams
							);
							const response = await fetch( path, {
								method: 'POST',
								body: JSON.stringify( newPayload ),
							} );
							const json = await response.json();
							dispatch( {
								type: 'SET_PATTERNS',
								patterns: [ ...patterns, ...json?.posts ],
							} );
							if ( json?.posts.length < queryParams.per_page ) {
								setHasMore( false );
							} else {
								dispatch( {
									type: 'SET_PATTERNS_PAGE',
									patternsPage: patternsPage + 1,
								} );
							}
						} else {
							queryParams.cat = filter.category;
							queryParams.page = 1;
							queryParams.per_page = 50;
							const path = addQueryArgs(
								'https://wpmet.com/plugin/gutenkit/wp-json/gkit/v1/layout-manager-api/patterns',
								queryParams
							);
							const response = await fetch( path, {
								method: 'POST',
								body: JSON.stringify( payload ),
							} );
							const json = await response.json();
							dispatch( {
								type: 'SET_PATTERNS',
								patterns: json?.posts,
							} );
							dispatch( {
								type: 'SET_PATTERNS_PAGE',
								patternsPage: 1,
							} );
						}
					} else {
						dispatch( {
							type: 'SET_FILTER',
							filter: {},
						} );
						queryParams.search = searchInput.toLowerCase();
						queryParams.page = 1;
						queryParams.per_page = 100;
						const path = addQueryArgs(
							'https://wpmet.com/plugin/gutenkit/wp-json/gkit/v1/layout-manager-api/patterns',
							queryParams
						);
						const response = await fetch( path, {
							method: 'POST',
							body: JSON.stringify( payload ),
						} );
						const json = await response.json();
						dispatch( {
							type: 'SET_PATTERNS',
							patterns: json?.posts,
						} );
						// setHasMore(false);
						dispatch( {
							type: 'SET_PATTERNS_PAGE',
							patternsPage: 1,
						} );
					}
				}
			} catch ( error ) {
				console.error( `Error fetching patterns: ${ error }` );
				setLoading( false );
			} finally {
				setLoading( false );
			}
		};

		if ( filter.category !== 'all' || searchInput !== '' ) {
			patternFetch();
		}
		const onIntersection = ( items ) => {
			const loaderItem = items[ 0 ];
			if (
				loaderItem.isIntersecting &&
				hasMore &&
				filter.category === 'all'
			) {
				patternFetch();
			}
		};

		const observer = new IntersectionObserver( onIntersection );
		if ( observer && loadMoreRef.current ) {
			observer.observe( loadMoreRef.current );
		}

		return () => {
			if ( observer ) observer.disconnect();
			dispatch( {
				type: 'SET_SYNC_LIBRARY',
				syncLibrary: false,
			} );
		};
	}, [
		templateType,
		searchInput,
		filter.category,
		syncLibrary,
		patternsPage,
	] );

	return { patterns, loading, loadMoreRef, hasMore };
};

export default usePatternQuery;
