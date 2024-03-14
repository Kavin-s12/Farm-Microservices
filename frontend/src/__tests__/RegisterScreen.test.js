import RegisterScreen from "../screens/RegisterScreen";
import {
  screen,
  fireEvent,
  render as rtlRender,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as userActionModule from "../action/userAction";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const mockAxios = new MockAdapter(axios);

describe("Register Screen", () => {
  const initialState = {
    userRegister: {
      error: null,
      loading: false,
      userInfo: null,
    },
  };

  const mockStore = configureStore([thunk]);
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    jest.spyOn(userActionModule, "register");
  });

  afterEach(() => {
    mockAxios.reset();
    jest.restoreAllMocks();
  });

  const render = (component) =>
    rtlRender(
      <Provider store={store}>
        <Router>{component}</Router>
      </Provider>
    );

  test("Check register form correctly", () => {
    render(<RegisterScreen />);

    expect(
      screen.getByRole("heading", { name: "Sign Up" })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Register" })
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
  });

  test("submits the form correctly", async () => {
    const { getByLabelText } = render(<RegisterScreen />);

    fireEvent.change(getByLabelText(/name/i), {
      target: { value: "test" },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });

    mockAxios.onPost("/api/users").reply(200, {
      name: "test",
      email: "test@example.com",
    });

    // Simulate form submission
    fireEvent.click(screen.getByTestId("Register-button"));

    await waitFor(() => {
      expect(userActionModule.register).toHaveBeenCalledWith(
        "test",
        "test@example.com",
        "password123"
      );

      expect(store.getActions()).toContainEqual({
        type: "USER_REGISTER_REQUEST",
      });
      expect(store.getActions()).toContainEqual({
        type: "USER_LOGIN_SUCCESS",
        payload: {
          name: "test",
          email: "test@example.com",
        },
      });
      expect(store.getActions()).toContainEqual({
        type: "USER_REGISTER_SUCCESS",
        payload: {
          name: "test",
          email: "test@example.com",
        },
      });
    });

    expect(JSON.parse(localStorage.getItem("userInfo"))).toEqual({
      name: "test",
      email: "test@example.com",
    });
  });

  test("Check unmatch password error", async () => {
    const { getByLabelText } = render(<RegisterScreen />);

    fireEvent.change(getByLabelText(/name/i), {
      target: { value: "test" },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(getByLabelText(/confirm password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByTestId("Register-button"));

    await waitFor(() => {
      expect(screen.getByText("Password do not match"));
    });
  });

  test("Name error check", async () => {
    const { getByLabelText } = render(<RegisterScreen />);

    fireEvent.change(getByLabelText(/name/i), {
      target: { value: "" },
    });
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });

    mockAxios.onPost("/api/users").reply(500, {});

    // Simulate form submission
    fireEvent.click(screen.getByTestId("Register-button"));

    await waitFor(() => {
      expect(userActionModule.register).toHaveBeenCalledWith(
        "",
        "test@example.com",
        "password123"
      );

      expect(store.getActions()).toContainEqual({
        type: "USER_REGISTER_REQUEST",
      });

      expect(store.getActions()).toContainEqual({
        type: "USER_REGISTER_FAIL",
        payload: "Request failed with status code 500",
      });
    });
  });
});
