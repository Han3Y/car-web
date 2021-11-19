/**
 * http响应格式
 */
type ResponseVO<T> = {
  result: boolean;
  data: T;
  msg: string;
  kind: any;
};
export default ResponseVO;
