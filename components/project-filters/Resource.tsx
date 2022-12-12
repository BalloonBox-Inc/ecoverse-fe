import Select, { SelectAttributes } from '@components/layouts/Select';
import { selectResource, setResource } from '@plugins/store/slices/filter';
import { selectResources } from '@plugins/store/slices/projects';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function Resource() {
  const dispatch = useDispatch();

  const selectAttributes: SelectAttributes = {
    options: useSelector(selectResources),
    defaultSelected: useSelector(selectResource),
    name: 'resource',
    onChange: ({ target: { value } }) => {
      dispatch(setResource(value));
    },
    label: 'resource',
    onClearSelected: () => dispatch(setResource(undefined)),
  };

  return <Select {...selectAttributes} />;
}
