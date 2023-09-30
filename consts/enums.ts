export enum AppRoutes {
  Signin = '/auth/signin',
  Signup = '/auth/signup',
  App = '/discord'
}

export enum RegisterFormVariant {
  Signin = 'signin',
  Signup = 'signup'
}

export enum ApiRoute {
  CreateServer = '/api/server/create-server',
  UpdateInviteCode = '/api/server/update-server',
  LeaveServer = '/api/server/leave-server',
  Members = '/api/members',
  Channel = '/api/channel'
}

export enum IoEvent {
  ChatError = 'chat-error',
  ChatMessages = 'chat-messages'
}
