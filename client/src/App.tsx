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
import LoadingSpinner from "./components/loading";
import { cn } from "./utils";

function App() {
  const user = useAppSelector((state: RootState) => state.authSlice.user);
  const [refreshToken] = useRefreshTokenMutation();
  const dispatch = useAppDispatch();
  const effectRun = useRef(false);
  const id = user ? user._id : "";
  const { data: cart, status } = useGetCartQuery(id, { skip: !id });

  useEffect(() => {
    const handleRefetch = async () => {
      await refreshToken()
        .unwrap()
        .then((res) => {
          dispatch(updateAuth({ ...res, isLogin: true }));
        })
        .catch(() => {
          dispatch(logOut());
        });
    };
    if (!effectRun.current && !user) {
      handleRefetch();
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
      <Suspense
        fallback={
          <div
            className={cn(
              "relative w-full h-screen",
              "before:absolute before:left-1/2 before:top-1/2  before:-translate-x-1/2 before:-translate-y-1/2 before:w-16  before:h-16 before:border-grayCa before:rounded-full before:border-4  before:z-20"
            )}
          >
            <span className="absolute z-30 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 top-1/2">
              <LoadingSpinner className="w-16 h-16 border-4 left-1/2 top-1/2 border-r-orange border-l-transparent border-t-transparent border-b-transparent"></LoadingSpinner>
            </span>
          </div>
        }
      >
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
