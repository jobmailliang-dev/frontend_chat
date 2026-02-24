import { generateUUID } from './uuidGenerator';

const ANONYMOUS_ID_KEY = 'anonymous_user_id';
const ANONYMOUS_NAME_KEY = 'anonymous_user_name';

/**
 * 生成随机字符串
 * @param {number} length - 字符串长度
 * @returns {string} 随机字符串
 */
function generateRandomString(length = 5) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 生成匿名用户名
 * @returns {string} 格式为"匿名用户+[随机字符]"的用户名
 */
function generateAnonymousUsername() {
  const randomStr = generateRandomString();
  return `匿名用户${randomStr}`;
}

/**
 * 获取或创建匿名用户ID
 * @returns {string} 用户ID
 */
export function getOrCreateAnonymousId() {
  let userId = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem(ANONYMOUS_ID_KEY, userId);
  }
  return userId;
}

/**
 * 获取或创建匿名用户名
 * @returns {string} 用户名
 */
export function getOrCreateAnonymousName() {
  let userName = localStorage.getItem(ANONYMOUS_NAME_KEY);
  if (!userName) {
    userName = generateAnonymousUsername();
    localStorage.setItem(ANONYMOUS_NAME_KEY, userName);
  }
  return userName;
}

/**
 * 获取用户身份信息
 * @returns {Object} 包含用户ID、用户名和类型的对象
 */
export function getUserIdentity() {
  const userId = getOrCreateAnonymousId();
  const userName = getOrCreateAnonymousName();

  return {
    id: userId,
    name: userName,
    type: 'anonymous' // 标识为匿名用户类型，便于后续扩展真实用户功能
  };
}

/**
 * 检查用户是否为匿名用户
 * @returns {boolean} 是否为匿名用户
 */
export function isAnonymousUser() {
  return !!localStorage.getItem(ANONYMOUS_ID_KEY);
}

/**
 * 清除匿名用户身份信息
 */
export function clearAnonymousIdentity() {
  localStorage.removeItem(ANONYMOUS_ID_KEY);
  localStorage.removeItem(ANONYMOUS_NAME_KEY);
}

/**
 * 初始化用户身份（检查并创建必要的身份信息）
 * @returns {Object} 用户身份信息
 */
export function initializeIdentity() {
  return getUserIdentity();
}