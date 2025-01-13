import useTestContext from "@/hook/useTestContext";
import { DetailProductContext, IDetailProductProvide } from ".";

function useDetailProductContext() {
  return useTestContext<IDetailProductProvide>(
    DetailProductContext as React.Context<IDetailProductProvide>
  );
}

export default useDetailProductContext;
