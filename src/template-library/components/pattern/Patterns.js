import useContextLibrary from "../../hooks/useContextLibrary";
import Filter from "./Filter";
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { dispatch as dataDispatch, select } from '@wordpress/data';
import { parse } from '@wordpress/blocks';
import Pattern from "./Pattern";
import Empty from "../common/Empty";
import updateTemplateBlocks from "@/template-library/includes/updateTemplateBlocks";
import apiFetch from '@wordpress/api-fetch';
import usePatternQuery from "@/template-library/hooks/usePatternQuery";
import ContentLoader from "../common/ContentLoader";

/**
 * Renders the Patterns component.
 *
 * @returns {JSX.Element} The rendered Patterns component.
 */
const Patterns = () => {
	const { dispatch, searchInput, imageImportType, filter } = useContextLibrary();
	const { patterns, loading, loadMoreRef, hasMore } = usePatternQuery();
	const { insertBlocks, insertAfterBlock, replaceBlocks } = dataDispatch('core/block-editor');
	const { getSelectedBlockClientId } = select('core/block-editor');
	
	useEffect(() => {
		apiFetch({ path: '/gutenkit/v1/settings' })
			.then((data) => {
				const remoteImagePermission = data.settings.remote_image.status === 'active' ? 'upload' : '';
				dispatch({
					type: 'SET_IMAGE_IMPORT_TYPE',
					imageImportType: remoteImagePermission
				});
			})
			.catch((error) => { 
				console.warn('Fetch failed: ', error.message);
			})
	}, [])

	const handlePatternImport = async (pattern) => {
		const content = parse(pattern.content);
		const selectedBlockClientId = getSelectedBlockClientId();
		if (imageImportType === "upload") {
			const newUpdatedContent = await updateTemplateBlocks(content); // Await the top-level call
			if (selectedBlockClientId) {
				insertAfterBlock(selectedBlockClientId);
				const newSelectedBlockClientId = getSelectedBlockClientId();
				replaceBlocks(newSelectedBlockClientId, newUpdatedContent);
			} else {
				insertBlocks(newUpdatedContent);
			}
		} else {
			if (selectedBlockClientId) {
				insertAfterBlock(selectedBlockClientId);
				const newSelectedBlockClientId = getSelectedBlockClientId();
				replaceBlocks(newSelectedBlockClientId, content);
			} else {
				insertBlocks(content);
			}
		}
		await dispatch({
			type: 'SET_LOAD_LIBRARY',
			loadLibrary: false
		});
	}

	return (
		<>
			<Filter />
			<div className="gutenkit-library-list gutenkit-pattern-part">
				<div className="gutenkit-pattern">
					{patterns && patterns.length === 0 && loading ? (
						<ContentLoader type='patterns' />
					) : (
						<>
							{patterns &&
								patterns.map((pattern, index) => (
									<Pattern key={pattern?.ID} pattern={pattern} handlePatternImport={handlePatternImport} />
								))}
						</>
					)}
				</div>
				{(hasMore && filter.category === 'all') && <button className="has-more-data" ref={loadMoreRef}></button>}
				{((patterns && patterns.length === 0 && searchInput !== '')) && <Empty />}
			</div>

		</>
	);
}

export default Patterns;