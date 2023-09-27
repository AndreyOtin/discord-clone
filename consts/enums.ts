export enum AppRoutes {
  Signin = '/auth/signin',
  Signup = '/auth/signup',
  App = '/discord',
  Server = '/server'
}

export enum RegisterFormVariant {
  Signin = 'signin',
  Signup = 'signup'
}

export enum ApiRoutes {
  CreateServer = '/api/server/create-server',
  UpdateInviteCode = '/api/server/update-server',
  LeaveServer = '/api/server/leave-server',
  Members = '/api/members',
  Channel = '/api/channel'
}
