import { get } from '@/axios'
const BASE_URL = process.env.BASE_URL

// 获取Mock数据
export const GET_MOCK_CONF = () => get(BASE_URL + 'mockConf.json')
