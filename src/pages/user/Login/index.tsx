import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, Link, history, FormattedMessage, SelectLang, useModel } from 'umi';
import { login } from '@/services/ant-design-pro/api';
const md5 = require('md5');
import settings from '../../../../config/defaultSettings';

import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  // @ts-ignore
  const [userLoginState, setUserLoginState] = useState<API.ResponseData>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitting(true);
    try {
      // 登录
      const formData = new FormData();
      formData.append('userName', values.userName as string);
      formData.append('password', md5('@12AQh#909' + md5(values.password)));
      const msg = await login(formData);
      console.log('msg', msg);
      if (msg.result === true) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });

      message.error(defaultLoginFailureMessage);
    }
    setSubmitting(false);
  };
  const { result } = userLoginState;

  return (
    <div className={styles.container}>
      {/*<div className={styles.lang} data-lang>*/}
      {/*  {SelectLang && <SelectLang />}*/}
      {/*</div>*/}
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <img alt="logo" className={styles.logo} src="/logo.svg" />
            <span className={styles.title}>{settings.title}</span>
          </div>
          {/*<div className={styles.desc}>*/}
          {/*  描述*/}
          {/*</div>*/}
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'pages.login.submit',
                  defaultMessage: '登录',
                }),
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              await handleSubmit(values as API.LoginParams);
            }}
          >
            {/*<Tabs activeKey={type} onChange={setType}>*/}
            {/*  <Tabs.TabPane*/}
            {/*    key="account"*/}
            {/*    tab={intl.formatMessage({*/}
            {/*      id: 'pages.login.accountLogin.tab',*/}
            {/*      defaultMessage: '账户密码登录',*/}
            {/*    })}*/}
            {/*  />*/}
            {/*</Tabs>*/}

            {result === false && (
              <LoginMessage
                content={intl.formatMessage({
                  id: 'pages.login.accountLogin.errorMessage',
                  defaultMessage: '账户或密码错误(admin/ant.design)',
                })}
              />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="userName"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder="请输入用户名"
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.username.required"
                          defaultMessage="请输入用户名!"
                        />
                      ),
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder="请输入密码"
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.password.required"
                          defaultMessage="请输入密码！"
                        />
                      ),
                    },
                  ]}
                />
              </>
            )}
            {/*<div*/}
            {/*  style={{*/}
            {/*    marginBottom: 24,*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <ProFormCheckbox noStyle name="autoLogin">*/}
            {/*    <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />*/}
            {/*  </ProFormCheckbox>*/}
            {/*  <a*/}
            {/*    style={{*/}
            {/*      float: 'right',*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />*/}
            {/*  </a>*/}
            {/*</div>*/}
          </ProForm>
        </div>
      </div>
      {/*<Footer />*/}
    </div>
  );
};

export default Login;
