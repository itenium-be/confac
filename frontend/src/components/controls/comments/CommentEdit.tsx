import { MinimalInputProps } from "../form-controls/inputs/BaseInput";
import { TextEditor } from "../form-controls/inputs/TextEditor";
import CommentModel from "./CommentModel";

type CommentEditProps = MinimalInputProps<CommentModel> & {
  value: CommentModel
};
export const CommentEdit =  ({onChange, value, ...props}: CommentEditProps) => {


  return (
    <TextEditor
      value={value.comment}
      onChange={text => {onChange({...value, comment: text})}}
    />)
}
