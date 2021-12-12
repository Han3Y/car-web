import { request } from 'umi';
import type { CurrentUser, GeographicItemType } from './data';
import { PasswordDTO } from '@/pages/account/settings/beans/passwordDTO';
import { HttpOptionsDTO } from '@/beans/global/httpOptionsDTO';
import ResponseVO from '@/beans/global/httpResVO';

const city = require('./geographic/city.json');
const province = require('./geographic/province.json');

export async function queryCurrent(): Promise<{ data: CurrentUser }> {
  return request('/api/accountSettingCurrentUser');
}

/**
 * 获取省
 */
export async function queryProvince(): Promise<{ data: GeographicItemType[] }> {
  return Promise.resolve({ data: province });
}

/**
 * 获取市
 * @param province
 */
export async function queryCity(province: string): Promise<{ data: GeographicItemType[] }> {
  return Promise.resolve({ data: city[province] });
}

export async function query() {
  return request('/api/users');
}

/**
 * 修改密码
 * @param data
 * @param options
 */
export async function changePassword(
  data: PasswordDTO,
  options?: HttpOptionsDTO,
): Promise<ResponseVO<any>> {
  return request<ResponseVO<any>>('/receiver', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
