import {IComment} from '../../../models';
import {Claim} from '../../users/models/UserModel';
import {formatDate, t} from '../../utils';
import {Features, IFeature} from '../feature/feature-models';
import {EditIcon} from '../Icon';
import {DeleteIcon} from '../icons/DeleteIcon';
import {CommentsListFilters, IList, IListCell, ListFilters} from '../table/table-models';
import {features} from '../../../trans';
import moment from 'moment';
import {authService} from '../../users/authService';
import {UserName} from '../../users/UserName';


export type CommentFeatureBuilderConfig = {
  feature: Features;
  data: IComment[];
  onEditClicked: (comment: IComment) => void;
  onDeleteClicked: (comment: IComment) => void;
};


const commentListConfig = (config: CommentFeatureBuilderConfig): IList<IComment, ListFilters> => {
  const cells: IListCell<IComment>[] = [{
    key: 'user',
    header: 'comment.user',
    value: comment => {
      return (
        <>
          <strong><UserName userId={comment.createdBy} /></strong>
          <br />
          <small className="created-on">
            {t('comment.createdOn', {
              date: formatDate(comment.createdOn, 'DD/MM/YY'),
              hour: formatDate(comment.createdOn, 'H:mm'),
            })}
            <br />
            {comment.modifiedOn && (
              <>
                {t('comment.modifiedOn', {
                  date: formatDate(comment.modifiedOn, 'DD/MM/YY'),
                  hour: formatDate(comment.modifiedOn, 'H:mm'),
                })}
                &nbsp;
                <UserName userId={comment.modifiedBy!} />
              </>
            )}
          </small>
        </>
      );
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
        <EditIcon
          claim={claims => userCanManageComment(claims, comment.createdBy)}
          onClick={() => config.onEditClicked(comment)}
          size={1}
        />
        <DeleteIcon
          claim={claims => userCanManageComment(claims, comment.createdBy)}
          onClick={() => config.onDeleteClicked(comment)}
          size={1}
          style={{marginLeft: 6}}
        />
      </>
    ),
    style: {width: 50},
  }];

  return {
    rows: {
      cells,
    },
    data: config.data,
    sorter: (a, b) => {
      return moment(b.createdOn).valueOf() - moment(a.createdOn).valueOf();
    }
  };
};

const userCanManageComment = (claims: Claim[], commentAuthor: string): boolean => {
  const currentUser = authService.getUser();
  if (currentUser?._id === commentAuthor)
    return true;

  return claims.includes(Claim.ManageComments);
};

export const getCommentsFeature = (config: CommentFeatureBuilderConfig): IFeature<IComment, CommentsListFilters> => {
  const feature: IFeature<IComment, CommentsListFilters> = {
    key: Features.comments,
    nav: _m => '',
    trans: features.comments as any,
    list: commentListConfig(config),
  };

  return feature;
};
