import useContextLibrary from '../../hooks/useContextLibrary';
import { __ } from '@wordpress/i18n';
import useCategoryQuery from '@/template-library/hooks/useCategoryQuery';
import ContentLoader from '../common/ContentLoader';

/**
 * Filter component for the template library.
 * @returns {JSX.Element} The rendered Filter component.
 */
const Filter = () => {
	const { filter, dispatch } = useContextLibrary();
	const { categories, loading } = useCategoryQuery();
	/**
	 * Handles the category filter.
	 *
	 * @param {string} newCategory - The new category value.
	 * @returns {void}
	 */
	const handleCategoryFilter = ( newCategory ) => {
		dispatch( {
			type: 'SET_SEARCH_INPUT',
			searchInput: '',
		} );
		dispatch( {
			type: 'SET_KEY_WORDS',
			keyWords: '',
		} );
		dispatch( {
			type: 'SET_FILTER',
			filter: {
				...filter,
				category: newCategory,
			},
		} );
	};
	return (
		<div className="gutenkit-library-filter">
			{ categories && categories.length === 0 && loading ? (
				<ContentLoader type="categories" />
			) : (
				<div className="gutenkit-library-filter__inner">
					<h3 className="gutenkit-library-filter-title">
						{ __( 'Category', 'gutenkit-blocks-addon' ) }
					</h3>
					<ul className="gutenkit-library-filter-category-list">
						{ categories.map( ( category, index ) => {
							return (
								<li
									key={ index }
									className="gutenkit-library-filter-category-list-item"
								>
									<button
										className={ `gutenkit-library-filter-category-list-title ${
											category.slug === filter?.category
												? 'is-active'
												: ''
										}` }
										onClick={ () =>
											handleCategoryFilter(
												category.slug
											)
										}
									>
										<span>{ category.title }</span>
										<span className="list-title-count">
											{ category.count }
										</span>
									</button>
								</li>
							);
						} ) }
					</ul>
				</div>
			) }
		</div>
	);
};

export default Filter;
