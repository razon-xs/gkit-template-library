import useContextLibrary from "../../hooks/useContextLibrary";
import { useEffect, useState } from "@wordpress/element";
import { Spinner, ButtonGroup, Button } from "@wordpress/components";
import { dispatch as dataDispatch } from "@wordpress/data";
import { parse } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import Back from "../icons/Back";
import classNames from 'classnames';
import ProIcon from "../icons/Pro";
import Download from "../icons/Download";
import ExternalLink from "../common/ExternalLink";
import FavoriteCount from "../common/FavoriteCount";
import updateTemplateBlocks from "@/template-library/includes/updateTemplateBlocks";

const SinglePage = () => {
	const { singleTemplate, syncLibrary, dispatch, imageImportType, payload } = useContextLibrary();
	const { insertBlocks } = dataDispatch('core/block-editor');
	const isProActive = false
	const [singlePages, setSinglePages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [importing, setImporting] = useState(false);
	const heroPage = singlePages[0];
	const isPremium = singleTemplate?.package === 'pro';
	useEffect(() => {
		setLoading(true);
		const queryParams = {
			id: singleTemplate?.ID
		};
		const url = addQueryArgs('https://wpmet.com/plugin/gutenkit/wp-json/gkit/v1/layout-manager-api/templates', queryParams);
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(payload)
		})
			.then(response => response.json())
			.then(data => {
				if (data?.posts) {
					data.posts.sort((a, b) => {
						if (a.title.toLowerCase().includes('home')) return -1;
						if (b.title.toLowerCase().includes('home')) return 1;
						return 0;
					});
					setSinglePages(data.posts);
				}
			})
			.catch(error => {
				console.error(`Error fetching pages: ${error}`);
			})
			.finally(() => {
				setLoading(false);
			});

		return () => {
			dispatch({
				type: 'SET_SYNC_LIBRARY',
				syncLibrary: false
			})
		}
	}, [singleTemplate, syncLibrary]);

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
		setImporting(true);
		const content = parse(page.content);

		if (imageImportType === "upload") {
			const newUpdatedContent = await updateTemplateBlocks(content); // Await the top-level call
			insertBlocks(newUpdatedContent);
		} else {
			insertBlocks(content);
		}
		setImporting(false);

		dispatch({
			type: 'SET_LOAD_LIBRARY',
			loadLibrary: false
		});

		dispatch({
			type: 'SET_IS_SINGLE_PAGE',
			showSinglePage: false
		});
	}

	const handleBack = () => {
		dispatch({
			type: 'SET_IS_SINGLE_PAGE',
			showSinglePage: false
		})
		dispatch({
			type: "SET_TEMPLATE_TYPE",
			templateType: 'templates'
		})
	}
	const handleCurrentPage = (index) => {
		let newPages = [...singlePages];
		newPages = [newPages[index], ...newPages.filter((_, i) => i !== index)];
		setSinglePages(newPages);
	}

	const thumbnailClass = classNames(
		'gutenkit-library-single-page__current-thumbnail',
		{ 'is-premium': singleTemplate?.package === 'pro' }
	);

	return (
		<div key={0} className="gutenkit-library-single-page">
			{
				loading && <div className="gutenkit-library-single-page__spinner">
					<button className="has-more-data"></button>
				</div>
			}
			<div className="gutenkit-library-single-page__inner">
				{
					heroPage && <div className="gutenkit-library-single-page__current" key={0}>
						<div className="gutenkit-library-single-page__current-header">
							<button className="gutenkit-library-single-page__current-back" onClick={() => handleBack()}>
								<Back /> Back
							</button>
							<h3 className="gutenkit-library-single-page__current-title">{heroPage.title}</h3>
						</div>
						<div className="gutenkit-library-single-page__current-scroll">
							<div className={thumbnailClass}>
								<img src={heroPage.screenshot} alt={heroPage.title} width={1200} height={1200} />
							</div>
						</div>
					</div>
				}
				<div className="gutenkit-library-single-page__group">
					<div className="gutenkit-library-single-page__group-header">
						<h3 className="gutenkit-library-single-page__group-title">{__(`Pages (${singlePages.length})`, 'gutenkit-blocks-addon')}</h3>
						<FavoriteCount count={6} />
					</div>
					<div className="gutenkit-library-single-page__group-scroll">
						<div className="gutenkit-library-single-page__group-items">
							{
								!loading && singlePages.map((page, index) => {
									return (
										<div
											key={index}
											onClick={() => handleCurrentPage(index)}
											className={`gutenkit-library-single-page__group-item ${heroPage?.ID === page.ID ? 'is-active' : ''}`}
										>
											<div className="gutenkit-library-single-page__group-item-inner">
												<div className="gutenkit-library-single-page__group-item-thumbnail">
													<img width={400} height={400} src={page.screenshot} alt={page.title} />
												</div>
												<div className="gutenkit-library-single-page__group-item-content">
													<h3 className="gutenkit-library-single-page__group-item-title">{page.title.split(' - ')[0]}</h3>
												</div>
											</div>
										</div>
									)
								})
							}
						</div>
					</div>
					<div className="gutenkit-library-single-page__pro-notice">
						{
							isPremium && !isProActive && (
								<div className="gutenkit-library-single-page__pro-notice-inner">
									<div className="gutenkit-library-single-page__pro-notice-icon">
										<ProIcon />
										<h3>{__('Premium Template', 'gutenkit-blocks-addon')}</h3>
									</div>
									<p>{__('Unlock access to this template, along with a vast array of others, for as little as $49. Start creating effortlessly today!', 'gutenkit-blocks-addon')}</p>
								</div>
							)
						}

						<ButtonGroup>
							<ExternalLink href={heroPage?.live_preview} icon={false}>
								{__('Live Preview', 'gutenkit-blocks-addon')}
							</ExternalLink>
							{
								isPremium && !isProActive && (
									<ExternalLink href={'https://wpmet.com/plugin/gutenkit/pricing'}>
										{__('Upgrade Now!', 'gutenkit-blocks-addon')}
									</ExternalLink>
								)
							}
							{
								isPremium && isProActive && (
									<Button
										onClick={async () => {
											setImporting(true);
											await handlePageImport(heroPage);
											setImporting(false);
										}}
										className='gutenkit-import-button'
										icon={importing ? <Spinner className='importing-spinner' /> : <Download />}
										disabled={importing ? true : false}>
										{importing ? __('Importing', 'gutenkit-blocks-addon') : __('Import', 'gutenkit-blocks-addon')}
									</Button>
								)

							}
							{
								!isPremium && (
									<Button
										onClick={async () => {
											setImporting(true);
											await handlePageImport(heroPage);
											setImporting(false);
										}}
										className='gutenkit-import-button'
										icon={importing ? <Spinner className='importing-spinner' /> : <Download />}
										disabled={importing ? true : false}>
										{importing ? __('Importing', 'gutenkit-blocks-addon') : __('Import', 'gutenkit-blocks-addon')}
									</Button>
								)
							}
						</ButtonGroup>
					</div>
				</div>
			</div>
		</div>
	)
};

export default SinglePage;