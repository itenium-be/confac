import {IList, ListFilters} from '../table/table-models';

export enum Features {
  invoices = 'invoices',
  clients = 'clients',
  consultants = 'consultants',
  projects = 'projects',
  projectMonths = 'projectMonths',
  users = 'users',
  roles = 'roles',
  comments = 'comments'
}


export interface IFeature<TModel, TFilterModel extends ListFilters = {}> {
  /**
   * Unique key that matches the keys in the store
   * */
  key: Features;
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


export interface IFeatureBuilderConfig<TModel, TFilters extends ListFilters> {
  data: TModel[];
  save: (model: TModel, stayOnPage?: boolean) => void;
  filters: TFilters;
  setFilters: (f: TFilters) => void;
}
