import { MinimalInputProps } from '../form-controls/inputs/BaseInput';
import { List } from '../table/List';
import { CommentFeatureBuilderConfig, getCommentsFeature } from './CommentModel';
import { Features } from '../feature/feature-models';
import { CSSProperties, useState } from 'react';
import { searchinize, t } from '../../utils';
import { SearchStringInput } from '../form-controls/inputs/SearchStringInput';
import { IComment } from '../../../models';
import { Claim } from '../../users/models/UserModel';
import { Button } from '../form-controls/Button';


type CommentsListProps = MinimalInputProps<IComment[]> & {
  style?: CSSProperties;
  onEditClicked: (comment: IComment) => void,
  onDeleteClicked: (comment: IComment) => void,
  onAddClicked: () => void;
  claim: Claim;
};


export const CommentList = ({value, onChange, claim, ...config}: CommentsListProps) => {
  const [needle, setNeedle] = useState<string>('');

  let data = value || [];
  if (needle) {
    data = data.filter(comment => {
      const commentStr = JSON.stringify({
        comment: comment.comment,
        createdBy: comment.createdBy,
        modifiedBy: comment.modifiedBy,
      });
      return searchinize(commentStr).includes(searchinize(needle));
    });
  }

  const commentsConfig: CommentFeatureBuilderConfig = {
    data: data,
    feature: Features.comments,
    onEditClicked: config.onEditClicked,
    onDeleteClicked: config.onDeleteClicked,
  };

  const feature = getCommentsFeature(commentsConfig);
  return (
    <>
      <div style={{display: 'flex', alignItems: 'start', whiteSpace: 'nowrap'}}>
        <Button claim={claim} variant="light" onClick={config.onAddClicked} icon="fa fa-plus">
          {t('comment.addComment')}
        </Button>
        <SearchStringInput value={needle} onChange={setNeedle} style={{marginLeft: 6}} />
      </div>
      {data.length ? (
        <List feature={feature} {...config} />
      ) : (
        <span style={{color: 'gray'}}>
          {needle ? t('comment.noResults') : t('comment.noComments')}
        </span>
      )}
    </>
  );
};
