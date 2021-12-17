import React, {useEffect, useState} from 'react';
import {
  LAYOUT_HORIZONTAL,
  LAYOUT_TYPE_HORIZONTAL,
  LONG_MODAL_WIDTH,
} from '../../../config/uiConfig';
import { VALIDATOR_MSG } from '../../../config/validate';

const CustomModalWrapper: React.FC<any> = (props: any) => {
  const newProps = {
    ...LAYOUT_TYPE_HORIZONTAL,
    layout: LAYOUT_HORIZONTAL,
    width: LONG_MODAL_WIDTH,
    modalProps: {
      wrapClassName: 'custom-form-modal',
      afterClose: props.afterClose
    },
    validateMessages: VALIDATOR_MSG,
    ...props,
  };
  console.log(newProps)
  delete newProps.onVisibleSetter;
  delete newProps.afterClose;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (visible && props.onVisibleSetter) {
      props.onVisibleSetter(setVisible)
    }
  }, [visible]);

  return React.cloneElement(props.children, newProps);
};

export default CustomModalWrapper;
