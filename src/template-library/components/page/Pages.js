import useContextLibrary from "../../hooks/useContextLibrary";
import { memo, useEffect, useState } from "@wordpress/element";
import Page from "./Page";
import { __ } from "@wordpress/i18n";
import { dispatch as dataDispatch } from '@wordpress/data';
import { parse } from '@wordpress/blocks';
import Empty from "../common/Empty";
import usePageQuery from "@/template-library/hooks/usePageQuery";
import ContentLoader from "../common/ContentLoader";
import updateTemplateBlocks from "@/template-library/includes/updateTemplateBlocks";
import apiFetch from '@wordpress/api-fetch';
const Pages = () => {
	const { dispatch, searchInput, imageImportType } = useContextLibrary();
	const { loading, loadMoreRef, pages, hasMore, } = usePageQuery();
	const { insertBlocks } = dataDispatch('core/block-editor');
	const [status, setStatus] = useState('Install');
	const [pluginData, setPluginData] = useState({});

	useEffect(() => {
		apiFetch({ path: '/gutenkit/v1/settings' })
			.then((data) => {
				const remoteImagePermission = data.settings.remote_image.status === 'active' ? 'upload' : '';
				dispatch({
					type: 'SET_IMAGE_IMPORT_TYPE',
					imageImportType: remoteImagePermission
				});
			})
	}, [])


	const handlePageImport = async (page) => {
		const content = parse(page.content);
		if (imageImportType === "upload") {
			const newUpdatedContent = await updateTemplateBlocks(content); // Await the top-level call
			insertBlocks(newUpdatedContent);
		} else {
			insertBlocks(content);
		}

		await dispatch({
			type: 'SET_LOAD_LIBRARY',
			loadLibrary: false
		});
	}
	const handlePluginInstall = () => {
		setStatus('Installing');
		apiFetch({
			path: `/wp/v2/plugins?slug=gutenkit-blocks-addon&status=active`,
			method: 'POST',
			parse: false
		})
			.then((data) => {
				setPluginData(data);
				setStatus('Activated');
			})
			.catch((error) => {
				setStatus(`Install failed: ${error.message}`);
			});
	}

	return (
		<>
			<div className="gutenkit-library-list gutenkit-page">
				<div className="gutenkit-library-list__header">
					<h2 className="gutenkit-library-list__title">{__('Pages', 'gutenkit-blocks-addon')}</h2>
				</div>
				<ul className="gutenkit-library-list__items">
					{
						pages && pages.length === 0 && loading ? (
							<ContentLoader type='pages' />
						) : (
							pages && pages.map((page, index) => (
								<Page key={page?.ID} page={page} handlePageImport={handlePageImport} pluginData={{ pluginData, status }} handlePluginInstall={handlePluginInstall} />
							))
						)
					}
				</ul>
				{hasMore && <button className="has-more-data" ref={loadMoreRef}></button>}
				{((pages && pages.length === 0 && searchInput !== '')) && <Empty />}
			</div>
		</>
	)
}

export default memo(Pages);