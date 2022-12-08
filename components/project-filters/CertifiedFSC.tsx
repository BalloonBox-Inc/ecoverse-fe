import Select, { SelectAttributes } from '@components/layouts/Select';
import {
  selectAllCertifiedFSC,
  selectCertifiedFCS,
  setCertifiedFSC,
} from '@plugins/store/slices/projects';
import { useDispatch, useSelector } from 'react-redux';

const booleanEquivalent = {
  true: true,
  false: false,
};

export function CertifiedFSC() {
  const dispatch = useDispatch();

  const selectAttributes: SelectAttributes = {
    options: useSelector(selectAllCertifiedFSC).map((item: boolean) =>
      item.toString()
    ),
    defaultSelected: useSelector(selectCertifiedFCS)?.toString(),
    name: 'certifiedFSC',
    onChange: ({ target: { value } }) => {
      dispatch(
        setCertifiedFSC(
          booleanEquivalent[value as keyof typeof booleanEquivalent]
        )
      );
    },
    label: 'FSC certification',
    onClearSelected: () => dispatch(setCertifiedFSC(undefined)),
  };

  return <Select {...selectAttributes} />;
}
