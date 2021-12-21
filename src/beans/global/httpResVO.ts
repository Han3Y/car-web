/**
 * http响应格式
 */
type ResponseVO<T> = {
  success: boolean;
  data: T;
  msg: string;
  kind: any;
};
export default ResponseVO;
