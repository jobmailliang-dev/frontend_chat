// 测试身份管理功能
import { getUserIdentity, isAnonymousUser } from './utils/auth';

console.log('=== 匿名身份管理测试 ===');

// 获取或创建用户身份
const identity = getUserIdentity();
console.log('用户身份信息:', identity);

// 检查是否为匿名用户
console.log('是否为匿名用户:', isAnonymousUser());

console.log('=== 测试完成 ===');