import { Suspense, useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import router from "./router";
import { useAppDispatch, useAppSelector } from "./hook";
import { useRefreshTokenMutation } from "./stores/service/auth.service";
import { updateUser } from "./stores/reducer/authReducer";

function App() {
  const user = useAppSelector((state) => state.authSlice.user);
  const [refreshToken] = useRefreshTokenMutation();
  const dispatch = useAppDispatch();
  const effectRun = useRef(false);

  useEffect(() => {
    if (!effectRun.current && !user) {
      refreshToken()
        .unwrap()
        .then((res) => dispatch(updateUser(res)));
    }
    return () => {
      effectRun.current = true;
    };
  }, [dispatch, refreshToken, user]);

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
