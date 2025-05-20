import { useSelector } from 'react-redux';
import { ConfacState } from '../../reducers/app-state';

type UserNameProps = {
  userId: string;
}

export const UserName = ({userId}: UserNameProps) => {
  const users = useSelector((state: ConfacState) => state.user.users);
  const user = users.find(u => u._id === userId);
  return <>{user ? user.alias : userId}</>;
};
