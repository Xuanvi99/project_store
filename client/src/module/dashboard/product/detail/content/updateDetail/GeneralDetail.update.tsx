import { DropdownForm } from "@/components/dropdown";
import { ErrorInput } from "@/components/error";
import Field from "@/components/fields";
import { InputForm } from "@/components/input";
import { Label } from "@/components/label";
import useTestContext from "@/hook/useTestContext";
import { useGetAllCategoryQuery } from "@/stores/service/category.service";
import { useRemoveWithImageUrlMutation } from "@/stores/service/image.service";
import {
  useCheckNameMutation,
  useUpdateInfoProductMutation,
} from "@/stores/service/product.service";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { DetailProductContext, IDetailProductProvide } from "../../context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/button";
import InputRadio from "@/components/input/InputRadio";
import { Editor } from "@tinymce/tinymce-react";
import { cn } from "@/utils";
import { toast } from "react-toastify";
import { formatPrice } from "../../../../../../utils/index";

interface BlobInfo {
  id: () => string;
  name: () => string;
  filename: () => string;
  blob: () => Blob;
  base64: () => string;
  blobUri: () => string;
  uri: () => string | undefined;
}

type ProgressFn = (percent: number) => void;

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Vui lòng điền vào mục này.")
    .min(8, "Tên sản phẩm ít nhất 8 ký tự"),
  brand: Yup.string().required("Vui lòng điền vào mục này."),
  desc: Yup.string().required("Vui lòng điền vào mục này."),
  status: Yup.string()
    .required("Vui lòng điền vào mục này.")
    .oneOf(["active", "inactive"]),
  is_sale: Yup.bool()
    .required("")
    .oneOf([true, false], "Field must be checked"),
  price: Yup.number()
    .required("Vui lòng điền thông tin")
    .typeError("Giá sản phẩm không hợp lệ")
    .min(0, "Giá sản phẩm không hợp lệ"),
  priceSale: Yup.number()
    .required("Vui lòng điền thông tin")
    .typeError("Giá sale sản phẩm không hợp lệ")
    .min(0, "Giá sản phẩm không hợp lệ")
    .test("invalid", "Giá sale phải nhỏ hơn giá gốc", (value, context) => {
      return !context.parent.is_sale && value < context.parent.price;
    }),
});

type TBrandOptions = {
  label: string;
  value: string;
  id: string;
}[];

type FormValues = Yup.InferType<typeof validationSchema>;

function GeneralDetail() {
  const { product } = useTestContext<IDetailProductProvide>(
    DetailProductContext as React.Context<IDetailProductProvide>
  );

  const [removeWithImageUrl] = useRemoveWithImageUrlMutation();

  const [checkName] = useCheckNameMutation();

  const [brandOptions, setBrandOptions] = useState<TBrandOptions>([]);

  const { data: category, status } = useGetAllCategoryQuery();

  const [updateInfoProduct] = useUpdateInfoProductMutation();

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    clearErrors,
    watch,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      name: "",
      brand: "",
      desc: "",
      status: "",
      is_sale: false,
      price: 0,
      priceSale: 0,
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });
  console.log(watch());
  console.log(errors);

  const validateForm = () => {
    if (
      !watch("name") ||
      !watch("brand") ||
      !watch("desc") ||
      !watch("price") ||
      !watch("status")
    ) {
      return false;
    }
    return true;
  };

  const image_upload_handler = (blobInfo: BlobInfo, progress: ProgressFn) =>
    new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open("POST", "http://localhost:3000/api/image/createSingle");

      xhr.upload.onprogress = (e) => {
        progress((e.loaded / e.total) * 100);
      };

      xhr.onload = () => {
        if (xhr.status === 403) {
          reject({ message: "HTTP Error: " + xhr.status, remove: true });
          return;
        }

        if (xhr.status < 200 || xhr.status >= 300) {
          reject("HTTP Error: " + xhr.status);
          return;
        }

        const json = JSON.parse(xhr.responseText);

        if (!json || typeof json.location != "string") {
          reject("Invalid JSON: " + xhr.responseText);
          return;
        }

        resolve(json.location);
      };

      xhr.onerror = () => {
        reject(
          "Image upload failed due to a XHR Transport error. Code: " +
            xhr.status
        );
      };

      const formData = new FormData();
      formData.append("image", blobInfo.blob(), blobInfo.filename());
      formData.append("folder", "product");

      xhr.send(formData);
    });

  const handleFocusInput = (id: string) => {
    const inputSize = document.getElementById(id) as HTMLInputElement;
    if (inputSize) {
      inputSize.select();
    }
  };

  const handleBLurInput = (field: keyof FormValues) => {
    const fieldForm = watch(`${field}`);
    if (!fieldForm && product) {
      setValue(`${field}`, product[`${field}`]);
      clearErrors(`${field}`);
    }
    if (
      field === "priceSale" &&
      Number(watch("priceSale")) >= Number(watch("price"))
    ) {
      setError("priceSale", {
        message: "Giá sale phải nhỏ hơn giá gốc",
        type: "invalid",
      });
    }
  };

  const handleChangeName = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.currentTarget.value;
    if (product && name.length > 8 && name !== product.name) {
      await checkName({ name: event.currentTarget.value })
        .unwrap()
        .then(() => {
          clearErrors("name");
        })
        .catch((error) => {
          const data = error.data as { errorMessage: string };
          setError("name", { message: data.errorMessage });
        });
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (product) {
      await updateInfoProduct({ productId: product?._id, body: data })
        .then(() => {
          toast("Cập nhật thông tin thành công", { type: "success" });
        })
        .catch(() => {
          toast("Cập nhật thông tin thất bại", { type: "error" });
        });
    }
  };

  useEffect(() => {
    if (category && status === "fulfilled") {
      const data = category.data;
      const options = [];
      for (let i = 0; i < data?.length; i++) {
        options.push({
          label: data[i].name,
          value: data[i].name,
          id: `${i + 1}`,
        });
      }
      setBrandOptions([...options]);
    }
  }, [category, status]);

  useEffect(() => {
    if (product) {
      reset(
        {
          name: product.name,
          brand: product.brand,
          status: product.status,
          is_sale: product.is_sale,
          price: product.price,
          priceSale: product.priceSale,
          desc: product.desc,
        },
        { keepDirtyValues: true }
      );
    }
  }, [product, reset]);

  if (!product) return;

  return (
    <div className="flex flex-col w-full rounded-md shadow-md shadow-gray">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "flex-col text-sm gap-y-5 flex shadow-shadow1 p-5 transition-all bg-white"
        )}
      >
        <h1 className="text-lg font-semibold text-orange">1.Thông tin chung</h1>
        <div className="flex w-full gap-x-7">
          <Field variant="flex-col" className="basis-1/2 gap-y-2">
            <Label
              htmlFor="phoneOrEmail"
              className="font-semibold text-secondary"
            >
              Tên sản phẩm:
            </Label>
            <InputForm
              control={control}
              type="text"
              name="name"
              id="name"
              placeholder="ví dụ: Shoes adidas"
              onFocus={() => handleFocusInput("name")}
              onBlur={() => handleBLurInput("name")}
              onChange={(event) => handleChangeName(event)}
              className={{ input: `${dirtyFields.name && "border-orange"}` }}
              error={errors["name"] ? true : false}
            />
            <ErrorInput text={errors["name"]?.message} />
          </Field>
          <Field variant="flex-col" className="basis-1/2 gap-y-2">
            <Label htmlFor="category" className="font-semibold text-secondary">
              Thương hiệu:
            </Label>
            <DropdownForm
              control={control}
              name="brand"
              title={product.brand || "Lựa chọn"}
              options={brandOptions}
              error={errors.brand && !watch("brand")}
              search={{
                display: true,
                place: "top",
              }}
              className={{
                option:
                  "max-h-[160px] overflow-y-scroll rounded-none text-base font-bold",
                select: cn(
                  "shadow-none border-1 border-grayCa rounded-md",
                  dirtyFields.brand && "border-orange"
                ),
              }}
              onClick={(option) => {
                if (option.value === product.brand) {
                  reset({ brand: option.value });
                } else {
                  setValue("brand", option.value, {
                    shouldDirty: true,
                  });
                }
              }}
            />
            <ErrorInput text={errors["brand"]?.message} />
          </Field>
        </div>
        <Field variant="flex-row" className="basis-1/2 gap-y-3">
          <Label htmlFor="" className="font-semibold text-secondary">
            Sale:
          </Label>
          <div className="flex items-center gap-x-5">
            <span className="flex items-center gap-x-2">
              <InputRadio
                control={control}
                name="is_sale"
                id="is_sale_true"
                checked={watch("is_sale") === true}
                onChange={() => setValue("is_sale", true)}
              ></InputRadio>
              <label htmlFor="is_sale_true">Có</label>
            </span>
            <span className="flex items-center gap-x-2">
              <InputRadio
                control={control}
                name="is_sale"
                id="is_sale_false"
                checked={watch("is_sale") === false}
                onChange={() => {
                  setValue("is_sale", false)
                  setValue("priceSale", 0)
                } }
              ></InputRadio>
              <label htmlFor="is_sale_false">Không</label>
            </span>
          </div>
        </Field>
        <div className="flex w-full gap-x-7">
          <Field variant="flex-col" className="basis-1/2 gap-y-2">
            <Label
              htmlFor="price"
              className="flex font-semibold text-secondary gap-x-2"
            >
              <span>Giá gốc (vnđ):</span>
              <span className="text-danger">
                {formatPrice(watch("price"))}₫
              </span>
            </Label>
            <InputForm
              control={control}
              type="number"
              name="price"
              id="price"
              onFocus={() => handleFocusInput("price")}
              onBlur={() => handleBLurInput("price")}
              onChange={() => {
                setValue("price", Number(watch("price")));
                clearErrors("price");
              }}
              error={errors["price"] ? true : false}
            />
            <ErrorInput text={errors["price"]?.message} />
          </Field>
          <Field variant="flex-col" className="basis-1/2 gap-y-2">
            <Label
              htmlFor="priceSale"
              className="flex font-semibold text-secondary gap-x-2"
            >
              <span>Giá sale (vnđ):</span>
              <span className="text-danger">
                {formatPrice(watch("priceSale"))}₫
              </span>
            </Label>
            <InputForm
              control={control}
              type="number"
              name="priceSale"
              id="priceSale"
              onFocus={() => handleFocusInput("priceSale")}
              onBlur={() => handleBLurInput("priceSale")}
              onChange={() => {
                setValue("priceSale", Number(watch("priceSale")));
                clearErrors("priceSale");
              }}
              disabled={!watch("is_sale")}
              error={errors["priceSale"] ? true : false}
            />
            <ErrorInput text={errors["priceSale"]?.message} />
          </Field>
        </div>
        <Field variant="flex-col" className="basis-1/2 gap-y-3">
          <Label htmlFor="" className="font-semibold text-secondary">
            Trạng thái:
          </Label>
          <div className="flex items-center gap-x-5">
            <span className="flex items-center gap-x-2">
              <InputRadio
                control={control}
                name="status"
                id="active"
                value="active"
                checked={watch("status") === "active"}
              ></InputRadio>
              <Label htmlFor="active">Bán</Label>
            </span>
            <span className="flex items-center gap-x-2">
              <InputRadio
                control={control}
                name="status"
                id="inactive"
                value="inactive"
                checked={watch("status") === "inactive"}
              ></InputRadio>
              <Label htmlFor="inactive">Ngừng bán</Label>
            </span>
          </div>
        </Field>
        <Field variant="flex-col" className="basis-1/2 gap-y-2">
          <InputForm control={control} type="text" name="desc" />
          <Label
            htmlFor="phoneOrEmail"
            className="font-semibold text-secondary"
          >
            Mô tả sản phẩm<strong className="text-danger">*</strong>
          </Label>
          <Editor
            apiKey="upnnupf3dq8wz66922756jw4v2w241nvoxv3hvhnmqhng63w"
            onEditorChange={(_, editor) => {
              const desc = editor.getContent();
              // console.log(product.desc);
              // console.log(desc);
              // console.log("" + product.desc === "" + desc);
              setValue("desc", desc, {
                shouldDirty: product.desc === desc ? false : true,
              });
              if (editor.getContent() === "") {
                setError("desc", { message: "Vui lòng điền vào mục này." });
              } else {
                clearErrors("desc");
              }
            }}
            initialValue={product.desc || ""}
            init={{
              height: 600,
              width: "100%",
              menubar: false,
              plugins: [
                "advlist",
                "anchor",
                "autolink",
                "charmap",
                "code",
                "fullscreen",
                "help",
                "image",
                "link",
                "lists",
                "preview",
                "searchreplace",
                "table",
                "visualblocks",
                "accordion",
                "table",
              ],
              toolbar1:
                "undo redo  | fontsizeinput  | bold italic underline strikethrough| backcolor forecolor | align bullist numlist |  link image table | charmap",
              font_size_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              images_file_types: "jpg,png,jpeg",
              images_upload_handler: image_upload_handler,
              init_instance_callback: (editor) => {
                const MutationObserver = window.MutationObserver;
                const observer = new MutationObserver(function (
                  mutations_list
                ) {
                  mutations_list.forEach(function (mutation) {
                    mutation.removedNodes.forEach(function (removed_node) {
                      if (removed_node.nodeName == "IMG") {
                        const node = removed_node as HTMLElement;
                        removeWithImageUrl({
                          imageUrl: node.getAttribute("src") as string,
                        });
                      }
                    });
                  });
                });
                observer.observe(editor.getBody(), {
                  subtree: true,
                  childList: true,
                });
              },
            }}
          />
          <ErrorInput text={errors["desc"]?.message} />
        </Field>
        <div className="flex justify-end">
          <Button
            variant="default"
            type="submit"
            disabled={
              Object.keys(errors).length === 0 && validateForm() ? false : true
            }
            className="max-w-[120px] text-sm "
          >
            Cập nhật
          </Button>
        </div>
      </form>
    </div>
  );
}

export default GeneralDetail;
