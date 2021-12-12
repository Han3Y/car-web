import { RuleObject } from 'rc-field-form/lib/interface';

/**
 * 名称校验
 */
export const NAME_PATTERN = /^[\u4e00-\u9fa5_a-zA-Z0-9-_+]+$/;

/**
 * 手机号校验
 */
export const PHONE_PATTERN = /^1(3[0-9]|4[579]|5[0-35-9]|6[6]|7[0135-8]|8[0-9]|9[89])\d{8}$/;

/**
 * 密码强度
 */
export const PASSWORD_PATTERN =
  /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@#$%^&*_])[0-9a-zA-Z!@#$%^&*_+\(\)]{8,16}$/;

/**
 * 校验提示语
 */
export const VALIDATOR_MSG = {
  required: '请输入',
  name: '输入不合法',
  int: '请输入整数',
  ip: '请输入正确IP',
  ip_scope: '请输入正确IP范围',
  net_mask: '请输入正确子网掩码',
  port: '请输入正确端口',
  port_scope: '请输入正确端口范围',
  mac: '请输入正确MAC地址',
  password: '长度至少8位，需含有数字、字母、特殊字符',
  same_password: '两次输入的密码不同',
  range: '请输入范围内数值',
  password_red: '8-16位,只能用数字、小写字母、大写字母、特殊字符两种及以上组合',
  required_pwd: '请输入密码',
  hex: '请输入正确的十六进制数',
  phone: '请输入正确手机号',
};

/**
 * 整数校验
 */
export const INT_VALIDATOR = (rule: RuleObject, value: any): void | Promise<any> => {
  if (value !== 0 && !value) {
    return Promise.resolve();
  }
  const pass = /^\d+$/.test(value);
  if (!pass) {
    return Promise.reject(VALIDATOR_MSG.int);
  } else {
    return Promise.resolve();
  }
};
