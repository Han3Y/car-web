import {ListParamsDTO} from "@/beans/global/listParamsDTO";
import {HttpOptionsDTO} from "@/beans/global/httpOptionsDTO";
import {AntTablePageVO} from "@/beans/global/antTablePageVO";
import {request} from "@@/plugin-request/request";
import ResponseVO from "@/beans/global/httpResVO";
import {ListPageVO} from "@/beans/global/listPageVO";
import {PortAsset} from "@/pages/penetration/port/beans/portAsset";


/**
 * 端口扫描相关接口
 */
const PortScanService = {
  /**
   * 端口资产列表
   * @param params
   * @param options
   */
  async listByPage(
    params: ListParamsDTO,
    options?: HttpOptionsDTO,
  ): Promise<AntTablePageVO<PortAsset>> {
    // const res = await request<ResponseVO<ListPageVO<PortAsset>>>('/receiver/list', {
    //   method: 'GET',
    //   params: {
    //     ...params,
    //     page: params.current,
    //   },
    //   ...(options || {}),
    // });
    // return {
    //   data: res.data.items,
    //   success: res.success,
    //   total: res?.data.total,
    // };
    return {
      data: [
        {
          CPE: [
            'cpe:/a:openbsd:openssh:7.6p1',
            'cpe:/o:canonical:ubuntu_linux',
            'cpe:/o:linux:linux_kernel'
          ],
          Host: '192.168.1.193',
          IPInteger: 1,
          Port: 22,
          Proto: 'tcp',
          ServiceType: 'linux_kernel[*]/openssh[7.6p1]/ubuntu_linux[*]',
          State: 'open',
          Reason: '',
          Fingerprint: '"SSH-2.0-OpenSSH_7.6p1 Ubuntu-4ubuntu0.5\\r\\n"',
          HtmlTitle: '',
          Id: 123,
          CreatedAt: Date.now() / 1000,
          UpdatedAt: Date.now() / 1000,
        }
      ],
      success: true,
      total: 1,
    };
  }
};

export default PortScanService;

