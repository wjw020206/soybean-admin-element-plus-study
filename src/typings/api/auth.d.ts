declare namespace Api {
  /**
   * 命名空间 Auth
   *
   * 后端 API 模块："auth"
   */
  namespace Auth {
    /** 登录 Token */
    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    /** 用户信息 */
    interface UserInfo {
      userId: string;
      userName: string;
      roles: string[];
      buttons: string[];
    }
  }
}
