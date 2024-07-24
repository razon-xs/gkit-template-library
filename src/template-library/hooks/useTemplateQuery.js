import { useEffect, useState, useRef } from '@wordpress/element';
import useContextLibrary from './useContextLibrary';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

const useTemplateQuery = () => {
	const {
		templateType,
		dispatch,
		templates,
		syncLibrary,
		searchInput,
		templatesPage,
		templatesHasMore,
		payload,
	} = useContextLibrary();
	const [ loading, setLoading ] = useState( false );
	const loadMoreRef = useRef( null );
	useEffect( () => {
		if ( syncLibrary ) {
			dispatch( {
				type: 'SET_TEMPLATES',
				templates: [],
			} );
			dispatch( {
				type: 'SET_TEMPLATES_PAGE',
				templatesPage: 1,
			} );
			dispatch( {
				type: 'SET_TEMPLATES_HAS_MORE',
				templatesHasMore: true,
			} );
		}
		const templatesFetch = async () => {
			try {
				templates && templates.length === 0 && setLoading( true );
				let queryParams = {
					page: templatesPage,
					per_page: 16,
				};
				if ( templateType === 'templates' ) {
					if ( searchInput === '' ) {
						const path = addQueryArgs(
							'https://wpmet.com/plugin/gutenkit/wp-json/gkit/v1/layout-manager-api/templates',
							queryParams
						);
						const response = await fetch( path, {
							method: 'POST',
							body: JSON.stringify( payload ),
						} );
						const json = await response.json();
						dispatch( {
							type: 'SET_TEMPLATES',
							templates: [ ...templates, ...json?.posts ],
						} );
						if ( json?.posts.length < queryParams.per_page ) {
							dispatch( {
								type: 'SET_TEMPLATES_HAS_MORE',
								templatesHasMore: false,
							} );
						} else {
							dispatch( {
								type: 'SET_TEMPLATES_PAGE',
								templatesPage: templatesPage + 1,
							} );
						}
					} else {
						queryParams.search = searchInput.toLowerCase();
						queryParams.page = 1;
						queryParams.per_page = 100;
						const path = addQueryArgs(
							'https://wpmet.com/plugin/gutenkit/wp-json/gkit/v1/layout-manager-api/templates',
							queryParams
						);
						const response = await fetch( path, {
							method: 'POST',
							body: JSON.stringify( payload ),
						} );
						const json = await response.json();
						dispatch( {
							type: 'SET_TEMPLATES',
							templates: json.posts,
						} );
						dispatch( {
							type: 'SET_TEMPLATES_HAS_MORE',
							templatesHasMore: false,
						} );
						dispatch( {
							type: 'SET_TEMPLATES_PAGE',
							templatesPage: 1,
						} );
					}
				}
			} catch ( error ) {
				console.error( `Error fetching templates: ${ error }` );
				setLoading( false );
			} finally {
				setLoading( false );
			}
		};

		if ( searchInput !== '' ) {
			templatesFetch();
		}

		const onIntersection = ( items ) => {
			const loaderItem = items[ 0 ];
			if (
				loaderItem.isIntersecting &&
				templatesHasMore &&
				searchInput === ''
			) {
				templatesFetch();
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
	}, [ templateType, searchInput, syncLibrary, templatesPage ] );

	return { loading, loadMoreRef, templates, hasMore: templatesHasMore };
};

export default useTemplateQuery;
