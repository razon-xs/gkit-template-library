import { memo } from '@wordpress/element';
import useContextLibrary from '../../hooks/useContextLibrary';
import { __ } from '@wordpress/i18n';
import LazyImage from '../LazyImage';
import classNames from 'classnames';

const Template = ( { template } ) => {
	const { dispatch } = useContextLibrary();
	const handleTemplete = () => {
		dispatch( {
			type: 'SET_SINGLE_TEMPLATE',
			singleTemplate: template,
		} );

		dispatch( {
			type: 'SET_IS_SINGLE_PAGE',
			showSinglePage: true,
		} );
	};
	const thumbnailClass = classNames(
		'gutenkit-library-list-item-inner-content-thumbnail'
	);
	const titleClass = classNames( 'gutenkit-library-list-item__title', {
		'is-premium': template?.package === 'pro',
	} );

	return (
		<li
			key={ template?.ID }
			className="gutenkit-library-list-item"
			onClick={ handleTemplete }
		>
			<div className={ thumbnailClass }>
				<LazyImage
					src={ template?.thumbnail }
					alt={ template?.title }
				/>
			</div>

			<div className="list-item-title-flex">
				<div className={ titleClass }>
					<div className="item-title">{ template?.title }</div>
					{ template?.count && (
						<span className="counter">
							{ template?.count } Pages
						</span>
					) }
				</div>
				<button className="favorite-icon" style={ { opacity: 0 } }>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="38"
						height="38"
						viewBox="0 0 38 38"
						fill="none"
					>
						<rect
							x="0.5"
							y="0.5"
							width="37"
							height="37"
							rx="18.5"
							fill="white"
							stroke="#EEEFF4"
						/>
						<path
							d="M24.9701 12.7953C22.8247 11.4794 20.9523 12.0097 19.8275 12.8544C19.3662 13.2008 19.1357 13.3739 19 13.3739C18.8643 13.3739 18.6338 13.2008 18.1725 12.8544C17.0477 12.0097 15.1753 11.4794 13.03 12.7953C10.2145 14.5224 9.57738 20.2199 16.0716 25.0267C17.3086 25.9422 17.927 26.4 19 26.4C20.073 26.4 20.6914 25.9422 21.9284 25.0267C28.4226 20.2199 27.7855 14.5224 24.9701 12.7953Z"
							stroke="#111722"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</svg>
				</button>
			</div>
		</li>
	);
};

export default memo( Template );
