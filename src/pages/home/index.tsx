import React from 'react';
import { history, Link } from 'umi';
import { useModel } from '@@/plugin-model/useModel';
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card, List, Typography} from "antd";
import styles from './style.less';

type cardVO = {
  path: string;
  img: string;
  title: string;
  description: string;
}

const cardList: cardVO[] = [
  {
    title: '零部件安全检查子系统',
    img: '/img/home/part.svg',
    description: '描述',
    path: '/tbox'
  },
  {
    title: '漏洞库',
    img: '/img/home/vul.svg',
    description: '描述',
    path: '/vul'
  },
  {
    title: '渗透测试工具集',
    img: '/img/home/test.svg',
    description: '描述',
    path: '/baseline'
  },
  {
    title: '车外通信协议安全检测工具',
    img: '/img/home/protocol.svg',
    description: '描述',
    path: '/cellular'
  }
];

const Home: React.FC<any> = (props: any) => {
  return (
    <PageContainer>
      <div className={styles.cardList}>
        <List<cardVO>
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={cardList}
          renderItem={(item) => {
            if (item && item.path) {
              return (
                <List.Item key={item.path}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[<Link to={item.path}>开始</Link>]}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={item.img} />}
                      title={<a>{item.title}</a>}
                      description={
                        <Typography.Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                          {item.description}
                        </Typography.Paragraph>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }
            return (
              <List.Item>
              </List.Item>
            );
          }}
        >

        </List>
      </div>

    </PageContainer>
  );
};

export default Home;
