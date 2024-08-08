import GeneralDetail from "./GeneralDetail.update";

function UpdateDetail() {
  return (
    <div className="flex flex-col gap-y-3">
      <h1 className="font-semibold">2.Cập nhật thông tin</h1>
      <div className="flex gap-x-5 w-[1000px] justify-between mx-auto">
        <GeneralDetail></GeneralDetail>
      </div>
    </div>
  );
}

export default UpdateDetail;
