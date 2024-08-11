import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * BaseApiService class for making API requests.
 */
export class BaseApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api', // Adjust this to your API URL
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          // Handle unauthorized access (e.g., redirect to login)
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * 发起 GET 请求
   * @param url 请求的 URL
   * @param config 请求的配置项
   * @returns 返回一个 Promise，包含请求的结果数据
   * @template T 请求结果的数据类型，默认为 any
   */
  protected get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.get<T, AxiosResponse<T>>(url, config).then(response => response.data);
  }

  /**
   * 发起 POST 请求
   * @param url 请求的 URL
   * @param data 请求的数据
   * @param config 请求的配置项
   * @returns 返回一个 Promise，包含请求的结果数据
   * @template T 请求结果的数据类型，默认为 any
   */
  protected post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.post<T, AxiosResponse<T>>(url, data, config).then(response => response.data);
  }

  /**
   * 发起 PUT 请求
   * @param url 请求的 URL
   * @param data 请求的数据
   * @param config 请求的配置项
   * @returns 返回一个 Promise，包含请求的结果数据
   * @template T 请求结果的数据类型，默认为 any
   */
  protected put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.api.put<T, AxiosResponse<T>>(url, data, config).then(response => response.data);
  }

  /**
   * 发起 DELETE 请求
   * @param url 请求的 URL
   * @param config 请求的配置项
   * @returns 返回一个 Promise，包含请求的结果数据
   * @template T 请求结果的数据类型，默认为 any
   */
  protected delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.api.delete<T, AxiosResponse<T>>(url, config).then(response => response.data);
  }
}