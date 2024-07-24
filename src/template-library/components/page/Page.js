import { Button, Spinner } from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import Download from '../icons/Download';
import classNames from 'classnames';
import ExternalLink from '../common/ExternalLink';
import { __ } from '@wordpress/i18n';
import LazyImage from '../LazyImage';
import apiFetch from '@wordpress/api-fetch';
import usePluginManager from '../../hooks/usePluginManager';

function Page( { page, handlePageImport } ) {
	const isProActive = false;
	const [ pageImporting, setPageImporting ] = useState( false );
	const { status, handlePluginInstall, importButtonRef } = usePluginManager(
		page,
		handlePageImport,
		setPageImporting
	);

	useEffect( () => {
		if ( pageImporting ) {
			const thumbnails = document.querySelectorAll(
				'.gutenkit-library-list-item-inner-content-thumbnail:not(.is-loading)'
			);
			thumbnails.forEach( ( thumbnail ) => {
				thumbnail.classList.add( 'disabled' );
			} );
		}
	}, [ pageImporting ] );

	const thumbnailClass = classNames(
		'gutenkit-library-list-item-inner-content-thumbnail',
		{ 'is-loading': pageImporting }
	);

	const listItemClass = classNames( 'gutenkit-library-list-item', {
		'pro-inactive': page?.package === 'pro' && ! isProActive,
	} );
	const titleClass = classNames( 'gutenkit-library-list-item__title', {
		'is-premium': page?.package === 'pro',
	} );

	return (
		<li className={ listItemClass } key={ page?.ID }>
			<div className={ thumbnailClass }>
				<LazyImage src={ page?.thumbnail } alt={ page?.title } />
				<div className="gutenkit-library-list-item-inner-content-overlay">
					{ page?.package === 'pro' && isProActive && (
						<Button
							onClick={ async () => {
								setPageImporting( true );
								await handlePageImport( page );
								setPageImporting( false );
							} }
							className="gutenkit-import-button"
							icon={
								pageImporting ? (
									<Spinner className="importing-spinner" />
								) : (
									<Download />
								)
							}
							disabled={ pageImporting ? true : false }
						>
							{ pageImporting
								? __( 'Importing', 'gutenkit-blocks-addon' )
								: __( 'Import', 'gutenkit-blocks-addon' ) }
						</Button>
					) }
					{ page?.package === 'pro' && ! isProActive && (
						<ExternalLink href="https://wpmet.com/plugin/gutenkit/">
							{ __(
								'Requires GutenKit Blocks PRO',
								'gutenkit-blocks-addon'
							) }
						</ExternalLink>
					) }
					{ page?.package === 'free' && status === 'Activated' && (
						<Button
							ref={ importButtonRef }
							onClick={ async () => {
								setPageImporting( true );
								await handlePageImport( page );
								setPageImporting( false );
							} }
							className="gutenkit-import-button"
							icon={
								pageImporting ? (
									<Spinner className="importing-spinner" />
								) : (
									<Download />
								)
							}
							disabled={ pageImporting ? true : false }
						>
							{ pageImporting
								? __( 'Importing', 'gutenkit-blocks-addon' )
								: __( 'Import', 'gutenkit-blocks-addon' ) }
						</Button>
					) }
					{ page?.package === 'free' && status !== 'Activated' && (
						<Button
							onClick={ handlePluginInstall }
							className="gutenkit-import-button"
							icon={
								status === 'Installing' ||
								status === 'Activating' ? (
									<Spinner className="importing-spinner" />
								) : (
									<Download />
								)
							}
							disabled={ pageImporting ? true : false }
						>
							{ __( `${ status }`, 'gutenkit-blocks-addon' ) }
						</Button>
					) }
				</div>
			</div>
			<div className={ titleClass }>
				<span className="item-title">{ page?.title }</span>
			</div>
		</li>
	);
}

export default Page;
