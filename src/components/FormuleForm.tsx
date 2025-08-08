
// This file is kept for backward compatibility but imports from the new location
import FormuleForm, { FormuleForm as FormuleFormComponent } from "./formule/FormuleForm";
import { formuleSchema } from "./formule/FormuleFormSchema";
import type { FormuleFormData } from "./formule/FormuleFormSchema";

export type { FormuleFormData };
export { FormuleFormComponent as FormuleForm };
export { formuleSchema };
export default FormuleForm;

