import { useEffect, useState, useRef } from '@wordpress/element';
import useContextLibrary from './useContextLibrary';
import { addQueryArgs } from '@wordpress/url';

const usePageQuery = () => {
	const {
		templateType,
		dispatch,
		pages,
		syncLibrary,
		searchInput,
		pageTemplatesPage,
		pageHasMore,
		payload,
	} = useContextLibrary();
	const [ loading, setLoading ] = useState( false );
	const loadMoreRef = useRef( null );

	useEffect( () => {
		if ( syncLibrary ) {
			dispatch( {
				type: 'SET_PAGES',
				pages: [],
			} );
			dispatch( {
				type: 'SET_PAGE_TEMPLATES_PAGE',
				pageTemplatesPage: 1,
			} );
			dispatch( {
				type: 'SET_PAGE_HAS_MORE',
				pageHasMore: true,
			} );
		}
		const pageFetch = async () => {
			try {
				pages && pages.length === 0 && setLoading( true );
				let queryParams = {
					page: pageTemplatesPage,
					per_page: 16,
				};
				if ( templateType === 'pages' ) {
					if ( searchInput === '' ) {
						const path = addQueryArgs(
							'https://wpmet.com/plugin/gutenkit/wp-json/gkit/v1/layout-manager-api/pages',
							queryParams
						);
						const response = await fetch( path, {
							method: 'POST',
							body: JSON.stringify( payload ),
						} );
						const json = await response.json();
						dispatch( {
							type: 'SET_PAGES',
							pages: [ ...pages, ...json?.posts ],
						} );
						if ( json?.posts.length < queryParams.per_page ) {
							dispatch( {
								type: 'SET_PAGE_HAS_MORE',
								pageHasMore: false,
							} );
						} else {
							dispatch( {
								type: 'SET_PAGE_TEMPLATES_PAGE',
								pageTemplatesPage: pageTemplatesPage + 1,
							} );
						}
					} else {
						queryParams.search = searchInput.toLowerCase();
						queryParams.page = 1;
						queryParams.per_page = 100;
						const path = addQueryArgs(
							'https://wpmet.com/plugin/gutenkit/wp-json/gkit/v1/layout-manager-api/pages',
							queryParams
						);
						const response = await fetch( path, {
							method: 'POST',
							body: JSON.stringify( payload ),
						} );
						const json = await response.json();
						dispatch( {
							type: 'SET_PAGES',
							pages: json?.posts,
						} );
						dispatch( {
							type: 'SET_PAGE_TEMPLATES_PAGE',
							pageTemplatesPage: 1,
						} );
						dispatch( {
							type: 'SET_PAGE_HAS_MORE',
							pageHasMore: false,
						} );
					}
				}
			} catch ( error ) {
				console.error( `Error fetching pages: ${ error }` );
				setLoading( false );
			} finally {
				setLoading( false );
			}
		};

		if ( searchInput !== '' ) {
			pageFetch();
		}

		const onIntersection = ( items ) => {
			const loaderItem = items[ 0 ];
			if (
				loaderItem.isIntersecting &&
				pageHasMore &&
				searchInput === ''
			) {
				pageFetch();
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
	}, [ templateType, searchInput, syncLibrary, pageTemplatesPage ] );

	return { loading, loadMoreRef, pages, hasMore: pageHasMore };
};

export default usePageQuery;
