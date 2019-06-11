import request from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export function posts(params) {
  return request({
    url: '/posts',
    method: 'get',
    params,
  });
}
