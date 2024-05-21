import { Button } from '@wordpress/components';
import useContextLibrary from '../../hooks/useContextLibrary';
import { useEffect, useRef } from '@wordpress/element';
import GutenkitLogo from '../icons/GutenkitLogo';
import Reload from '../icons/Reload';
import Close from '../icons/Close';
import useDebounce from '@/template-library/hooks/useDebounce';
import SearchBar from '../common/SearchBar ';
import SynclibraryTooltip from '../icons/SynclibraryTooltip';
import CloseTooltip from '../icons/CloseTooltip';

const LibraryHeader = () => {
	const { loadLibrary, templateType, dispatch, syncLibrary, filter, showSinglePage } = useContextLibrary();
	useEffect(() => {
		document.addEventListener('keydown', function (event) {
			if (event.key === "Escape" || event.key === "Esc") {
				handleLoadLibrary();
			}
		});
	}, [])

	const activeRef = useRef(null);

	// active button style
	useEffect(() => {
		if (activeRef.current) {
			let button = Array.from(activeRef.current.querySelectorAll('.gutenkit-library-menu-item'));
			let activeButton = button.findIndex((element) =>
				element.classList.contains('is-active')
			);
			if (activeButton !== -1) {
				let width = button[activeButton].clientWidth + 2;
				activeRef.current.style.setProperty(
					'--width',
					`${width}px`
				);

				let translateBefore = button
					.slice(0, activeButton)
					.reduce((acc, el) => acc + el.clientWidth + 20, 0);
				activeRef.current.style.setProperty(
					'--translate',
					`${translateBefore}px`
				);
			}
		}
	}, [templateType])
	const templateTypeList = [
		{
			name: 'Patterns',
			slug: 'patterns'
		},
		{
			name: 'Templates',
			slug: 'templates'
		},
		{
			name: 'Pages',
			slug: 'pages'
		},
	]

	const handleLoadLibrary = () => {
		dispatch({
			type: 'SET_LOAD_LIBRARY',
			loadLibrary: !loadLibrary
		})

		dispatch({
			type: 'SET_IS_SINGLE_PAGE',
			isSinglePage: false
		})

		dispatch({
			type: 'SET_TEMPLATE_TYPE',
			templateType: 'patterns'
		})

	}

	const handleTemplateType = (template) => {
		dispatch({
			type: 'SET_TEMPLATE_TYPE',
			templateType: template.slug
		})
		dispatch({
			type: 'SET_FILTER',
			filter: {
				category: 'all'
			}
		})
		dispatch({
			type: 'SET_SEARCH_INPUT',
			searchInput: ''
		})

		dispatch({
			type: 'SET_IS_SINGLE_PAGE',
			isSinglePage: false
		})

		dispatch({
			type: 'SET_KEY_WORDS',
			keyWords: ''
		})
	}

	// new code 
	const doSearch = useDebounce((term) => {
		dispatch({
			type: 'SET_SEARCH_INPUT',
			searchInput: term
		})
	}, 500);

	const handleChange = (value) => {
		doSearch(value);
	};

	const handleClose = () => {
		if (filter.category !== '' && templateType === 'patterns') {
			dispatch({
				type: 'SET_FILTER',
				filter: {
					category: 'all'
				}
			})

			// change search input to action name
			dispatch({
				type: 'SET_SEARCH_INPUT',
				searchInput: ''
			})

			dispatch({
				type: 'SET_PATTERNS',
				patterns: [],
			});
		}
		if (templateType === 'pages') {

			dispatch({
				type: 'SET_SEARCH_INPUT',
				searchInput: ''
			})
			dispatch({
				type: 'SET_PAGES',
				pages: [],
			});
			dispatch({
				type: "SET_PAGE_HAS_MORE",
				pageHasMore: true
			});

		}
		if (templateType === 'templates') {
			dispatch({
				type: 'SET_SEARCH_INPUT',
				searchInput: ''
			})
			dispatch({
				type: 'SET_TEMPLATES',
				templates: [],
			});
			dispatch({
				type: "SET_TEMPLATES_HAS_MORE",
				templatesHasMore: true
			})
		}

	}

	const displayNone = showSinglePage ? { opacity: '0', visibility: 'hidden', cursor: 'none' } : { opacity: '1', visibility: 'visible', cursor: 'pointer' }
	return (
		<div className="interface-interface-skeleton__header gutenkit-library-header">
			<div className="edit-post-header edit-site-header-edit-mode gutenkit-library-header-content">
				<div className="gutenkit-library-logo">
					<GutenkitLogo />
				</div>
				<div className="gutenkit-library-menu" ref={activeRef}>
					{
						templateTypeList.map((template, index) => {
							return (
								<Button
									key={index}
									variant='link'
									className={`gutenkit-library-menu-item ${templateType === template.slug ? 'is-active' : ''}`}
									onClick={() => handleTemplateType(template)}
								>
									{template.name}
								</Button>
							)
						})
					}
					<span className='under-line'></span>
				</div>

				<div className="gutenkit-library-search">
					<div style={displayNone}>
						<SearchBar
							onChange={handleChange}
							onClick={(event) => event.target.focus()}
							onClose={handleClose}
							className="gutenkit-library-search-input"
							placeholder={`Search ${templateType}...`}
						/>
					</div>
					<div className="gutenkit-library-icon" style={displayNone}>
						<Button
							variant='tertiary'
							icon={<Reload />}
							className={`gutenkit-library-synchronize ${syncLibrary ? 'is-active' : ''}`}
							onClick={() => dispatch({
								type: 'SET_SYNC_LIBRARY',
								syncLibrary: true
							})}
						/>
						<SynclibraryTooltip />
					</div>
					<span className="gutenkit-library-separate" style={displayNone}></span>
					<div className="gutenkit-library-icon">
						<Button
							onClick={handleLoadLibrary}
							variant='tertiary'
							icon={<Close />}
							className="gutenkit-template-library__close"
						/>
						<CloseTooltip />
					</div>
				</div>

			</div>
		</div >
	);
};

export default LibraryHeader;