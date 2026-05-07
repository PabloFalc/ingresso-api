export const AuthGuard = jest.fn().mockImplementation(() => ({
  canActivate: jest.fn().mockReturnValue(true),
}));

export const AuthModule = {
  forRoot: jest.fn().mockReturnValue({
    module: class AuthModuleMock {},
    providers: [],
    exports: [],
  }),
};

export const CurrentUser = () => jest.fn();
export const Session = () => jest.fn();
