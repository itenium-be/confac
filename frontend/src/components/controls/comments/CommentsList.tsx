
import { MinimalInputProps } from "../form-controls/inputs/BaseInput";
import { List } from "../table/List";
import CommentModel, { getCommentsFeature } from "./CommentModel";
import { Features } from "../feature/feature-models";


import { CSSProperties } from "react";
import { NotesWithComments } from "../form-controls/button/NotesWithCommentsModalButton";
import { Claim } from "../../users/models/UserModel";
import { Button } from "react-bootstrap";
import { t } from "../../utils";
import { AddIcon } from "../Icon";


type CommentsListProps = MinimalInputProps<NotesWithComments> & {
  claim?: Claim;
  style?: CSSProperties;
  onEditClicked: (comment: CommentModel) => void,
  onDeleteClicked: (comment: CommentModel) => void,
  onAddClicked: () => void;
};




export const CommentList = ({onChange, value, claim, ...config}: CommentsListProps) => {

  let data = value?.comments?.map(comment => ({...comment, isNote: false})) || [];
  if(value?.note)
    data.push({
      createdBy: '',
      createdOn: new Date().toISOString(),
      comment: value.note,
      isNote: true
    })


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
      <Button variant="light" onClick={config.onAddClicked} icon="fa fa-plus">
        <AddIcon fa="fa fa-plus" size={1} style={ {marginRight: 6}}/>
        {t('comment.addComment')}
      </Button>
      <List
        feature={feature}
        {...config}
      />
    </>)
}

