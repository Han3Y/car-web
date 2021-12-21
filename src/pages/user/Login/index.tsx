import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {Alert, Input, message, Space, Tabs} from 'antd';
import React, {useRef, useState} from 'react';
import ProForm, {ProFormCheckbox, ProFormFieldSet, ProFormInstance, ProFormText} from '@ant-design/pro-form';
import { useIntl, Link, history, FormattedMessage, SelectLang, useModel } from 'umi';
import {formLogin, login} from '@/services/ant-design-pro/api';
const md5 = require('md5');
import storage from 'good-storage'
import settings from '../../../../config/defaultSettings';

import styles from './index.less';
import {RuleObject} from "rc-field-form/lib/interface";
import {PASSWORD_PATTERN, PHONE_PATTERN, VALIDATOR_MSG} from "../../../../config/validate";
import {LoginDTO} from "@/pages/user/Login/beans/loginDTO";
import ResponseVO from "@/beans/global/httpResVO";

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

/**
 * 页面类型
 */
enum LoginPageType {
  ACCOUNT= 'account', // 账户登录
  REGISTER = 'register', // 注册
}

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  // @ts-ignore
  const [userLoginState, setUserLoginState] = useState<ResponseVO>({});
  const [type, setType] = useState<LoginPageType>(LoginPageType.ACCOUNT);
  const { initialState, setInitialState } = useModel('@@initialState');
  const formRef = useRef<ProFormInstance>();

  const intl = useIntl();


  const changeType = function (pageType: LoginPageType){
    setType(pageType);
  };

  const samePwdCheck = (rule: RuleObject, value: any): void | Promise<any> => {
    const newPwd = formRef.current?.getFieldValue('newPassword');
    if (value === newPwd) {
      return Promise.resolve();
    } else {
      return Promise.reject(VALIDATOR_MSG.same_password);
    }
  };

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
      if(type === LoginPageType.ACCOUNT){
        formData.append('userName', values.username as string);
        formData.append('password', md5('@12AQh#909' + md5(values.password)));
        // storage.set('user', {id: 'xxx', username: 'hjc'});
        // history.push( '/');
        // console.log('11111111111');
        // await fetchUserInfo();
        // return;
        const msg = await login(values as LoginDTO);
        // const msg = await formLogin(formData);
        console.log('msg', msg);
        if (msg.success === true) {
          const defaultLoginSuccessMessage = intl.formatMessage({
            id: 'pages.login.success',
            defaultMessage: '登录成功！',
          });
          message.success(defaultLoginSuccessMessage);
          storage.set('user', msg.data);
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
      }else if(type === LoginPageType.REGISTER){
        console.log(values);
      }

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
            formRef={formRef}
            submitter={{
              searchConfig: {
                submitText: type === LoginPageType.REGISTER ? '注册' : '登录',
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
                content={'账户或密码错误'}
              />
            )}
            {type === LoginPageType.ACCOUNT && (
              <>
                <ProFormText
                  name="username"
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
            {type === LoginPageType.REGISTER && (
              <>
                <ProFormText
                  name="userName"
                  fieldProps={{
                    size: 'large',
                  }}
                  placeholder="请输入用户名"
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名',
                    },
                  ]}
                />
                <ProFormText
                  name="phone"
                  fieldProps={{
                    size: 'large',
                    addonBefore: "+86",
                  }}
                  placeholder='请输入手机号'
                  rules={[
                    {
                      required: true,
                      message: '请输入手机号',
                    },
                    {
                      pattern: PHONE_PATTERN,
                      message: VALIDATOR_MSG.phone,
                    },
                  ]}
                />
                <ProFormText.Password
                  name="newPassword"
                  fieldProps={{
                    size: 'large',
                    visibilityToggle: false,
                  }}
                  placeholder="请输入密码"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码',
                    },
                    {
                      message: VALIDATOR_MSG.password,
                      pattern: PASSWORD_PATTERN,
                    },
                  ]}
                />
                <ProFormText.Password
                  name="rePassword"
                  fieldProps={{
                    size: 'large',
                    visibilityToggle: false,
                  }}
                  placeholder="请输入确认密码"
                  rules={[
                    {
                      validator: samePwdCheck,
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
          <div className={styles.changeType}>
            {
              type === LoginPageType.ACCOUNT && (
                <span style={{width: '100%'}} onClick={() => changeType(LoginPageType.REGISTER)}>注册账户</span>
              )
            }
            {
              type === LoginPageType.REGISTER && (
                <span onClick={() => changeType(LoginPageType.ACCOUNT)}>使用已有账户登录</span>
              )
            }
          </div>
        </div>
      </div>
      {/*<Footer />*/}
    </div>
  );
};

export default Login;
