import { Button, Spinner } from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import Download from '../icons/Download';
import classNames from 'classnames';
import ExternalLink from '../common/ExternalLink';
import { __ } from '@wordpress/i18n';
import LazyImage from '../LazyImage';

function Page({ page, handlePageImport, handlePluginInstall, pluginData }) {
	const isProActive = false
	const [pageImporting, setPageImporting] = useState(false);
	const importButtonRef = useRef(null);
	useEffect(() => {
		if (pageImporting) {
			const thumbnails = document.querySelectorAll('.gutenkit-library-list-item-inner-content-thumbnail:not(.is-loading)');
			thumbnails.forEach(thumbnail => {
				thumbnail.classList.add('disabled');
			})
		}
	}, [pageImporting]);

	useEffect(() => {
		if (page?.package === 'free' && pluginData.status === 'Activated' && importButtonRef.current) {
			setPageImporting(true);
			handlePageImport(page).then(() => {
				setPageImporting(false);
				setTimeout(() => {
					dispatch('core/editor').savePost();
				});
				setTimeout(() => {
					window.location.reload();
				}, 3000);
			});
		}
	}, [page, handlePageImport, pluginData.status]);


	const thumbnailClass = classNames(
		'gutenkit-library-list-item-inner-content-thumbnail',
		{ 'is-loading': pageImporting },
	);
	const listItemClass = classNames(
		'gutenkit-library-list-item',
		{ 'pro-inactive': page?.package === 'pro' && !isProActive },
	);
	const titleClass = classNames(
		'gutenkit-library-list-item__title',
		{ 'is-premium': page?.package === 'pro' },
	);

	return (
		<li className={listItemClass} key={page?.ID}>
			<div className={thumbnailClass}>
				<LazyImage src={page?.thumbnail} alt={page?.title} />
				<div className="gutenkit-library-list-item-inner-content-overlay">
					{
						(page?.package === 'pro' && isProActive) &&
						<Button
							onClick={async () => {
								setPageImporting(true);
								await handlePageImport(page);
								setPageImporting(false);
							}}
							className='gutenkit-import-button'
							icon={pageImporting ? <Spinner className='importing-spinner' /> : <Download />}
							disabled={pageImporting ? true : false}>
							{pageImporting ? __('Importing', 'gutenkit-blocks-addon') : __('Import', 'gutenkit-blocks-addon')}
						</Button>
					}
					{
						(page?.package === 'pro' && !isProActive) &&
						<ExternalLink href="https://wpmet.com/plugin/gutenkit/">
							{__('Requires GutenKit Blocks PRO', 'gutenkit-blocks-addon')}
						</ExternalLink>
					}
					{
						(page?.package === 'free' && pluginData.status === 'Activated') &&
						<Button
							ref={importButtonRef}
							onClick={async () => {
								setPageImporting(true);
								await handlePageImport(page);
								setPageImporting(false);
							}}
							className='gutenkit-import-button'
							icon={pageImporting ? <Spinner className='importing-spinner' /> : <Download />}
							disabled={pageImporting ? true : false}>
							{pageImporting ? __('Importing', 'gutenkit-blocks-addon') : __('Import', 'gutenkit-blocks-addon')}
						</Button>
					}
					{
						(page?.package === 'free' && pluginData.status !== 'Activated') &&
						<Button
							onClick={handlePluginInstall}
							className='gutenkit-import-button'
							icon={pageImporting ? <Spinner className='importing-spinner' /> : <Download />}
							disabled={pageImporting ? true : false}>
							{__(`${pluginData.status}`, 'gutenkit-blocks-addon')}
						</Button>
					}

				</div>
			</div>
			<div className={titleClass}>
				<span className='item-title'>{page?.title}</span>
			</div>
		</li>
	)
}

export default Page;