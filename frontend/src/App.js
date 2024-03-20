import React, { Suspense, lazy } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const ProductScreen = lazy(() => import("./screens/ProductScreen"));
const CartScreen = lazy(() => import("./screens/CartScreen"));
const HomeScreen = lazy(() => import("./screens/HomeScreen"));

const OrderListScreen = lazy(() => import("./screens/OrderListScreen"));
const ProductEditScreen = lazy(() => import("./screens/ProductEditScreen"));
const ProductListScreen = lazy(() => import("./screens/ProductListScreen"));
const UserEditScreen = lazy(() => import("./screens/UserEditScreen"));
const UserListScreen = lazy(() => import("./screens/UserListScreen"));
const OrderScreen = lazy(() => import("./screens/OrderScreen"));
const PlaceOrderScreen = lazy(() => import("./screens/PlaceOrderScreen"));
const PaymentScreen = lazy(() => import("./screens/PaymentScreen"));
const ShippingScreen = lazy(() => import("./screens/ShippingScreen"));
const ProfileScreen = lazy(() => import("./screens/ProfileScreen"));
const RegisterScreen = lazy(() => import("./screens/RegisterScreen"));
const LoginScreen = lazy(() => import("./screens/LoginScreen"));

// testing
function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Suspense>
            <Routes>
              <Route path='/payment' element={<PaymentScreen />} />
              <Route path='/shipping' element={<ShippingScreen />} />
              <Route path='/profile' element={<ProfileScreen />} />
              <Route path='/register' element={<RegisterScreen />} />
              <Route path='/placeorder' element={<PlaceOrderScreen />} />
              <Route path='/admin/userslist' element={<UserListScreen />} />
              <Route
                path='/admin/productslist'
                element={<ProductListScreen />}
              />
              <Route
                path='/admin/productslist/:pageNumber'
                element={<ProductListScreen />}
                exact
              />
              <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
              <Route
                path='/admin/product/:id/edit'
                element={<ProductEditScreen />}
              />
              <Route path='/admin/orderslist' element={<OrderListScreen />} />
              <Route path='/orders/:id' element={<OrderScreen />} />
              <Route path='/login' element={<LoginScreen />} />
              <Route path='/search/:keyword' element={<HomeScreen />} />
              <Route
                path='/search/:keyword/pageNumber/:pageNumber'
                element={<HomeScreen />}
              />
              <Route path='/pageNumber/:pageNumber' element={<HomeScreen />} />
              <Route path='/' element={<HomeScreen />} exact />
              <Route path='/products/:id' element={<ProductScreen />} />
              <Route path='/cart/:id?' element={<CartScreen />} />
            </Routes>
          </Suspense>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
