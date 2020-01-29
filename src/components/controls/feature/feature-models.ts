import {IList, ListFilters} from '../table/table-models';


export interface IFeature<TModel, TFilterModel extends ListFilters = {}> {
  /**
   * Unique key that matches the keys in the store
   * */
  key: string;
  /**
   * Used for routing:
   * return /${key}/:slug
   */
  nav: (m: TModel | 'create') => string;
  /** Translations */
  trans: IFeatureTranslations<TModel>;
  /**
   * A simple table with filters and action buttons
   * */
  list: IList<TModel, TFilterModel>;
}

export interface IFeatureTranslations<TModel> {
  /** "Entity" */
  title: string;
  listTitle: string;
  /** "New Entity" */
  createNew: string;
  /** Translations for each model property */
  props: TModel;
}
