import useContextLibrary from '../../hooks/useContextLibrary';
import { __ } from '@wordpress/i18n';
import Template from './Template';
import Empty from '../common/Empty';
import FavoriteCount from '../common/FavoriteCount';
import useTemplateQuery from '@/template-library/hooks/useTemplateQuery';
import ContentLoader from '../common/ContentLoader';

const Templates = () => {
	const { searchInput, } = useContextLibrary();
	const { loading, loadMoreRef, templates, hasMore } = useTemplateQuery();
	return (
		<div className="gutenkit-library-list gutenkit-template">
			<div className="gutenkit-library-list__header">
				<h2 className="gutenkit-library-list__title">{__('Template Kits', 'gutenkit-blocks-addon')}</h2>
				<FavoriteCount count={6} />
			</div>
			{
				templates && templates.length === 0 && loading ? (
					<ContentLoader type='templates' />
				) : (
					<ul className="gutenkit-library-list__items">
						{
							templates && templates.map((template, index) => (
								<Template key={template?.ID} template={template} />
							))
						}
					</ul>
				)
			}
			{hasMore && <button className="has-more-data" ref={loadMoreRef}></button>}
			{((templates && templates.length === 0 && searchInput !== '')) && <Empty />}
		</div>
	)
}

export default Templates;