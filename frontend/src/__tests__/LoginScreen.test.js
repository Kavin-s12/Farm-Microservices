import React from "react";
import {
  render as rtlRender,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import LoginScreen from "../screens/LoginScreen";
import * as userActionModule from "../action/userAction";

const mockAxios = new MockAdapter(axios);

describe("LoginScreen", () => {
  const initialState = {
    userLogin: {
      error: null,
      loading: false,
      userInfo: null,
    },
  };
  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.spyOn(userActionModule, "login");
  });

  afterEach(() => {
    mockAxios.reset();
    jest.restoreAllMocks();
  });

  const render = (Component) =>
    rtlRender(
      <Provider store={store}>
        <Router>{Component}</Router>
      </Provider>
    );

  test("renders sign-in form correctly", async () => {
    render(<LoginScreen />);
    expect(
      screen.getByRole("heading", { name: "Sign in" })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    expect(screen.getByTestId("signIn-button")).toBeInTheDocument();

    expect(screen.getByText("New Customer?")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  test("handles form submission", async () => {
    render(<LoginScreen />);

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    expect(screen.getByLabelText("Email Address").value).toBe(
      "test@example.com"
    );
    expect(screen.getByLabelText("Password").value).toBe("password123");

    mockAxios.onPost("/api/users/login").reply(200, {
      email: "test@example.com",
    });

    fireEvent.click(screen.getByTestId("signIn-button"));

    await waitFor(() => {
      expect(userActionModule.login).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
      expect(store.getActions()).toContainEqual({ type: "USER_LOGIN_REQUEST" });
      expect(store.getActions()).toContainEqual({
        type: "USER_LOGIN_SUCCESS",
        payload: {
          email: "test@example.com",
        },
      });
    });

    expect(JSON.parse(localStorage.getItem("userInfo"))).toEqual({
      email: "test@example.com",
    });
  });
});
