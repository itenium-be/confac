import {CSSProperties, useState} from 'react';
import {MinimalInputProps} from '../inputs/BaseInput';
import {Button} from '../Button';
import {Modal} from '../../Modal';
import {t} from '../../../utils';
import {BootstrapVariant, IComment} from '../../../../models';
import {Claim} from '../../../users/models/UserModel';
import {authService} from '../../../users/authService';
import { CommentList } from '../../comments/CommentsList';
import CommentModel from '../../comments/CommentModel';
import { CommentEdit } from '../../comments/CommentEdit';


export type NotesWithComments = {
  comments: IComment[],
  note?: string,
  notes?: string
}

type NotesWithCommentsModalButtonProps = MinimalInputProps<NotesWithComments> & {
  title: string;
  variant?: BootstrapVariant;
  claim?: Claim;
  style?: CSSProperties;
};


export const NotesWithCommentsModalButton = ({claim, value, onChange, title, variant, disabled, style}: NotesWithCommentsModalButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const [editComment, setEditComment] = useState<CommentModel | null>(null);
  const [commentAndNote, setCommentsAndNote] = useState<NotesWithComments>(value || {comments: []})



  const icon = (!value?.note && !value?.comments?.length) ? 'far fa-comment' : 'far fa-comment-dots';
  const showConfirm = !disabled && (!claim || (claim && authService.getClaims().includes(claim)));

  const handleAddComment = () => {
    const currentUser = authService.getUser();
    if(!currentUser){
      return
    }
    const newComment: IComment = {
      createdBy: currentUser._id,
      createdOn: new Date().toISOString(),
      comment: ''
    }


    setEditComment({...newComment, isNote: false})
  }

  const handleEditComment = (comment: CommentModel) => {
    const currentUser = authService.getUser();
    if(!currentUser){
      return
    }

    setEditComment({...comment, modifiedBy: currentUser._id, modifiedOn: new Date().toISOString()})
  }

  const handleSaveEditedComment = () => {

    if(!editComment)
      return

    let updatedComments;
    if(editComment.isNote) {
      updatedComments = {
        ...commentAndNote,
        note: editComment.comment,
        notes: editComment.comment
      }
    }
    else {
      const index = commentAndNote.comments.findIndex(c => c.createdOn === editComment.createdOn && c.createdBy === editComment.createdBy);

      updatedComments = {
        ...commentAndNote,
        comments: (index !== -1 ?
          [...commentAndNote.comments.slice(0, index), editComment, ...commentAndNote.comments.slice(index + 1)] :
          [...commentAndNote.comments, editComment])
      }
    }
    setCommentsAndNote(updatedComments)
    onChange(updatedComments)
    setEditComment(null)
  }


  const handleDeleteComment = (deletedComment: CommentModel) => {
    let updatedComments;

    if(deletedComment.isNote)
    {
      updatedComments = {...commentAndNote, note: undefined, notes: undefined}
    }
    else
    {
      updatedComments = {
        ...commentAndNote,
        comments: commentAndNote.comments.filter(comment => comment.createdOn !== deletedComment.createdOn || comment.createdBy !== deletedComment.createdBy)
      }
    }

    setCommentsAndNote(updatedComments)
    onChange(updatedComments)
  };

  const handleDiscardEditComment = () => {
    setEditComment(null)
  }

  let text;
  if(!text && commentAndNote?.note) text = commentAndNote.note;
  if(!text && commentAndNote?.notes) text = commentAndNote.notes;
  if(!text && commentAndNote.comments.length) text = commentAndNote.comments.at(-1)?.comment

  let data = commentAndNote?.comments?.map(comment => ({...comment, isNote: false})) || [];
  if(commentAndNote?.note) {
    data.push({
      createdBy: '',
      createdOn: new Date().toISOString(),
      comment: commentAndNote.note,
      isNote: true
    })
  }
  else if(commentAndNote?.notes) {
    data.push({
      createdBy: '',
      createdOn: new Date().toISOString(),
      comment: commentAndNote.notes,
      isNote: true
    })
  }

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        variant={variant || 'outline-dark'}
        title={text || t('comment.addComment')}
        icon={icon}
        style={style}
        className="tst-add-note"
      />
      {open && (
        <Modal
          show
          onClose={() => editComment ? handleDiscardEditComment() : setOpen(false)}
          onConfirm={showConfirm && editComment ? () =>  handleSaveEditedComment() : undefined }
          title={title}
          dialogClassName="comments-modal"
        >
          { editComment ? (
              <CommentEdit
                value={editComment}
                onChange={value => setEditComment(value)}
              />
            ) : (
              <CommentList
                onChange={() => {}}
                claim={claim}
                onAddClicked={() => handleAddComment()}
                onEditClicked={comment => handleEditComment(comment)}
                onDeleteClicked={comment => handleDeleteComment(comment)}
                value={data}
              />)

          }
        </Modal>
      )}
    </>
  );
};
