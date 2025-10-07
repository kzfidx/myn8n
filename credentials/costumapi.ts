/**
 * 自定义 Credential：MyCustomApi
 * 适用场景：
 *   - 需要通过 API Key 或 Token 访问的 HTTP 接口
 *   - 例如：Weather API、Bark 推送、Notion API、自建后端等
 * 
 * 文件放置位置：
 *   - 本地环境：~/.n8n/custom/credentials/MyCustomApi.credentials.ts
 *   - Docker 环境：/home/node/.n8n/credentials/MyCustomApi.credentials.ts
 * 
 * 使用前提：
 *   - 重启 n8n，系统会自动加载这个自定义 Credential。
 *   - 在 HTTP Request 节点选择 “Generic Credential Type”，并选择 “My Custom API”。
 */

import {
  IAuthenticateGeneric,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

/**
 * Credential 主类定义
 * name 和 displayName 都是必须字段
 * - name：系统内部识别用，唯一名称
 * - displayName：n8n UI 里显示给用户看的名称
 */
export class MyCustomApi implements ICredentialType {
  name = 'CustomApi'; // 唯一标识，不可重复
  displayName = 'My Custom API'; // 在 Credential 界面显示的名称
  documentationUrl = ''; // 可选，填写对应 API 官方文档链接

  /**
   * Credential 属性定义（UI 里可填写的字段）
   * - displayName：UI 上的显示名称
   * - name：内部变量名，可通过 $credentials.xxx 访问
   * - type：字段类型（string、number、boolean 等）
   * - default：默认值
   * - typeOptions.password：true 表示在 UI 里显示为密码框
   * - description：UI 里鼠标悬停提示
   */
  properties: INodeProperties[] = [
    {
      displayName: 'API Key', // 显示名称
      name: 'apiKey',         // 存储变量名：$credentials.apiKey
      type: 'string',         // 数据类型
      default: '',            // 默认空值
      typeOptions: { password: true }, // 密码框显示
      description: 'Your API key for authentication', // 提示
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: '',
      description: 'Base URL of your API (e.g. https://api.example.com)',
    },
  ];

  /**
   * 认证机制定义（authenticate）
   * type: generic —— 通用类型
   * properties: 自动添加到每个 HTTP 请求的内容
   * 
   * headers.Authorization 会自动拼接成：
   *    Authorization: Bearer <apiKey>
   * 
   * 这样你在 HTTP Request 节点中就不需要手动写 Header 了。
   */
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '={{"Bearer " + $credentials.apiKey}}',
      },
    },
  };
}
