/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsonFetch } from "tools";
import {
  ActionTypes,
  AuthStartActionType,
  AuthFailActionType,
  RegistrationSuccessActionType,
  LoginSuccessActionType,
  CommonActionType,
} from "./interfaces";
import { Dispatch } from "react";

const startAuth = (): AuthStartActionType => {
  return { type: ActionTypes.AUTH_START };
};

const failAuth = (error: string): AuthFailActionType => {
  return {
    type: ActionTypes.AUTH_FAIL,
    payload: { error },
  };
};

const regSuccess = (user: any): RegistrationSuccessActionType => {
  return {
    type: ActionTypes.REGISTRATION_SUCCESS,
    payload: { user },
  };
};

const loginSuccess = (user: any): LoginSuccessActionType => {
  return {
    type: ActionTypes.LOGIN_SUCCESS,
    payload: { user },
  };
};

export const register = (login: string, email: string, password: string, repeatPassword: string) => {
  return async (dispatch: Dispatch<CommonActionType>): Promise<void> => {
    try {
      dispatch(startAuth());
      const { user } = await jsonFetch("/api/auth/register", {
        login, email, password, repeatPassword,
      });
      dispatch(regSuccess(user));
    } catch (err: any) {
      dispatch(failAuth(err.message || err));
    }
  };
};

export const login = (login: string, password: string) => {
  return async (dispatch: Dispatch<CommonActionType>): Promise<void> => {
    try {
      dispatch(startAuth());
      const { user } = await jsonFetch("/api/auth/login", {
        login, password,
      });
      dispatch(loginSuccess(user));
    } catch (err: any) {
      dispatch(failAuth(err.message || err));
    }
  };
};
