import Select, { SelectAttributes } from '@components/layouts/Select';
import { selectCountry, setCountry } from '@plugins/store/slices/filter';
import { selectCountries } from '@plugins/store/slices/projects';
import { useDispatch, useSelector } from 'react-redux';

export function Country() {
  const dispatch = useDispatch();

  const selectAttributes: SelectAttributes = {
    options: useSelector(selectCountries),
    defaultSelected: useSelector(selectCountry),
    name: 'country',
    onChange: ({ target: { value } }) => {
      dispatch(setCountry(value));
    },
    label: 'country',
    onClearSelected: () => dispatch(setCountry(undefined)),
  };

  return <Select {...selectAttributes} />;
}
