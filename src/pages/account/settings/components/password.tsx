import React, { useRef } from 'react';
import { ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-form';
import { PASSWORD_PATTERN, VALIDATOR_MSG } from '../../../../../config/validate';
import { RuleObject } from 'rc-field-form/lib/interface';
const PasswordModal: React.FC<any> = (props: any) => {
  const formRef = useRef<
    ProFormInstance<{
      date: string;
    }>
  >();
  const samePwdCheck = (rule: RuleObject, value: any): void | Promise<any> => {
    let newPwd = formRef.current?.getFieldValue('newPassword');
    if (value === newPwd) {
      return Promise.resolve();
    } else {
      return Promise.reject(VALIDATOR_MSG.same_password);
    }
  };
  return (
    <ModalForm formRef={formRef} {...props}>
      <ProFormText.Password
        label="旧密码"
        rules={[
          {
            required: true,
            message: VALIDATOR_MSG.required,
          },
        ]}
        fieldProps={{
          visibilityToggle: false,
        }}
        width="md"
        name="oldPassword"
      />
      <ProFormText.Password
        label="新密码"
        rules={[
          {
            required: true,
            message: VALIDATOR_MSG.required,
          },
        ]}
        fieldProps={{
          visibilityToggle: false,
        }}
        width="md"
        name="newPassword"
      />
      <ProFormText.Password
        label="确认密码"
        rules={[
          {
            required: true,
          },
          {
            message: VALIDATOR_MSG.password,
            pattern: PASSWORD_PATTERN,
          },
          {
            validator: samePwdCheck,
          },
        ]}
        fieldProps={{
          visibilityToggle: false,
        }}
        width="md"
        name="confirmPassword"
      />
    </ModalForm>
  );
};

export default PasswordModal;
