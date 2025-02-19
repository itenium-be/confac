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
  note?: string
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
        note: editComment.comment
      }
    }
    else {
      updatedComments = {
        ...commentAndNote,
        comments: [editComment, ...commentAndNote.comments.filter(c => c.createdOn !== editComment.createdOn || c.createdBy !== editComment.createdBy)]
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
      updatedComments = {...commentAndNote, note: undefined}
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

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        variant={variant || 'outline-dark'}
        title={t('comment.addComment')}
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
                onChange={onChange}
                claim={claim}
                onAddClicked={() => handleAddComment()}
                onEditClicked={comment => handleEditComment(comment)}
                onDeleteClicked={comment => handleDeleteComment(comment)}
                value={value}
              />)

          }
        </Modal>
      )}
    </>
  );
};
