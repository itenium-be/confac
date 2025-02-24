import { IComment } from "../../../models"
import { Claim } from "../../users/models/UserModel";
import { formatDate, t } from "../../utils";
import { Features, IFeature, IFeatureBuilderConfig } from "../feature/feature-models"
import { EditIcon } from "../Icon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { CommentsListFilters, IList, IListCell, ListFilters } from "../table/table-models";


import { features } from "../../../trans";
import moment from "moment";
import { authService } from "../../users/authService";

export default class CommentModel implements IComment
{
  createdBy: string;
  createdOn: string;
  modifiedBy?: string;
  modifiedOn?: string;
  comment: string;
  /**
  True: is a legacy note (of which there could be only one)
  False: is a new comment (of which there can be x)
  */
  isNote: boolean;


  constructor( obj: any = {}) {
    this.createdBy = obj.createdBy;
    this.createdOn = obj.createdOn;
    this.modifiedBy = obj.modifiedby;
    this.modifiedOn = obj.modifiedOn;
    this.comment = obj.comment;
    this.isNote = obj.isNote
  }

}


export type CommentFeatureBuilderConfig =  {
  feature: Features,
  data: CommentModel[];
  onEditClicked: (comment: CommentModel) => void,
  onDeleteClicked: (comment: CommentModel) => void,
};


const commentListConfig = (config: CommentFeatureBuilderConfig): IList<CommentModel, ListFilters> => {
  const cells: IListCell<CommentModel>[] = [{
    key: 'user',
    header: 'comment.user',
    value: comment => {
      if(comment.isNote)
        return null

      return (
      <>
        <strong>{comment.createdBy}</strong>
        <br />
        <small className="created-on">
              {t('comment.createdOn', {date: formatDate(comment.createdOn, 'DD/MM/YYYY'), hour: formatDate(comment.createdOn, 'H:mm')})}
              <br />
              {comment.modifiedOn &&
                t('comment.modifiedOn', {
                  date: formatDate(comment.modifiedOn, 'DD/MM/YYYY'),
                  hour: formatDate(comment.modifiedOn, 'H:mm'),
                  user: comment.modifiedBy,
                })
              }
        </small>
      </>)
    },
    style: {
      width: 150,
      maxWidth: 150,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
   }
  }, {
    key: 'comment',
    header: 'comment.text',
    value: comment => (
      <div dangerouslySetInnerHTML={{__html: comment.comment}} />
    ),
  }, {
    key: 'buttons',
    header: '',
    value: comment => (
      <>
      <EditIcon claim={claims => comment.isNote || userCanManageComment(claims, comment.createdBy)} onClick={() => config.onEditClicked(comment)} size={1}/>
      <DeleteIcon claim={claims => comment.isNote || userCanManageComment(claims, comment.createdBy)} onClick={() => config.onDeleteClicked(comment)} size={1} style={ {marginLeft: 6}}/>
      </>
    ),
    style: {width: 50},
  }
  ];


  return {
    rows: {
      cells,
    },
    data: config.data,
    sorter: (a, b) => {
      if(a.isNote) return -1
      if(b.isNote) return 1

      return moment(b.createdOn).valueOf() - moment(a.createdOn).valueOf()
    }
  };
};

const userCanManageComment = (claims: Claim[], commentAuthor: string): boolean => {
  const currentUser = authService.getUser()
  if(currentUser?._id === commentAuthor)
    return true

  return claims.includes(Claim.ManageComments)
}

export const getCommentsFeature = (config: CommentFeatureBuilderConfig): IFeature<CommentModel, CommentsListFilters> => {


  const feature: IFeature<CommentModel, CommentsListFilters> = {
    key: Features.comments,
    nav: m => '',
    trans: features.comments as any,
    list: commentListConfig( config),
  };

  return feature;
}
