import React from 'react';
import { history } from 'umi';
import { useModel } from '@@/plugin-model/useModel';

const Home: React.FC<any> = (props: any) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const goDetail = () => {
    history.push('/demo');
  };
  return (
    <>
      <button onClick={goDetail}>测试</button>
    </>
  );
};

export default Home;
