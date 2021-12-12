import { ListParamsDTO } from '@/beans/global/listParamsDTO';
import { HttpOptionsDTO } from '@/beans/global/httpOptionsDTO';
import { AntTablePageVO } from '@/beans/global/antTablePageVO';
import { DemoListVO } from '@/pages/demo/beans/demoListVO';
import { request } from '@@/plugin-request/request';
import ResponseVO from '@/beans/global/httpResVO';
import { ListPageVO } from '@/beans/global/listPageVO';
import { DemoDTO } from '@/pages/demo/beans/demoDTO';
import { DemoVO } from '@/pages/demo/beans/demoVO';

const DemoService = {
  /**
   * 列表请求-分页
   * @param params
   * @param options
   */
  async listByPage(
    params: ListParamsDTO,
    options?: HttpOptionsDTO,
  ): Promise<AntTablePageVO<DemoListVO>> {
    const res = await request<ResponseVO<ListPageVO<DemoListVO>>>('/receiver/list', {
      method: 'GET',
      params: {
        ...params,
        page: params.current,
      },
      ...(options || {}),
    });
    return {
      data: res.data.items,
      success: res.result,
      total: res?.data.total,
    };
  },
  /**
   * 新增
   * @param data
   * @param options
   */
  async add(data: DemoDTO, options?: HttpOptionsDTO): Promise<ResponseVO<any>> {
    return request<ResponseVO<any>>('/receiver', {
      method: 'POST',
      data,
      ...(options || {}),
    });
  },
  /**
   * 编辑
   * @param data
   * @param options
   */
  async edit(data: DemoDTO, options?: HttpOptionsDTO): Promise<ResponseVO<any>> {
    return request<ResponseVO<any>>('/receiver', {
      method: 'PUT',
      data,
      ...(options || {}),
    });
  },
  /**
   * 编辑时根据id获取信息
   * @param id
   */
  async getEditInfoById(id: string): Promise<ResponseVO<DemoDTO>> {
    return request<ResponseVO<DemoDTO>>('/receiver', {
      method: 'GET',
      params: {
        id,
      },
    });
  },
  /**
   * 查看时根据id获取信息
   * @param id
   */
  async getViewInfoById(id: string): Promise<ResponseVO<DemoVO>> {
    return request<ResponseVO<DemoVO>>('/receiver', {
      method: 'GET',
      params: {
        id,
      },
    });
  },
  /**
   * 根据id单个删除
   * @param id
   */
  async deleteById(id: string): Promise<ResponseVO<any>> {
    return request<ResponseVO<any>>('/receiver', {
      method: 'DELETE',
      data: {
        ids: [id],
      },
    });
  },
  /**
   * 批量删除
   * @param ids
   */
  async batchDelete(ids: string[]): Promise<ResponseVO<any>> {
    return request<ResponseVO<any>>('/receiver', {
      method: 'DELETE',
      data: {
        ids,
      },
    });
  },
};

export default DemoService;
