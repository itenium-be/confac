
import { MinimalInputProps } from "../form-controls/inputs/BaseInput";
import { List } from "../table/List";
import CommentModel, { CommentFeatureBuilderConfig, getCommentsFeature } from "./CommentModel";
import { Features } from "../feature/feature-models";


import { CSSProperties, useState } from "react";
import { Button } from "react-bootstrap";
import { searchinize, t } from "../../utils";
import { AddIcon } from "../Icon";
import { SearchStringInput } from "../form-controls/inputs/SearchStringInput";


type CommentsListProps = MinimalInputProps<CommentModel[]> & {
  style?: CSSProperties;
  onEditClicked: (comment: CommentModel) => void,
  onDeleteClicked: (comment: CommentModel) => void,
  onAddClicked: () => void;
};




export const CommentList = ({value, onChange, ...config}: CommentsListProps) => {
  const [needle, setNeedle] = useState<string| undefined>('');

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
      <div style={{ display: 'flex', alignItems: 'start', whiteSpace: 'nowrap'}}>
        <Button variant="light" onClick={config.onAddClicked} icon="fa fa-plus">
          <AddIcon fa="fa fa-plus" size={1} style={ {marginRight: 6}}/>
          {t('comment.addComment')}
        </Button>
        <SearchStringInput value={needle} onChange={setNeedle} style={ { marginLeft: 6}} />
      </div>
      {
        data.length ? (
        <List
          feature={feature}
          {...config}
        />) : (<span style={ {color: 'gray'}}>{needle ? t('comment.noResults') : t('comment.noComments')}</span>)
      }
    </>)
}

