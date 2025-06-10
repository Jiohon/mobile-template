import { ImageUploader } from "antd-mobile"

import { ExpandRendererPropsType, SchemaFormValuesType } from "../../types"

import type { ImageUploaderProps } from "antd-mobile"

export interface UploadRendererProps<TValues extends SchemaFormValuesType>
  extends ExpandRendererPropsType<"upload", ImageUploaderProps, TValues> {}

const UploadRenderer = <TValues extends SchemaFormValuesType>({
  formItemProps,
  ...restProps
}: UploadRendererProps<TValues>) => {
  return <ImageUploader {...restProps} />
}

export default UploadRenderer
