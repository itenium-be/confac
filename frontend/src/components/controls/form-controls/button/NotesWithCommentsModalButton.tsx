import {CSSProperties, useState} from 'react';
import {MinimalInputProps} from '../inputs/BaseInput';
import {Button} from '../Button';
import {Modal} from '../../Modal';
import {formatDate, t} from '../../../utils';
import {BootstrapVariant, IComment, IModelComments} from '../../../../models';
import {Claim} from '../../../users/models/UserModel';
import {authService} from '../../../users/authService';
import { CommentList } from '../../comments/CommentsList';
import { Icon } from '../../Icon';
import { TextEditor } from '../inputs/TextEditor';
import { useSelector } from 'react-redux';
import { ConfacState } from '../../../../reducers/app-state';


type NotesWithCommentsModalButtonProps = MinimalInputProps<IModelComments> & {
  title: string;
  variant?: BootstrapVariant;
  claim: Claim;
  includeBorder?: boolean;
  style?: CSSProperties;
  /**
   * True: the value.notes is displayed (as a text area)
   * False: the value.notes is not displayed (only comments array)
   */
  showNote: boolean;
};


export const NotesWithCommentsModalButton = ({claim, value, onChange, title, disabled, showNote, ...props}: NotesWithCommentsModalButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<IComment | null>(null);

  const commentAndNote = value || {comments: []};
  const showConfirmButton = !disabled && authService.getClaims().includes(claim);

  const handleAddComment = () => {
    const currentUser = authService.getUser()!;
    const newComment: IComment = {
      createdBy: currentUser._id,
      createdOn: new Date().toISOString(),
      comment: ''
    };

    setEditComment(newComment);
  };

  const handleEditComment = (comment: IComment) => {
    const currentUser = authService.getUser()!;
    const doNotSetModifiedWhenCreatedAgo = 1000 * 60 * 10; // 10 minutes
    const timePassedSinceCreation = new Date().valueOf() - new Date(comment.createdOn).valueOf();
    if (comment.createdBy === currentUser._id && timePassedSinceCreation < doNotSetModifiedWhenCreatedAgo) {
      setEditComment(comment);
      return;
    }

    setEditComment({...comment, modifiedBy: currentUser._id, modifiedOn: new Date().toISOString()});
  };

  const handleSaveEditedComment = () => {
    if (!editComment)
      return;

    const index = commentAndNote.comments
      .findIndex(c => c.createdOn === editComment.createdOn && c.createdBy === editComment.createdBy);

    const updatedComments: IModelComments = {
      ...commentAndNote,
      comments: (index !== -1 ?
        [...commentAndNote.comments.slice(0, index), editComment, ...commentAndNote.comments.slice(index + 1)] :
        [...commentAndNote.comments, editComment]
      )
    };

    onChange(updatedComments);
    setEditComment(null);
  };


  const handleDeleteComment = (deletedComment: IComment) => {
    const updatedComments: IModelComments = {
      ...commentAndNote,
      comments: commentAndNote.comments
        .filter(comment => comment.createdOn !== deletedComment.createdOn || comment.createdBy !== deletedComment.createdBy)
    };

    onChange(updatedComments);
  };

  return (
    <>
      <OpenModalButton
        includeBorder={props.includeBorder}
        variant={props.variant}
        style={props.style}
        setOpen={() => setOpen(!open)}
        commentAndNote={commentAndNote}
      />
      {open && (
        <Modal
          show
          onClose={() => editComment ? setEditComment(null) : setOpen(false)}
          onConfirm={showConfirmButton && editComment ? () => handleSaveEditedComment() : undefined}
          title={title}
          dialogClassName="comments-modal"
        >
          {showNote && !editComment && commentAndNote.note && (
            <>
              <TextEditor
                value={commentAndNote.note}
                onChange={value => onChange({...commentAndNote, note: value})}
              />
              <hr />
            </>
          )}
          {editComment ? (
            <TextEditor
              value={editComment.comment}
              onChange={value => setEditComment({...editComment, comment: value})}
            />
          ) : (
            <CommentList
              claim={claim}
              onChange={() => {}}
              onAddClicked={handleAddComment}
              onEditClicked={comment => handleEditComment(comment)}
              onDeleteClicked={comment => handleDeleteComment(comment)}
              value={commentAndNote.comments || []}
            />
          )}
        </Modal>
      )}
    </>
  );
};






type OpenModalButtonProps = {
  includeBorder?: boolean;
  variant?: BootstrapVariant;
  style?: CSSProperties;
  setOpen: () => void;
  commentAndNote: IModelComments;
}


const OpenModalButton = ({includeBorder, variant, style, setOpen, commentAndNote}: OpenModalButtonProps) => {
  const users = useSelector((state: ConfacState) => state.user.users);

  let tooltip = commentAndNote.note|| t('comment.addComment');
  if (commentAndNote.comments?.length) {
    const lastComment = commentAndNote.comments.at(-1)!;
    const userName = users.find(u => u._id === lastComment.createdBy)?.alias;
    if (userName) {
      tooltip = lastComment.comment + ' ' + t('comment.createdOn', {
        date: formatDate(lastComment.createdOn, 'DD/MM/YY'),
        hour: formatDate(lastComment.createdOn, 'H:mm'),
      }) + ` (${userName})`;
    }
  }

  const hasComment = commentAndNote?.note || commentAndNote?.comments?.length;
  const icon = hasComment ? 'far fa-comment-dots' : 'far fa-comment';

  if (includeBorder ?? true) {
    return (
      <Button
        onClick={setOpen}
        variant={variant || 'outline-dark'}
        title={tooltip}
        icon={icon}
        style={style}
        className="tst-add-note"
      />
    );
  }

  return (
    <Icon
      title={tooltip}
      size={2}
      style={style}
      onClick={setOpen}
      className="tst-add-note"
      fa={icon}
    />
  );
};
