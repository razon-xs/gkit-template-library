import { Button, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import LazyImage from '../LazyImage';
import { useState, useEffect } from '@wordpress/element';
import classNames from 'classnames';
import ExternalLink from '../common/ExternalLink';
import Download from '../icons/Download';
import usePluginManager from '../../hooks/usePluginManager';

/**
 * Renders a pattern component.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.pattern - The pattern object.
 * @param {Function} props.handlePatternImport - The function to handle pattern import.
 * @returns {JSX.Element} The pattern component.
 */
function Pattern( { pattern, handlePatternImport } ) {
	const isProActive = false;
	const [ patternImporting, setPatternImporting ] = useState( false );
	const { status, handlePluginInstall, importButtonRef } = usePluginManager(
		pattern,
		handlePatternImport,
		setPatternImporting
	);

	useEffect( () => {
		if ( patternImporting ) {
			const thumbnails = document.querySelectorAll(
				'.gutenkit-library-list-item-inner-content-thumbnail:not(.is-loading)'
			);
			thumbnails.forEach( ( thumbnail ) => {
				thumbnail.classList.add( 'disabled' );
			} );
		}
	}, [ patternImporting ] );

	const thumbnailClass = classNames(
		'gutenkit-library-list-item-inner-content-thumbnail',
		{ 'is-loading': patternImporting }
	);
	const listItemClass = classNames( 'gutenkit-library-list-item', {
		'pro-inactive': pattern?.package === 'pro' && ! isProActive,
	} );
	const titleClass = classNames( 'gutenkit-library-list-item__title', {
		'is-premium': pattern?.package === 'pro',
	} );

	return (
		<div className={ listItemClass } key={ pattern?.ID }>
			<div className={ thumbnailClass }>
				<LazyImage src={ pattern?.thumbnail } alt={ pattern?.title } />
				<div className="gutenkit-library-list-item-inner-content-overlay">
					{ pattern?.package === 'pro' && isProActive && (
						<Button
							onClick={ async () => {
								setPatternImporting( true );
								await handlePatternImport( pattern );
								setPatternImporting( false );
							} }
							className="gutenkit-import-button"
							icon={
								patternImporting ? (
									<Spinner className="importing-spinner" />
								) : (
									<Download />
								)
							}
							disabled={ patternImporting ? true : false }
						>
							{ patternImporting
								? __( 'Importing', 'gutenkit-blocks-addon' )
								: __( 'Import', 'gutenkit-blocks-addon' ) }
						</Button>
					) }

					{ pattern?.package === 'pro' && ! isProActive && (
						<ExternalLink href="https://wpmet.com/plugin/gutenkit/">
							{ __(
								'Requires GutenKit Blocks PRO',
								'gutenkit-blocks-addon'
							) }
						</ExternalLink>
					) }

					{ pattern?.package === 'free' && status === 'Activated' && (
						<Button
							ref={ importButtonRef }
							onClick={ async () => {
								setPatternImporting( true );
								await handlePatternImport( pattern );
								setPatternImporting( false );
							} }
							className="gutenkit-import-button"
							icon={
								patternImporting ? (
									<Spinner className="importing-spinner" />
								) : (
									<Download />
								)
							}
							disabled={ patternImporting ? true : false }
						>
							{ patternImporting
								? __( 'Importing', 'gutenkit-blocks-addon' )
								: __( 'Import', 'gutenkit-blocks-addon' ) }
						</Button>
					) }
					{ pattern?.package === 'free' && status !== 'Activated' && (
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
							disabled={ patternImporting ? true : false }
						>
							{ __( `${ status }`, 'gutenkit-blocks-addon' ) }
						</Button>
					) }
				</div>
			</div>
			<div className={ titleClass }>
				<span className="item-title">{ pattern?.title }</span>
			</div>
		</div>
	);
}

export default Pattern;
