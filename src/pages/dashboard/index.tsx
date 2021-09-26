import { Card, Col, Row } from 'antd';
import { useRequest } from 'umi';
import type { FC } from 'react';

import crossfilter from 'crossfilter2';
import * as d3 from 'd3';
import { BarChart, PieChart, ChartContext } from '@gaohangdy/react-dc-js';

import { GridContent } from '@ant-design/pro-layout';
import { queryChartList } from './service';
// import styles from './style.less';

const Dashboard: FC = () => {
  // const { loading, data } = useRequest(queryTags);

  const { data, loading } = useRequest(() => {
    return queryChartList({
      count: 8,
    });
  });

  if (loading) {
    return <div>loading...</div>;
  }

  // const numberFormat = d3.format('.2f');
  const dateFormatSpecifier = '%m/%d/%Y';
  const dateFormatParser = d3.timeParse(dateFormatSpecifier);
  data?.list.forEach((d) => {
    d.dd = dateFormatParser(d.date);
    d.month = d3.timeMonth(d.dd); // pre-calculate month for better performance
    d.close = +d.close; // coerce to number
    d.open = +d.open;
  });
  const cx = crossfilter(data?.list);

  const moveMonths = cx.dimension((d) => d.month);
  const volumeByMonthGroup = moveMonths.group().reduceSum((d) => d.volume / 500000);

  const gainOrLoss = cx.dimension((d) => (d.open > d.close ? 'Loss' : 'Gain'));
  const gainOrLossGroup = gainOrLoss.group();

  return (
    <ChartContext>
      <GridContent>
        <>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
              <Card
                title="热门搜索"
                loading={loading}
                bordered={false}
                bodyStyle={{ overflow: 'hidden' }}
              >
                <PieChart
                  dimension={gainOrLoss}
                  group={gainOrLossGroup}
                  // width={180}
                  // height={180}
                  radius={80}
                />
              </Card>
            </Col>
            <Col xl={12} lg={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
              <Card
                title="资源剩余"
                bodyStyle={{ textAlign: 'center', fontSize: 0 }}
                bordered={false}
              >
                <BarChart
                  id="testing"
                  dimension={moveMonths}
                  group={volumeByMonthGroup}
                  // width={990}
                  // height={180}
                  radius={80}
                  centerBar={true}
                  gap={1}
                  x={d3.scaleTime().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)])}
                  round={d3.timeMonth.round}
                  alwaysUseRounding={true}
                  xUnits={d3.timeMonths}
                />
              </Card>
            </Col>
          </Row>
        </>
      </GridContent>
    </ChartContext>
  );
};

export default Dashboard;
