import Select, { SelectAttributes } from '@components/layouts/Select';
import {
  selectAllStatus,
  selectStatus,
  setStatus,
} from '@plugins/store/slices/projects';
import { useDispatch, useSelector } from 'react-redux';

export function Status() {
  const dispatch = useDispatch();

  const selectAttributes: SelectAttributes = {
    options: useSelector(selectAllStatus),
    defaultSelected: useSelector(selectStatus),
    name: 'status',
    onChange: ({ target: { value } }) => {
      dispatch(setStatus(value));
    },
    label: 'status',
  };

  return <Select {...selectAttributes} />;
}
