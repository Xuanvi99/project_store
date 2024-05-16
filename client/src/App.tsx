import { Suspense, useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import router from "./router";
import { useAppDispatch, useAppSelector } from "./hook";
import { useRefreshTokenMutation } from "./stores/service/auth.service";
import { logOut, updateAuth } from "./stores/reducer/authReducer";
import { useGetCartQuery } from "./stores/service/cart.service";
import { updateCart } from "./stores/reducer/cartReducer";
import { RootState } from "./stores";

function App() {
  const user = useAppSelector((state: RootState) => state.authSlice.user);
  const [refreshToken] = useRefreshTokenMutation();
  const dispatch = useAppDispatch();
  const effectRun = useRef(false);
  const id = user ? user._id : "";
  const { data: cart, status } = useGetCartQuery(id, { skip: !id });

  useEffect(() => {
    if (!effectRun.current && !user) {
      refreshToken()
        .unwrap()
        .then((res) => {
          dispatch(updateAuth({ ...res, isLogin: true }));
        })
        .catch(() => {
          dispatch(logOut());
        });
    }
    return () => {
      effectRun.current = true;
    };
  }, [dispatch, refreshToken, user]);

  useEffect(() => {
    if (cart && status === "fulfilled") {
      dispatch(updateCart(cart));
    }
  }, [cart, dispatch, status]);

  return (
    <ErrorBoundary FallbackComponent={fallbackRender}>
      <Suspense fallback={<></>}>
        <RouterProvider router={router}></RouterProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

function fallbackRender({ error }: { error: { message: string } }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

export default App;
