import {
  Box,
  Field,
  Stack,
  FieldLabel,
  Flex,
  FieldInput,
  FieldHint,
  FieldError,
} from '@strapi/design-system';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTranslationId';

const encryptableFieldInput = ({
  description,
  placeholder,
  disabled,
  error,
  intlLabel,
  labelAction,
  name,
  onChange,
  required,
  value,
  attribute,
}): JSX.Element => {
  const { formatMessage } = useIntl();
  const reference = useRef(null);

  return (
    <Box>
      <Field
        id={name}
        name={name}
        hint={attribute.options?.hint ?? description ?? ''}
        error={error}
        required={required}
      >
        <Stack spacing={1}>
          <Flex>
            <FieldLabel action={labelAction} required={required}>
              {formatMessage(intlLabel)}
            </FieldLabel>
          </Flex>
          <FieldInput
            ref={reference}
            id="encryptable-field-value"
            disabled={disabled}
            required={required}
            name={name}
            aria-label={formatMessage({
              id: getTrad('encryptable-field.input.aria-label'),
              defaultMessage: 'Encryptable input',
            })}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            hint={description}
          />
          <FieldHint />
          <FieldError />
        </Stack>
      </Field>
    </Box>
  );
};

encryptableFieldInput.defaultProps = {
  description: null,
  disabled: false,
  error: null,
  labelAction: null,
  required: false,
  value: '',
};

encryptableFieldInput.propTypes = {
  intlLabel: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  labelAction: PropTypes.object,
  required: PropTypes.bool,
  value: PropTypes.string,
};

export default encryptableFieldInput;
