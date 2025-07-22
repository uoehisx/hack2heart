import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const baseURL = process.env.REACT_APP_API_URL || '';
const axiosInstance = axios.create({ baseURL });

export async function axiosRequestServer<T = any>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  try {
    const response = await axiosInstance(config);
    return response;
  } catch (error) {
    // 필요시 에러 로깅
    throw error;
  }
}

// 사용 예시:
// import { axiosRequest } from './utils/axiosUtil';
// const res = await axiosRequest({ method: 'POST', url: 'http://localhost:4000/api/auth', data: {...} });
