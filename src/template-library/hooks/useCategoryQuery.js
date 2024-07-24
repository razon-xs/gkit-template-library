import { useEffect, useState } from '@wordpress/element';
import useContextLibrary from './useContextLibrary';

/**
 * Custom hook for fetching categories from the layout manager API.
 * This hook is specifically designed for the template library in the Gutenkit plugin.
 */
const useCategoryQuery = () => {
	const [ loading, setLoading ] = useState( false );
	const { dispatch, categories, templateType, payload } = useContextLibrary();
	const fetchCategories = async () => {
		if ( templateType === 'patterns' && categories.length === 0 ) {
			try {
				setLoading( true );
				const response = await fetch(
					'https://wpmet.com/plugin/gutenkit/wp-json/gkit/v1/layout-manager-api/patterns/categories',
					{
						method: 'POST',
						body: JSON.stringify( payload ),
					}
				);
				const json = await response.json();
				const allCount = json.reduce(
					( acc, category ) => acc + category.count,
					0
				);
				const allCategory = {
					id: 0,
					title: 'All',
					slug: 'all',
					count: allCount,
				};
				const mergedResponse = [ allCategory, ...json ];
				dispatch( {
					type: 'SET_CATEGORIES',
					categories: mergedResponse,
				} );
			} catch ( error ) {
				console.error( `Error fetching categories: ${ error }` );
				setLoading( false );
			} finally {
				setLoading( false );
			}
		}
	};

	useEffect( () => {
		fetchCategories();
	}, [] );

	return { categories, loading };
};

export default useCategoryQuery;
