import { Form, Formik } from "formik";
import * as yup from "yup";

import CheckboxField from "src/components/CheckboxField";
import DateField from "src/components/DateField";
import FormActions from "src/components/FormActions";
import TextField from "src/components/TextField";
import type { ITodoData } from "src/queries";

interface IProps {
  initialValues: ITodoData;
  label: string;
  onSubmit: (data: ITodoData) => Promise<any>;
}

const validationSchema = yup.object({
  complete: yup.boolean(),
  due: yup.date().nullable(),
  task: yup.string().required("Required"),
});

const TodoForm = ({ initialValues, label, onSubmit }: IProps) => (
  <Formik<ITodoData>
    initialValues={initialValues}
    onSubmit={onSubmit}
    validationSchema={validationSchema}
  >
    {({ dirty, isSubmitting }) => (
      <Form>
        <TextField fullWidth label="Task" name="task" required />
        <DateField fullWidth label="Due" name="due" />
        <CheckboxField fullWidth label="Complete" name="complete" />
        <FormActions
          disabled={!dirty}
          isSubmitting={isSubmitting}
          label={label}
          links={[{ label: "Back", to: "/" }]}
        />
      </Form>
    )}
  </Formik>
);

export default TodoForm;
