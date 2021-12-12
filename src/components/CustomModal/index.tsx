import React from 'react';
import {
  LAYOUT_HORIZONTAL,
  LAYOUT_TYPE_HORIZONTAL,
  LONG_MODAL_WIDTH,
} from '../../../config/uiConfig';
import { VALIDATOR_MSG } from '../../../config/validate';

const CustomModalWrapper: React.FC<any> = (props: any) => {
  let newProps = {
    ...LAYOUT_TYPE_HORIZONTAL,
    layout: LAYOUT_HORIZONTAL,
    width: LONG_MODAL_WIDTH,
    modalProps: {
      wrapClassName: 'custom-form-modal',
    },
    validateMessages: VALIDATOR_MSG,
    ...props,
  };
  return React.cloneElement(props.children, newProps);
};

export default CustomModalWrapper;
