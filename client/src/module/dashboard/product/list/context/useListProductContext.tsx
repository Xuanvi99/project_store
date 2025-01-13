import useTestContext from "@/hook/useTestContext";
import { IListProductProvide, ListProductContext } from ".";

function useListProductContext() {
  return useTestContext<IListProductProvide>(
    ListProductContext as React.Context<IListProductProvide>
  );
}

export default useListProductContext;
