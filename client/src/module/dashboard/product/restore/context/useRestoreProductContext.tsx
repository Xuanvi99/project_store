import useTestContext from "@/hook/useTestContext";
import { IRestoreProductProvide, RestoreProductContext } from ".";

function useRestoreProductContext() {
  return useTestContext<IRestoreProductProvide>(
    RestoreProductContext as React.Context<IRestoreProductProvide>
  );
}

export default useRestoreProductContext;
