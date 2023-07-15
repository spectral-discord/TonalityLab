import type { EditTuningById } from 'types/graphql'

import { Form, FormError, FieldError, Label, TextField } from '@redwoodjs/forms'
import type { RWGqlError } from '@redwoodjs/forms'

type FormTuning = NonNullable<EditTuningById['tuning']>

interface TuningFormProps {
  tuning?: EditTuningById['tuning']
  error: RWGqlError
  loading: boolean
}

const TuningForm = (props: TuningFormProps) => {
  return (
    <div className="rw-form-wrapper">
      <Form<FormTuning> error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <div className="flex flex-col sm:flex-row sm:gap-4">
          <div className="w-full sm:w-fit sm:basis-1/4 md:basis-1/5">
            <Label name="name" className="rw-label" errorClassName="rw-label rw-label-error">
              Name
            </Label>

            <TextField
              name="name"
              defaultValue={props.tuning?.name}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
            />

            <FieldError name="name" className="rw-field-error" />
          </div>
          <div className="grow">
            <Label name="description" className="rw-label" errorClassName="rw-label rw-label-error">
              Description
            </Label>

            <TextField
              name="description"
              defaultValue={props.tuning?.description}
              className="rw-input"
              errorClassName="rw-input rw-input-error"
            />

            <FieldError name="description" className="rw-field-error" />
          </div>
        </div>
      </Form>
    </div>
  )
}

export default TuningForm
