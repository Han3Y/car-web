import React  from 'react';
import {ModalForm, ProFormText} from "@ant-design/pro-form";
import { NAME_PATTERN, VALIDATOR_MSG} from "../../../../config/validate";
const DemoEditModal: React.FC<any>= (props: any) => {
  return (
    <ModalForm
      {...props}>
      <ProFormText
        label="名称"
        rules={[
          {
            required: true,
          },
          {
            message: VALIDATOR_MSG.name,
            pattern: NAME_PATTERN,
          },
        ]}
        width="md"
        name="name"
      />
    </ModalForm>
  );
}

export default DemoEditModal;
