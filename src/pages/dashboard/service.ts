import { request } from 'umi';
import type { ChartData } from './data';

export async function queryChartList(params: {
  count: number;
}): Promise<{ data: { list: ChartData[] } }> {
  console.log('Start request charts data');
  return request('/api/charts', {
    params,
  });
}
