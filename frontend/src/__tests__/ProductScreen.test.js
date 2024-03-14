import {
  fireEvent,
  render as rtlRender,
  screen,
  waitFor,
} from "@testing-library/react";
import ProductScreen from "../screens/ProductScreen";
import "@testing-library/jest-dom/extend-expect";
import {
  MemoryRouter,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import thunk from "redux-thunk";

const mockAxios = new MockAdapter(axios);

describe("Product Screen", () => {
  const render = (component) =>
    rtlRender(
      <Provider store={store}>
        <Router>{component}</Router>
      </Provider>
    );

  const mockStore = configureStore([thunk]);

  const initialState = {
    userLogin: {
      userInfo: {
        id: "123",
        name: "test",
        email: "test@example.com",
      },
    },
    productDetails: {
      loading: false,
      error: null,
      product: {
        id: "1",
        name: "Test Product",
        price: 100,
        rating: 4,
        numReviews: 8,
        countInStock: 10,
        description: "This is a test product.",
        reviews: [],
        image: "test-image.jpg",
      },
    },
    productReview: {
      loading: false,
      error: null,
      success: false,
    },
  };

  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    mockAxios.reset();
  });

  test("Back button", () => {
    render(<ProductScreen />);
    const backButton = screen.getByTestId("back-button");
    expect(backButton).toBeInTheDocument();
  });

  global.alert = jest.fn();

  test("renders product details and review form", async () => {
    // Mock Axios response for fetching product details
    mockAxios
      .onGet("/api/products/1")
      .reply(200, initialState.productDetails.product);

    rtlRender(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/products/1"]}>
          <Routes>
            <Route path='/products/:id' element={<ProductScreen />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for product details to be loaded
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Test Product" })
      ).toBeInTheDocument();
      expect(screen.getByText("Price: Rs.100")).toBeInTheDocument();
      expect(screen.getByText("In Stock")).toBeInTheDocument();
    });

    // Simulate user selecting a rating and adding a review
    fireEvent.change(screen.getByLabelText("Rating"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText("Comments"), {
      target: { value: "Great product!" },
    });

    // Mock Axios response for submitting a review
    mockAxios
      .onPost("/api/products/1/reviews")
      .reply(201, { message: "Review submitted" });

    // Simulate form submission
    fireEvent.submit(screen.getByRole("button", { name: "Submit" }));

    // Wait for the review submission to complete
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Review submitted");
    });
  });
});
