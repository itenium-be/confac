
import { MinimalInputProps } from "../form-controls/inputs/BaseInput";
import { List } from "../table/List";
import CommentModel, { getCommentsFeature } from "./CommentModel";
import { Features } from "../feature/feature-models";


import { CSSProperties, useState } from "react";
import { NotesWithComments } from "../form-controls/button/NotesWithCommentsModalButton";
import { Claim } from "../../users/models/UserModel";
import { Button } from "react-bootstrap";
import { t } from "../../utils";
import { AddIcon } from "../Icon";
import { SearchStringInput } from "../form-controls/inputs/SearchStringInput";


type CommentsListProps = MinimalInputProps<CommentModel[]> & {
  claim?: Claim;
  style?: CSSProperties;
  onEditClicked: (comment: CommentModel) => void,
  onDeleteClicked: (comment: CommentModel) => void,
  onAddClicked: () => void;
};




export const CommentList = ({value, claim, ...config}: CommentsListProps) => {
  const [needle, setNeedle] = useState('');


  let data = value || [];
  if (needle) {
    value = data.filter(comment => {
      return comment.comment.toLocaleLowerCase().includes(needle.trim().toLocaleLowerCase());
    });
  }


  const feature = getCommentsFeature({
    data: data,
    feature: Features.comments,
    slug: 'test',
    claim,
    onEditClicked: config.onEditClicked,
    onDeleteClicked: config.onDeleteClicked,
    save: () => {},
    filters: {},
    setFilters: () => {},

  });


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

